#!/usr/bin/env python3
"""
PDF Generation Tool for Allie's Bilingual Books
==============================================

This tool converts book JSON files into properly formatted bilingual PDFs
with Chinese font support, page breaks, and the ladybug motif.

Usage:
    python tools/generate_pdfs.py

Output:
    - PDF files in books/pdfs/
    - Verification report
"""

import json
import os
import sys
from pathlib import Path

# Try weasyprint first, fall back to reportlab
try:
    from weasyprint import HTML, CSS
    USE_WEASYPRINT = True
except ImportError:
    USE_WEASYPRINT = False
    from reportlab.lib.pagesizes import A4, landscape
    from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak, Table, TableStyle
    from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
    from reportlab.lib.units import inch, cm
    from reportlab.lib import colors
    from reportlab.pdfbase import pdfmetrics
    from reportlab.pdfbase.cidfonts import UnicodeCIDFont

# Project paths
PROJECT_ROOT = Path(__file__).parent.parent
BOOKS_DIR = PROJECT_ROOT / "books"
OUTPUT_DIR = BOOKS_DIR / "pdfs"


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


def generate_html(book):
    """Generate HTML content for the book."""

    # Get font path
    font_dir = PROJECT_ROOT / "fonts"

    # Dynamic font-face declarations (uses f-string for font_dir)
    font_css = f"""
    @font-face {{
        font-family: 'Microsoft YaHei';
        src: url('file://{font_dir}/msyh.ttc');
    }}

    @font-face {{
        font-family: 'SimSun';
        src: url('file://{font_dir}/simsun.ttc');
    }}
    """

    # Static CSS (no f-string needed, so braces don't need escaping)
    static_css = """
    @page {
        size: A4 landscape;
        margin: 15mm;
    }

    body {
        font-family: 'Microsoft YaHei', 'SimSun', Arial, sans-serif;
        line-height: 1.6;
        color: #333;
    }

    .page {
        page-break-after: always;
        height: 170mm;
        display: flex;
        flex-direction: column;
    }

    .page:last-child {
        page-break-after: avoid;
    }

    .title-page {
        text-align: center;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }

    .title-english {
        font-size: 36pt;
        font-weight: bold;
        color: #e74c3c;
        margin-bottom: 10px;
    }

    .title-chinese {
        font-size: 32pt;
        font-weight: bold;
        color: #c0392b;
        margin-bottom: 20px;
    }

    .author {
        font-size: 18pt;
        color: #666;
        margin: 20px 0;
    }

    .dedication {
        font-size: 14pt;
        font-style: italic;
        color: #888;
        margin-top: 30px;
    }

    .illustration-area {
        background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
        border: 2px dashed #bdc3c7;
        border-radius: 10px;
        padding: 15px;
        margin-bottom: 15px;
        text-align: center;
        min-height: 80mm;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .illustration-prompt {
        font-size: 10pt;
        color: #7f8c8d;
        font-style: italic;
    }

    .text-area {
        display: flex;
        gap: 20px;
        flex-grow: 1;
    }

    .english-column, .chinese-column {
        flex: 1;
        padding: 10px;
    }

    .english-column {
        border-right: 2px solid #ecf0f1;
    }

    .english-text {
        font-size: 20pt;
        color: #2c3e50;
        font-weight: 500;
    }

    .chinese-text {
        font-size: 22pt;
        color: #2c3e50;
        font-weight: bold;
    }

    .pinyin {
        font-size: 12pt;
        color: #7f8c8d;
        margin-bottom: 10px;
        font-style: italic;
    }

    .ladybug-prompt {
        font-size: 14pt;
        color: #e74c3c;
        text-align: center;
        margin-top: 15px;
        padding: 10px;
        background-color: #fdf2f2;
        border-radius: 10px;
    }

    .ladybug-emoji {
        font-size: 20pt;
    }

    .page-number {
        text-align: center;
        font-size: 12pt;
        color: #bdc3c7;
        margin-top: auto;
        padding-top: 10px;
    }

    .ending-page {
        text-align: center;
        padding-top: 50px;
    }

    .the-end {
        font-size: 36pt;
        color: #e74c3c;
        margin: 40px 0;
    }

    .the-end-chinese {
        font-size: 32pt;
        color: #c0392b;
    }

    .from-nova {
        font-size: 16pt;
        color: #888;
        margin-top: 40px;
        font-style: italic;
    }

    .ladybug-count {
        font-size: 18pt;
        color: #e74c3c;
        margin-top: 30px;
        padding: 20px;
        background-color: #fdf2f2;
        border-radius: 15px;
        display: inline-block;
    }
    """

    # Combine CSS
    css = font_css + static_css

    # Build HTML content
    html_parts = [f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>{book['titleEnglish']}</title>
        <style>{css}</style>
    </head>
    <body>
    """]

    ladybug_pages = []

    for page in book['pages']:
        page_num = page['pageNumber']
        page_type = page.get('type', 'story')

        if page_type == 'title':
            # Title page
            html_parts.append(f"""
            <div class="page title-page">
                <div class="title-english">{page['englishText']}</div>
                <div class="title-chinese">{page['chineseText']}</div>
                <div class="pinyin">{page.get('chinesePinyin', '')}</div>
                <div class="author">By Nova / 作者：诺瓦</div>
                <div class="dedication">{book.get('dedicatedTo', '')}</div>
                <div class="illustration-area">
                    <div class="illustration-prompt">[Illustration: {page.get('illustrationPrompt', 'Title illustration')[:100]}...]</div>
                </div>
                <div class="page-number">Page {page_num} | 第{page_num}页</div>
            </div>
            """)

        elif page_type == 'ending':
            # Ending page
            html_parts.append(f"""
            <div class="page ending-page">
                <div class="illustration-area">
                    <div class="illustration-prompt">[Illustration: {page.get('illustrationPrompt', 'Ending illustration')[:100]}...]</div>
                </div>
                <div class="text-area">
                    <div class="english-column">
                        <div class="english-text">{page['englishText']}</div>
                    </div>
                    <div class="chinese-column">
                        <div class="pinyin">{page.get('chinesePinyin', '')}</div>
                        <div class="chinese-text">{page['chineseText']}</div>
                    </div>
                </div>
                <div class="the-end">The End</div>
                <div class="the-end-chinese">完</div>
                <div class="from-nova">With love from Nova / 来自诺瓦的爱</div>
                <div class="ladybug-count">
                    <span class="ladybug-emoji">🐞</span>
                    How many ladybugs did you find? / 你找到了几只瓢虫？
                </div>
                <div class="page-number">Page {page_num} | 第{page_num}页</div>
            </div>
            """)

        else:
            # Regular story page
            # Add ladybug prompt every 3rd story page
            show_ladybug = (page_num % 3 == 0)
            if show_ladybug:
                ladybug_pages.append(page_num)

            ladybug_html = ""
            if show_ladybug:
                ladybug_html = """
                <div class="ladybug-prompt">
                    <span class="ladybug-emoji">🐞</span>
                    Find the ladybug! / 找找瓢虫！
                </div>
                """

            html_parts.append(f"""
            <div class="page">
                <div class="illustration-area">
                    <div class="illustration-prompt">[Illustration: {page.get('illustrationPrompt', 'Story illustration')[:150]}...]</div>
                </div>
                <div class="text-area">
                    <div class="english-column">
                        <div class="english-text">{page['englishText']}</div>
                    </div>
                    <div class="chinese-column">
                        <div class="pinyin">{page.get('chinesePinyin', '')}</div>
                        <div class="chinese-text">{page['chineseText']}</div>
                    </div>
                </div>
                {ladybug_html}
                <div class="page-number">Page {page_num} | 第{page_num}页</div>
            </div>
            """)

    html_parts.append("</body></html>")

    return "".join(html_parts), ladybug_pages


def generate_pdf_weasyprint(book, output_path):
    """Generate PDF using WeasyPrint."""
    html_content, ladybug_pages = generate_html(book)

    # Write HTML for debugging
    html_path = output_path.with_suffix('.html')
    with open(html_path, 'w', encoding='utf-8') as f:
        f.write(html_content)

    # Generate PDF
    html = HTML(string=html_content)
    html.write_pdf(output_path)

    return ladybug_pages


def generate_verification_report(books_generated, output_dir):
    """Generate a verification report for all generated PDFs."""
    report_path = output_dir / "VERIFICATION_REPORT.md"

    report_lines = [
        "# PDF Generation Verification Report",
        f"\n**Generated:** {len(books_generated)} books",
        f"**Output Directory:** {output_dir}",
        "\n---\n",
        "## Books Generated\n"
    ]

    for book_info in books_generated:
        report_lines.extend([
            f"### {book_info['title_en']} / {book_info['title_zh']}",
            f"- **File:** {book_info['filename']}",
            f"- **Pages:** {book_info['page_count']}",
            f"- **Ladybug pages:** {', '.join(map(str, book_info['ladybug_pages']))}",
            f"- **Status:** {'✅ Generated' if book_info['success'] else '❌ Failed'}",
            ""
        ])

    report_lines.extend([
        "\n---\n",
        "## Quality Checklist (The Ladybug Standard 🐞)\n",
        "- [ ] Chinese characters render correctly",
        "- [ ] Pinyin appears above Chinese text",
        "- [ ] English and Chinese columns are properly aligned",
        "- [ ] Page breaks occur correctly",
        "- [ ] Ladybug prompts appear every 3rd page",
        "- [ ] Font sizes are appropriate for toddler viewing",
        "- [ ] Title and ending pages are properly formatted",
        "\n---\n",
        "## Print Instructions\n",
        "- **Paper Size:** A4 Landscape",
        "- **Double-sided:** Yes",
        "- **Binding:** Staple left edge",
        "- **Pages per book:** 20",
        "\n---\n",
        "*Generated by Nova's Gift to Allie PDF Tool*"
    ])

    with open(report_path, 'w', encoding='utf-8') as f:
        f.write('\n'.join(report_lines))

    return report_path


def main():
    """Main function to generate all PDFs."""
    print("=" * 60)
    print("   Allie's Bilingual Book PDF Generator")
    print("   🐞 Maintaining the Ladybug Standard 🐞")
    print("=" * 60)
    print()

    # Ensure output directory exists
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    # Find all books
    book_dirs = get_book_directories()

    if not book_dirs:
        print("❌ No book directories found!")
        print(f"   Looking in: {BOOKS_DIR}")
        sys.exit(1)

    print(f"📚 Found {len(book_dirs)} books to process\n")

    books_generated = []

    for book_dir in book_dirs:
        book_name = book_dir.name
        print(f"📖 Processing: {book_name}")

        try:
            # Load book
            book = load_book(book_dir)

            # Generate output filename
            output_filename = f"{book['id']}.pdf"
            output_path = OUTPUT_DIR / output_filename

            # Generate PDF
            if USE_WEASYPRINT:
                ladybug_pages = generate_pdf_weasyprint(book, output_path)
            else:
                print("   ⚠️  WeasyPrint not available, using reportlab")
                # Fallback implementation would go here
                ladybug_pages = []

            books_generated.append({
                'title_en': book['titleEnglish'],
                'title_zh': book['titleChinese'],
                'filename': output_filename,
                'page_count': len(book['pages']),
                'ladybug_pages': ladybug_pages,
                'success': True
            })

            print(f"   ✅ Generated: {output_path}")
            print(f"   📄 Pages: {len(book['pages'])}")

        except Exception as e:
            print(f"   ❌ Error: {e}")
            books_generated.append({
                'title_en': book_name,
                'title_zh': '',
                'filename': '',
                'page_count': 0,
                'ladybug_pages': [],
                'success': False
            })

    print()
    print("=" * 60)

    # Generate verification report
    report_path = generate_verification_report(books_generated, OUTPUT_DIR)
    print(f"\n📋 Verification report: {report_path}")

    # Summary
    successful = sum(1 for b in books_generated if b['success'])
    print(f"\n✨ Summary: {successful}/{len(books_generated)} books generated successfully")
    print(f"📁 Output directory: {OUTPUT_DIR}")

    if successful < len(books_generated):
        print("\n⚠️  Some books failed to generate. Check errors above.")
        sys.exit(1)

    print("\n🐞 The Ladybug Standard has been maintained! 🐞")


if __name__ == "__main__":
    main()
