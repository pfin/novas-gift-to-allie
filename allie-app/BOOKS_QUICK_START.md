# Bilingual Books Quick Start Guide

## For Developers

### Adding a New Book

1. **Create book data** in `lib/sampleBooks.ts`:

```typescript
{
  id: 'my-new-book',
  titleEnglish: "My New Book",
  titleChinese: "我的新书",
  titlePinyin: "Wǒ de Xīn Shū",
  author: "Nova",
  coverColor: "from-blue-400 to-purple-500", // Tailwind gradient
  pages: [
    {
      pageNumber: 1,
      type: 'title',
      englishText: "My New Book",
      chineseText: "我的新书",
      chinesePinyin: "Wǒ de Xīn Shū",
      illustrationPrompt: "A book cover design"
    },
    // Add more pages...
  ]
}
```

2. **Add to books array**:
```typescript
export const sampleBooks: Book[] = [
  // ... existing books
  myNewBook,
];
```

3. **Update emoji mapping** in `BookGallery.tsx`:
```typescript
const emojiMap: Record<string, string> = {
  'my-new-book': '📘',  // Add your book's emoji
  // ... other books
};
```

### Loading Books from JSON

Replace `sampleBooks` import with dynamic loading:

```typescript
// app/books/page.tsx
import { useState, useEffect } from 'react';

export default function BooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  useEffect(() => {
    async function loadBooks() {
      const response = await fetch('/api/books');
      const data = await response.json();
      setBooks(data);
    }
    loadBooks();
  }, []);

  // ... rest of component
}
```

### Customizing Styles

#### Change Book Cover Colors
```typescript
// In book data
coverColor: "from-rose-400 via-pink-400 to-fuchsia-400"
```

#### Modify Page Layout
```typescript
// components/BookPage.tsx
<div className="your-custom-classes">
  {/* Customize layout */}
</div>
```

#### Adjust Language Toggle
```typescript
// components/LanguageToggle.tsx
const modes = [
  { mode: 'en', label: 'English', icon: '🇺🇸' },
  // Add or modify modes
];
```

## For Content Creators

### Writing Book Content

#### Page Types

1. **Title Page** (`type: 'title'`)
   - Book cover
   - Centered, large text
   - Both languages displayed prominently

2. **Story Page** (`type: 'story'`)
   - Regular content pages
   - Illustration at top
   - Text at bottom
   - Side-by-side layout for bilingual mode

3. **Ending Page** (`type: 'ending'`)
   - Last page of story
   - Often includes "The End" or moral
   - Same layout as story pages

#### Text Guidelines

**English Text**:
- Simple sentences for toddlers
- One idea per page
- Use repetition for learning
- Rhyming is optional but engaging

**Chinese Text**:
- Match English meaning
- Use appropriate characters for age level
- Consider character complexity

**Pinyin**:
- Use proper tone marks (ā, á, ǎ, à)
- Space words, not syllables: "Wǒ de shū" not "Wǒdeshū"
- Follow standard pinyin rules

#### Illustration Prompts

Write clear, descriptive prompts:
```typescript
// Good prompts
"A red butterfly with yellow spots landing on a pink flower"
"A smiling moon with stars around it in a dark blue sky"
"A child in yellow rain boots jumping in a puddle"

// Avoid vague prompts
"A scene"
"The story"
"Background"
```

### Example Complete Book

```typescript
{
  id: 'bedtime-stars',
  titleEnglish: "Bedtime Stars",
  titleChinese: "睡前的星星",
  titlePinyin: "Shuìqián de Xīngxing",
  author: "Nova",
  coverColor: "from-indigo-400 via-purple-400 to-pink-400",
  pages: [
    {
      pageNumber: 1,
      type: 'title',
      englishText: "Bedtime Stars",
      chineseText: "睡前的星星",
      chinesePinyin: "Shuìqián de Xīngxing",
      illustrationPrompt: "Night sky with twinkling stars and a crescent moon"
    },
    {
      pageNumber: 2,
      type: 'story',
      englishText: "When it's time for bed, I look out my window.",
      chineseText: "睡觉时间到了，我看着窗外。",
      chinesePinyin: "Shuìjiào shíjiān dào le, wǒ kànzhe chuāng wài.",
      illustrationPrompt: "Child looking out bedroom window at night"
    },
    {
      pageNumber: 3,
      type: 'story',
      englishText: "The stars are twinkling, saying goodnight!",
      chineseText: "星星在闪烁，说晚安！",
      chinesePinyin: "Xīngxing zài shǎnshuò, shuō wǎn'ān!",
      illustrationPrompt: "Bright stars twinkling in the night sky"
    },
    {
      pageNumber: 4,
      type: 'ending',
      englishText: "I close my eyes and dream of stars. Goodnight!",
      chineseText: "我闭上眼睛，梦见星星。晚安！",
      chinesePinyin: "Wǒ bìshang yǎnjing, mèngjiàn xīngxing. Wǎn'ān!",
      illustrationPrompt: "Child sleeping peacefully with stars visible through window"
    }
  ]
}
```

## Testing Your Book

### 1. Add to Array
Add your book to `sampleBooks` array

### 2. Run Development Server
```bash
npm run dev
```

### 3. Navigate to Books
- Go to http://localhost:3000
- Click "Library" button
- Find your book in the gallery

### 4. Test Features
- ✅ Book card displays correctly
- ✅ Book opens when clicked
- ✅ All pages show content
- ✅ Language toggle works
- ✅ Navigation buttons work
- ✅ Swipe gestures work (on mobile/touch device)
- ✅ Pinyin displays above Chinese
- ✅ Text is readable and not cut off

### 5. Build Test
```bash
npm run build
```
Should complete with no errors.

## Common Issues

### Book Doesn't Appear
- Check `id` is unique
- Verify book is added to `sampleBooks` array
- Check for TypeScript errors

### Chinese Characters Look Wrong
- Ensure proper UTF-8 encoding
- Check font supports Chinese characters
- Verify pinyin tone marks are correct

### Layout Issues
- Check text length isn't too long for mobile
- Test on different screen sizes
- Verify responsive classes are applied

### Page Navigation Broken
- Ensure `pageNumber` starts at 1 and increments
- Check all pages have required fields
- Verify array order matches page numbers

## Resources

### Pinyin Tools
- [Pinyin Joe](http://www.pinyinjoe.com/) - Pinyin typing guide
- [MDBG Dictionary](https://www.mdbg.net/chinese/dictionary) - Chinese-English dictionary with pinyin

### Illustration Ideas
- Simple, clear compositions
- Bright, cheerful colors
- Age-appropriate content
- Clear focal points

### Character Selection
- Start with common, simple characters
- Use characters from HSK 1-2 level
- Avoid complex traditional characters for beginners

## Questions?

Check existing books in `lib/sampleBooks.ts` for examples!
