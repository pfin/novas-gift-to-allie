'use client';

import { Book } from '@/lib/bookTypes';
import { getSoundManager } from '@/lib/sounds';
import Link from 'next/link';

interface BookGalleryProps {
  books: Book[];
  onSelectBook: (book: Book) => void;
}

export default function BookGallery({ books, onSelectBook }: BookGalleryProps) {
  const soundManager = getSoundManager();

  const handleBookClick = (book: Book) => {
    soundManager.playSuccess();
    onSelectBook(book);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 via-pink-100 to-purple-100 p-4 md:p-8">
      {/* Back to Map button */}
      <Link
        href="/"
        onClick={() => soundManager.playClick()}
        className="fixed top-8 left-8 bg-blue-500 hover:bg-blue-600 text-white rounded-full p-4 shadow-lg transform hover:scale-110 transition-all duration-200 active:scale-95 z-50"
        aria-label="Back to Map"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
      </Link>

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="text-center mb-8 md:mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-purple-900 mb-4">
            📚 Allie&apos;s Library
          </h1>
          <p className="text-xl md:text-2xl text-purple-700">
            Choose a story to read in English and Chinese!
          </p>
        </header>

        {/* Book grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {books.map((book) => (
            <BookCard key={book.id} book={book} onClick={() => handleBookClick(book)} />
          ))}
        </div>

        {/* Fun decorations */}
        <div className="mt-12 flex justify-center gap-8 text-6xl opacity-50 pointer-events-none">
          <span className="animate-pulse">🦋</span>
          <span className="animate-pulse" style={{ animationDelay: '0.2s' }}>🌸</span>
          <span className="animate-pulse" style={{ animationDelay: '0.4s' }}>⭐</span>
          <span className="animate-pulse" style={{ animationDelay: '0.6s' }}>🌈</span>
        </div>
      </div>
    </div>
  );
}

interface BookCardProps {
  book: Book;
  onClick: () => void;
}

function BookCard({ book, onClick }: BookCardProps) {
  const coverGradient = book.coverColor || 'from-blue-400 to-purple-500';

  return (
    <button
      onClick={onClick}
      className="group relative bg-white rounded-3xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 active:scale-95 overflow-hidden"
      aria-label={`Read ${book.titleEnglish}`}
    >
      {/* Cover area */}
      <div className={`h-64 bg-gradient-to-br ${coverGradient} flex items-center justify-center p-8 relative overflow-hidden`}>
        {/* Decorative elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-4 left-4 text-4xl">✨</div>
          <div className="absolute top-4 right-4 text-4xl">🌟</div>
          <div className="absolute bottom-4 left-4 text-4xl">🦋</div>
          <div className="absolute bottom-4 right-4 text-4xl">🌸</div>
        </div>

        {/* Book icon/illustration */}
        <div className="text-8xl group-hover:scale-110 transition-transform duration-300">
          {getBookEmoji(book.id)}
        </div>
      </div>

      {/* Book info */}
      <div className="p-6 text-center space-y-3">
        <h2 className="text-2xl md:text-3xl font-bold text-purple-900 leading-tight">
          {book.titleEnglish}
        </h2>
        <div className="space-y-1">
          <p className="text-base md:text-lg text-purple-600 font-medium">
            {book.titlePinyin}
          </p>
          <p className="text-xl md:text-2xl text-purple-900 font-bold">
            {book.titleChinese}
          </p>
        </div>
        <p className="text-sm text-gray-600">
          by {book.author}
        </p>

        {/* Page count badge */}
        <div className="inline-flex items-center gap-2 bg-purple-100 px-4 py-2 rounded-full text-sm font-medium text-purple-700">
          <span>📖</span>
          <span>{book.pages.length} pages</span>
        </div>

        {/* Read button */}
        <div className="pt-2">
          <span className="inline-block bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-full font-bold text-lg group-hover:scale-105 transition-transform">
            Read Now! 📚
          </span>
        </div>
      </div>
    </button>
  );
}

// Helper function to get emoji for each book
function getBookEmoji(bookId: string): string {
  const emojiMap: Record<string, string> = {
    'butterfly-garden': '🦋',
    'moon-and-stars': '🌙',
    'rainy-day': '🌧️',
    'flowers-bloom': '🌸',
    'rainbow-sky': '🌈',
  };

  return emojiMap[bookId] || '📖';
}
