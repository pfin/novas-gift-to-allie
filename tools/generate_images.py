#!/usr/bin/env python3
"""
GPT-Image-1 Illustration Generator for Allie's Bilingual Books
===============================================================

This tool generates illustrations for each page of the bilingual books
using OpenAI's gpt-image-1 model, maintaining consistent style across all images.

Usage:
    python tools/generate_images.py [--book BOOK_ID] [--page PAGE_NUM] [--dry-run]

Options:
    --book BOOK_ID    Generate images for specific book only (e.g., book-1-magical-doors)
    --page PAGE_NUM   Generate image for specific page only (requires --book)
    --dry-run         Show prompts without generating images
    --force           Regenerate existing images
    --quality         Image quality: low ($0.011), medium ($0.042), high ($0.167)

Output:
    - Images saved to books/{book-dir}/images/page-{N}.png

Cost Estimates (100 images):
    - LOW:    $1.10
    - MEDIUM: $4.20 (recommended)
    - HIGH:   $16.70
"""

import json
import os
import sys
import time
import base64
import argparse
from pathlib import Path
from io import BytesIO
from openai import OpenAI
from PIL import Image

# Project paths
PROJECT_ROOT = Path(__file__).parent.parent
BOOKS_DIR = PROJECT_ROOT / "books"

# Initialize OpenAI client
client = OpenAI()

# Style prefix for consistent illustration style across all books
STYLE_PREFIX = """Children's book illustration in a warm, whimsical watercolor style perfect for toddlers.
Soft pastel colors with gentle gradients. Characters have large expressive eyes and friendly round faces.
The style should be cozy, inviting, and magical - similar to classic children's books like "Goodnight Moon" or "The Snowy Day".
No text, letters, numbers, or words anywhere in the image. Nothing scary. Safe for children.
Bright, cheerful scene with soft lighting.
"""

# Character consistency guide (appended to prompts featuring these characters)
CHARACTER_GUIDE = {
    "allie": "Allie: 21-month-old Asian-American toddler girl with short black hair in a bob cut, big sparkling brown eyes, rosy round cheeks, wearing a pink dress with a small ladybug pattern.",
    "oscar": "Oscar: fluffy solid grey Scottish Fold cat with distinctive folded ears pointing forward, NO stripes or patterns, just solid grey fur, yellow-green eyes, plump and cute.",
    "peter": "Peter (Daddy): tall lean blonde Caucasian man in his 40s with kind blue eyes, gentle smile, wearing a casual blue shirt.",
    "lu": "Lu (Mommy): petite Asian woman with shoulder-length black hair, warm brown eyes, gentle smile, wearing a cozy sweater.",
    "gong_gong": "Gong Gong (Grandpa): older Asian man with grey hair, round glasses, warm weathered face with kind wrinkles, wearing a traditional Chinese-style shirt.",
    "popo": "Popo (Grandma): older Asian woman with short grey hair in a bob, warm smile with laugh lines, gentle eyes, wearing a comfortable floral blouse."
}


def get_book_directories():
    """Find all book directories with book.json files."""
    book_dirs = []
    for item in BOOKS_DIR.iterdir():
        if item.is_dir() and item.name.startswith("book-"):
            book_json = item / "book.json"
            if book_json.exists():
                book_dirs.append(item)
    return sorted(book_dirs)


def load_book(book_dir):
    """Load a book JSON file."""
    book_json = book_dir / "book.json"
    with open(book_json, "r", encoding="utf-8") as f:
        return json.load(f)


def enhance_prompt(prompt, page_type="story"):
    """Enhance the illustration prompt with style consistency and character details."""
    enhanced = STYLE_PREFIX + "\n"

    # Add character details if mentioned
    prompt_lower = prompt.lower()
    characters_mentioned = []

    # Check for each character
    if "allie" in prompt_lower:
        characters_mentioned.append(CHARACTER_GUIDE["allie"])
    if "oscar" in prompt_lower:
        characters_mentioned.append(CHARACTER_GUIDE["oscar"])
    if "daddy" in prompt_lower or "peter" in prompt_lower:
        characters_mentioned.append(CHARACTER_GUIDE["peter"])
    if "mommy" in prompt_lower or "lu" in prompt_lower:
        characters_mentioned.append(CHARACTER_GUIDE["lu"])
    if "grandpa" in prompt_lower or "gong gong" in prompt_lower or "gōnggong" in prompt_lower:
        characters_mentioned.append(CHARACTER_GUIDE["gong_gong"])
    if "grandma" in prompt_lower or "popo" in prompt_lower or "pópó" in prompt_lower:
        characters_mentioned.append(CHARACTER_GUIDE["popo"])

    if characters_mentioned:
        enhanced += "\nCharacters in this scene:\n"
        for char in characters_mentioned:
            enhanced += f"- {char}\n"

    enhanced += f"\nScene: {prompt}"

    # Add page-type specific guidance
    if page_type == "title":
        enhanced += "\n\nThis is the TITLE PAGE - make it especially magical, inviting, and memorable. Center the main character prominently."
    elif page_type == "ending":
        enhanced += "\n\nThis is the FINAL PAGE - create a warm, satisfying conclusion with a cozy, happy feeling."

    return enhanced


def generate_image(prompt, output_path, quality="medium", size="1536x1024"):
    """Generate an image using OpenAI gpt-image-1."""
    try:
        response = client.images.generate(
            model="gpt-image-1",
            prompt=prompt,
            size=size,  # Landscape for book pages
            quality=quality,
            n=1,
        )

        # Get the base64 image data
        image_base64 = response.data[0].b64_json

        # Decode and save
        image_bytes = base64.b64decode(image_base64)
        image = Image.open(BytesIO(image_bytes))

        # Ensure output directory exists
        output_path.parent.mkdir(parents=True, exist_ok=True)

        # Save as PNG for quality
        image.save(output_path, format="PNG", optimize=True)

        # Get revised prompt if available
        revised_prompt = getattr(response.data[0], 'revised_prompt', None)

        return True, revised_prompt or "Generated successfully"

    except Exception as e:
        return False, str(e)


