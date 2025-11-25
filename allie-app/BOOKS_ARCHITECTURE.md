# Bilingual Books Architecture

## Component Hierarchy

```
app/books/page.tsx (Route)
│
├─→ BookGallery (when no book selected)
│   ├─→ BookCard × 5 (one per book)
│   └─→ Link (back to map)
│
└─→ BookViewer (when book selected)
    ├─→ LanguageToggle
    ├─→ BookPage
    ├─→ Navigation buttons (prev/next)
    └─→ Page indicator dots
```

## Data Flow

```
sampleBooks.ts (data source)
    ↓
app/books/page.tsx (route component)
    ↓
BookGallery (displays book cards)
    ↓ (user selects book)
useState<Book | null> (state management)
    ↓
BookViewer (receives selected book)
    ↓
BookPage (receives current page + language mode)
    ↓
Rendered page content
```

## State Management

### Route Level (`app/books/page.tsx`)
```typescript
const [selectedBook, setSelectedBook] = useState<Book | null>(null);

// States:
// - null: Show BookGallery
// - Book: Show BookViewer with that book
```

### BookViewer State
```typescript
const [currentPage, setCurrentPage] = useState(0);
const [languageMode, setLanguageMode] = useState<LanguageMode>('both');
const [touchStart, setTouchStart] = useState<number | null>(null);
const [touchEnd, setTouchEnd] = useState<number | null>(null);
```

## User Flows

### 1. Browsing and Reading
```
Map → Library Button → BookGallery → Click Book → BookViewer
```

### 2. Returning to Map
```
BookViewer → Close Button → BookGallery → Back Button → Map
```

### 3. Changing Language
```
BookViewer → Language Toggle → Update languageMode
                                      ↓
                              BookPage re-renders with new mode
```

### 4. Navigating Pages
```
Methods:
- Click "Next" button
- Swipe left
- Press right arrow key
    ↓
setCurrentPage(currentPage + 1)
    ↓
BookPage re-renders with new page data
```

## TypeScript Type Safety

### Type Definitions (`lib/bookTypes.ts`)
```typescript
LanguageMode = 'en' | 'zh' | 'both'  // Literal union type
BookPage interface                    // 7 required fields
Book interface                        // 6 required + 1 optional field
BookState interface                   // 3 fields for state
```

### Props Typing
```typescript
// All components use explicit prop types
interface BookViewerProps {
  book: Book;              // Required, no undefined
  onClose: () => void;     // Callback with no return
}

interface BookPageProps {
  page: BookPage;          // Required page data
  languageMode: LanguageMode; // Required, constrained type
}
```

## Integration Points

### 1. Main App Integration
**File**: `components/SceneMap.tsx`
```typescript
<Link href="/books" onClick={() => soundManager.playSuccess()}>
  📚 Library
</Link>
```

### 2. Sound Integration
Uses existing sound manager:
- `soundManager.playSuccess()` - Book selection
- `soundManager.playWhoosh()` - Page turns
- `soundManager.playClick()` - UI interactions

### 3. Styling Integration
Uses existing Tailwind CSS v4 configuration:
- Gradient utilities
- Transform utilities
- Animation utilities
- Responsive breakpoints

## Accessibility Features

### ARIA Attributes
```typescript
aria-label="Close book"           // Button purposes
aria-pressed={currentMode === mode} // Toggle states
aria-current={index === currentPage} // Current page
```

### Keyboard Support
```typescript
useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'ArrowLeft') handlePrevPage();
    if (e.key === 'ArrowRight') handleNextPage();
    if (e.key === 'Escape') handleClose();
  };
  window.addEventListener('keydown', handleKeyDown);
  return () => window.removeEventListener('keydown', handleKeyDown);
});
```

### Touch Gestures
```typescript
// Touch event handlers
onTouchStart={e => setTouchStart(e.targetTouches[0].clientX)}
onTouchMove={e => setTouchEnd(e.targetTouches[0].clientX)}
onTouchEnd={() => {
  const distance = touchStart - touchEnd;
  if (Math.abs(distance) > minSwipeDistance) {
    // Handle swipe
  }
}}
```

## Performance Considerations

### Static Generation
- All routes are pre-rendered at build time (`○ Static`)
- No server-side rendering needed
- Fast page loads

### Bundle Sizes
```
Route (app)           Size     First Load JS
○ /books             7.75 kB   112 kB
```
Optimized bundle size, well within acceptable limits.

### Component Optimization
- No unnecessary re-renders
- State co-located with usage
- Conditional rendering for optimal performance

## File Structure

```
allie-app/
├── app/
│   └── books/
│       └── page.tsx                 # Route component (21 lines)
│
├── components/
│   ├── BookGallery.tsx              # Book selection (139 lines)
│   ├── BookViewer.tsx               # Book reader (201 lines)
│   ├── BookPage.tsx                 # Page display (100 lines)
│   └── LanguageToggle.tsx           # Language switcher (51 lines)
│
├── lib/
│   ├── bookTypes.ts                 # TypeScript types (28 lines)
│   └── sampleBooks.ts               # Sample data (257 lines)
│
└── docs/
    ├── BOOKS_SYSTEM.md              # User documentation
    └── BOOKS_ARCHITECTURE.md        # This file
```

## Testing Strategy

### Component Testing
```typescript
// Unit tests to add
describe('BookViewer', () => {
  it('renders book title correctly');
  it('navigates to next page on button click');
  it('swipe left advances page');
  it('closes on escape key');
});

describe('LanguageToggle', () => {
  it('switches language mode');
  it('highlights active mode');
});

describe('BookPage', () => {
  it('displays English when mode is "en"');
  it('displays Chinese when mode is "zh"');
  it('displays both when mode is "both"');
  it('shows pinyin above Chinese text');
});
```

### Integration Testing
```typescript
describe('Book Reading Flow', () => {
  it('selects book from gallery');
  it('reads through all pages');
  it('switches languages mid-read');
  it('returns to gallery');
});
```

### Accessibility Testing
- Screen reader compatibility
- Keyboard-only navigation
- Touch target sizes (minimum 44x44px)
- Color contrast ratios (WCAG AA)

## Future Architecture Enhancements

### 1. Book Loader Service
```typescript
// lib/bookLoader.ts
export class BookLoader {
  async loadFromJSON(path: string): Promise<Book>
  async loadFromAPI(id: string): Promise<Book>
  validateBook(data: unknown): Book
}
```

### 2. Reading Progress Service
```typescript
// lib/readingProgress.ts
export class ReadingProgress {
  saveProgress(bookId: string, page: number): void
  getProgress(bookId: string): number
  markComplete(bookId: string): void
  getCompletedBooks(): string[]
}
```

### 3. Audio Service
```typescript
// lib/audioService.ts
export class AudioService {
  loadAudio(bookId: string, page: number, lang: LanguageMode): Promise<AudioBuffer>
  play(): void
  pause(): void
  highlightWord(wordIndex: number): void
}
```

### 4. Offline Support
```typescript
// service-worker.ts
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('books-v1').then(cache => {
      return cache.addAll([
        '/books',
        '/lib/sampleBooks.json',
        // Add book images
      ]);
    })
  );
});
```

## Deployment Checklist

- [x] TypeScript compiles without errors
- [x] ESLint passes with no warnings
- [x] Production build succeeds
- [x] All routes statically generated
- [x] Responsive design tested
- [x] Accessibility features implemented
- [x] Sound integration working
- [x] Navigation flows tested
- [ ] Add actual book JSON data
- [ ] Add real illustrations
- [ ] Test on mobile devices
- [ ] Deploy to Vercel
