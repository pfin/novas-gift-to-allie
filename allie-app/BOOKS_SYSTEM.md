# Bilingual Books System

## Overview

The bilingual books feature allows displaying children's stories in English and Chinese with pinyin support. The system is designed to be toddler-friendly with large touch targets, swipe navigation, and language switching.

## Components

### 1. BookViewer.tsx
Main component for reading a book. Features:
- **Page Navigation**: Previous/Next buttons and page indicator dots
- **Touch Support**: Swipe left/right to turn pages
- **Keyboard Navigation**: Arrow keys for pages, Escape to close
- **Language Toggle**: Switch between English, Chinese, or both
- **Responsive**: Works on mobile and desktop
- **Accessibility**: ARIA labels, keyboard navigation

### 2. BookPage.tsx
Displays a single page with:
- **Illustration Area**: Top section with emoji placeholders (ready for actual images)
- **Text Area**: Displays story text in selected language(s)
- **Pinyin Support**: Shows pinyin above Chinese characters
- **Layout Modes**: Title pages get special centered layout
- **Side-by-Side**: When showing both languages, they appear side-by-side on desktop

### 3. LanguageToggle.tsx
Language selector with three modes:
- **English Only** (🇺🇸)
- **Chinese Only** (🇨🇳)
- **Both Languages** (🌏)

Large, colorful buttons with visual feedback.

### 4. BookGallery.tsx
Book selection screen showing:
- **Book Cards**: Each book with cover gradient, emoji icon, titles in both languages
- **Page Count**: Shows number of pages
- **Read Button**: Clear call-to-action
- **Navigation**: Back to map button in top-left corner

## Data Structure

### TypeScript Interfaces

```typescript
// lib/bookTypes.ts

export type LanguageMode = 'en' | 'zh' | 'both';

export interface BookPage {
  pageNumber: number;
  type: 'title' | 'story' | 'ending';
  englishText: string;
  chineseText: string;
  chinesePinyin: string;
  illustrationPrompt: string;
}

export interface Book {
  id: string;
  titleEnglish: string;
  titleChinese: string;
  titlePinyin: string;
  author: string;
  pages: BookPage[];
  coverColor?: string; // Tailwind gradient classes
}
```

### Sample Data

Five sample books are included in `lib/sampleBooks.ts`:
1. The Butterfly Garden (蝴蝶花园)
2. The Moon and the Stars (月亮和星星)
3. The Rainy Day (下雨天)
4. When Flowers Bloom (花儿开放)
5. The Rainbow in the Sky (天空的彩虹)

## Routes

### `/books` - Book Gallery
Displays all available books. Users can:
- Browse all books
- Click any book to open it
- Return to the main map

### Integration with Main App
A "Library" button (📚) appears in the top-right corner of the Scene Map, linking to the book gallery.

## Styling

### Design Principles
- **Toddler-Friendly**: Large touch targets (minimum 44x44px)
- **Bright Colors**: Cheerful gradients and vibrant colors
- **Clear Typography**: Large, readable text
- **Visual Feedback**: Scale transforms on button clicks
- **Mobile-First**: Responsive design that works on all devices

### Tailwind Configuration
Uses existing Tailwind CSS v4 configuration. Key classes:
- Gradients: `from-*/via-*/to-*` for colorful backgrounds
- Shadows: `shadow-lg`, `shadow-xl` for depth
- Transforms: `hover:scale-105`, `active:scale-95` for feedback
- Transitions: `transition-all duration-200` for smooth animations

## Accessibility

### ARIA Support
- All interactive elements have `aria-label`
- Current page marked with `aria-current`
- Button states indicated with `aria-pressed`
- Semantic HTML structure

### Keyboard Navigation
- **Arrow Left/Right**: Previous/Next page
- **Escape**: Close book viewer
- **Tab**: Navigate through controls
- **Enter/Space**: Activate buttons

### Touch Gestures
- **Swipe Left**: Next page
- **Swipe Right**: Previous page
- Minimum swipe distance: 50px to prevent accidental navigation

## Integration with JSON Books

### Loading Books from JSON

To load books from the JSON files in `/bilingual-books/`, create a loader function:

```typescript
// lib/bookLoader.ts
import { Book } from './bookTypes';

export async function loadBooksFromJSON(): Promise<Book[]> {
  // In a real implementation, you would:
  // 1. Read JSON files from /bilingual-books/
  // 2. Parse and validate the structure
  // 3. Convert to Book interface format
  // 4. Return array of books

  // For now, we use sampleBooks as placeholder
  return sampleBooks;
}
```

### Expected JSON Structure

JSON files should match this format:

```json
{
  "id": "butterfly-garden",
  "titleEnglish": "The Butterfly Garden",
  "titleChinese": "蝴蝶花园",
  "titlePinyin": "Húdié Huāyuán",
  "author": "Nova",
  "coverColor": "from-pink-300 via-purple-300 to-blue-300",
  "pages": [
    {
      "pageNumber": 1,
      "type": "title",
      "englishText": "The Butterfly Garden",
      "chineseText": "蝴蝶花园",
      "chinesePinyin": "Húdié Huāyuán",
      "illustrationPrompt": "A beautiful garden filled with butterflies"
    }
    // ... more pages
  ]
}
```

## Future Enhancements

### Image Support
Currently using emoji placeholders. To add actual illustrations:

1. **Update BookPage.tsx**:
   ```typescript
   // Replace emoji div with:
   <Image
     src={`/illustrations/${page.illustrationPrompt}.jpg`}
     alt={page.illustrationPrompt}
     width={400}
     height={300}
     className="rounded-lg"
   />
   ```

2. **Add images to** `/public/illustrations/`

3. **Generate AI illustrations** using the `illustrationPrompt` field

### Audio Narration
Add read-aloud feature:
- Record audio for each page in both languages
- Play button with audio controls
- Auto-advance option
- Highlighted text sync with audio

### Progress Tracking
Track reading progress:
- Mark books as "read"
- Save current page per book
- Achievement badges for completing all books
- Reading streaks

### Interactive Elements
Add touch interactions:
- Tap characters to hear pronunciation
- Interactive objects on pages
- Mini-games related to story content
- Coloring pages

### Offline Support
Make books available offline:
- Service worker for PWA
- Cache book data and images
- Sync progress when online

## Testing Checklist

- [ ] Books load and display correctly
- [ ] Language toggle switches properly
- [ ] Page navigation works (buttons, swipe, keyboard)
- [ ] Responsive on mobile and desktop
- [ ] Accessibility features functional
- [ ] ESLint and TypeScript pass
- [ ] Build succeeds without warnings
- [ ] Navigation to/from main app works

## Files Created

```
allie-app/
├── lib/
│   ├── bookTypes.ts         # TypeScript interfaces
│   └── sampleBooks.ts       # Sample book data
├── components/
│   ├── BookViewer.tsx       # Main book reader
│   ├── BookPage.tsx         # Single page display
│   ├── LanguageToggle.tsx   # Language selector
│   └── BookGallery.tsx      # Book selection grid
└── app/
    └── books/
        └── page.tsx         # Books route
```

## Sound Integration

The book system uses the existing sound manager:
- **Success sound**: When selecting a book
- **Whoosh sound**: When turning pages
- **Click sound**: For UI interactions

All sounds respect the game's sound settings (can be toggled off).