def generate_book_images(book_dir, dry_run=False, force=False, specific_page=None, quality="medium"):
    """Generate all images for a book."""
    book = load_book(book_dir)
    book_name = book_dir.name
    images_dir = book_dir / "images"

    print(f"\n{'='*60}")
    print(f"📖 {book['titleEnglish']} / {book['titleChinese']}")
    print(f"{'='*60}")

    results = []
    cost_per_image = {"low": 0.011, "medium": 0.042, "high": 0.167}[quality]

    for page in book['pages']:
        page_num = page['pageNumber']

        # Skip if specific page requested and this isn't it
        if specific_page is not None and page_num != specific_page:
            continue

        page_type = page.get('type', 'story')
        prompt = page.get('illustrationPrompt', '')

        if not prompt:
            print(f"   ⚠️  Page {page_num}: No illustration prompt")
            continue

        output_path = images_dir / f"page-{page_num:02d}.png"

        # Check if image already exists
        if output_path.exists() and not force:
            print(f"   ⏭️  Page {page_num}: Image exists (use --force to regenerate)")
            results.append({'page': page_num, 'status': 'skipped', 'path': str(output_path)})
            continue

        # Enhance the prompt
        enhanced_prompt = enhance_prompt(prompt, page_type)

        if dry_run:
            print(f"\n   📄 Page {page_num} ({page_type}):")
            print(f"   Original: {prompt[:80]}...")
            print(f"   Cost: ${cost_per_image}")
            results.append({'page': page_num, 'status': 'dry_run', 'prompt': enhanced_prompt})
            continue

        print(f"   🎨 Generating page {page_num} ({page_type})...", end=" ", flush=True)

        success, result = generate_image(enhanced_prompt, output_path, quality=quality)

        if success:
            print(f"✅ Saved ({output_path.name})")
            results.append({'page': page_num, 'status': 'success', 'path': str(output_path)})
        else:
            print(f"❌ Error: {result}")
            results.append({'page': page_num, 'status': 'error', 'error': result})

        # Small delay to avoid rate limits
        time.sleep(1)

    return results


def main():
    parser = argparse.ArgumentParser(description="Generate gpt-image-1 illustrations for Allie's books")
    parser.add_argument('--book', help='Generate for specific book only')
    parser.add_argument('--page', type=int, help='Generate specific page only (requires --book)')
    parser.add_argument('--dry-run', action='store_true', help='Show prompts without generating')
    parser.add_argument('--force', action='store_true', help='Regenerate existing images')
    parser.add_argument('--quality', choices=['low', 'medium', 'high'], default='medium',
                        help='Image quality (default: medium)')
    args = parser.parse_args()

    print("=" * 60)
    print("   🎨 GPT-Image-1 Generator for Allie's Books")
    print("   🐞 Maintaining the Ladybug Standard 🐞")
    print("=" * 60)

    if args.page and not args.book:
        print("❌ --page requires --book to be specified")
        sys.exit(1)

    # Cost info
    cost_per_image = {"low": 0.011, "medium": 0.042, "high": 0.167}[args.quality]
    print(f"\n📊 Quality: {args.quality.upper()} (${cost_per_image}/image)")

    # Find books
    book_dirs = get_book_directories()

    if args.book:
        # Filter to specific book
        book_dirs = [d for d in book_dirs if args.book in d.name]
        if not book_dirs:
            print(f"❌ Book '{args.book}' not found")
            sys.exit(1)

    # Count total images
    total_images = 0
    for book_dir in book_dirs:
        book = load_book(book_dir)
        if args.page:
            total_images += 1
        else:
            total_images += len([p for p in book['pages'] if p.get('illustrationPrompt')])

    estimated_cost = total_images * cost_per_image
    print(f"📚 Found {len(book_dirs)} books, {total_images} images to generate")
    print(f"💰 Estimated cost: ${estimated_cost:.2f}")

    if args.dry_run:
        print("🔍 DRY RUN MODE - No images will be generated\n")
    else:
        print("\n⚠️  Starting image generation...")
        time.sleep(2)

    all_results = {}

    for book_dir in book_dirs:
        results = generate_book_images(
            book_dir,
            dry_run=args.dry_run,
            force=args.force,
            specific_page=args.page,
            quality=args.quality
        )
        all_results[book_dir.name] = results

    # Summary
    print("\n" + "=" * 60)
    print("📊 GENERATION SUMMARY")
    print("=" * 60)

    total_success = 0
    total_errors = 0
    total_skipped = 0

    for book_name, results in all_results.items():
        success = sum(1 for r in results if r['status'] == 'success')
        errors = sum(1 for r in results if r['status'] == 'error')
        skipped = sum(1 for r in results if r['status'] == 'skipped')

        total_success += success
        total_errors += errors
        total_skipped += skipped

        status = "✅" if errors == 0 else "⚠️"
        print(f"{status} {book_name}: {success} generated, {skipped} skipped, {errors} errors")

    actual_cost = total_success * cost_per_image
    print(f"\n✨ Total: {total_success} generated, {total_skipped} skipped, {total_errors} errors")
    print(f"💰 Actual cost: ${actual_cost:.2f}")

    if total_errors > 0:
        print("\n⚠️  Some images failed to generate. Check errors above.")
        sys.exit(1)

    if not args.dry_run and total_success > 0:
        print("\n🐞 The Ladybug Standard has been maintained! 🐞")


if __name__ == "__main__":
    main()
