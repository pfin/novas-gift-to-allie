'use client';

import { useState, useEffect } from 'react';
import { Book, LanguageMode } from '@/lib/bookTypes';
import BookPage from './BookPage';
import LanguageToggle from './LanguageToggle';
import { getSoundManager } from '@/lib/sounds';

interface BookViewerProps {
  book: Book;
  onClose: () => void;
}

export default function BookViewer({ book, onClose }: BookViewerProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const [languageMode, setLanguageMode] = useState<LanguageMode>('both');
  const soundManager = getSoundManager();

  // Reset to first page when book changes
  useEffect(() => {
    setCurrentPage(0);
  }, [book.id]);

  // Touch/swipe support
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && currentPage < book.pages.length - 1) {
      handleNextPage();
    }
    if (isRightSwipe && currentPage > 0) {
      handlePrevPage();
    }
  };

  const handleNextPage = () => {
    if (currentPage < book.pages.length - 1) {
      soundManager.playWhoosh();
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 0) {
      soundManager.playWhoosh();
      setCurrentPage(currentPage - 1);
    }
  };

  const handleLanguageChange = (mode: LanguageMode) => {
    soundManager.playClick();
    setLanguageMode(mode);
  };

  const handleClose = () => {
    soundManager.playClick();
    onClose();
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') handlePrevPage();
      if (e.key === 'ArrowRight') handleNextPage();
      if (e.key === 'Escape') handleClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  return (
    <div
      className="fixed inset-0 bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 z-50 flex flex-col"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-md p-4 flex items-center justify-between gap-4">
        <button
          onClick={handleClose}
          className="bg-red-500 hover:bg-red-600 text-white rounded-full p-3 shadow-lg transform hover:scale-110 transition-all duration-200 active:scale-95 flex-shrink-0"
          aria-label="Close book"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="flex-1 min-w-0">
          <LanguageToggle currentMode={languageMode} onModeChange={handleLanguageChange} />
        </div>

        <div className="text-sm font-medium text-gray-600 flex-shrink-0">
          {currentPage + 1} / {book.pages.length}
        </div>
      </header>

      {/* Book content */}
      <main className="flex-1 p-4 md:p-8 flex items-center justify-center overflow-hidden">
        <div className="w-full max-w-4xl h-full">
          <BookPage page={book.pages[currentPage]} languageMode={languageMode} />
        </div>
      </main>

      {/* Navigation footer */}
      <footer className="bg-white/80 backdrop-blur-sm shadow-md p-4 flex justify-between items-center">
        <button
          onClick={handlePrevPage}
          disabled={currentPage === 0}
          className={`
            flex items-center gap-2 px-6 py-4 rounded-2xl font-bold text-xl
            transform transition-all duration-200 active:scale-95
            ${
              currentPage === 0
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg hover:scale-105'
            }
          `}
          aria-label="Previous page"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="hidden sm:inline">Previous</span>
        </button>

        {/* Page indicator dots */}
        <div className="flex gap-2">
          {book.pages.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                soundManager.playClick();
                setCurrentPage(index);
              }}
              className={`
                rounded-full transition-all duration-200
                ${
                  index === currentPage
                    ? 'w-3 h-3 bg-blue-500 scale-125'
                    : 'w-2 h-2 bg-gray-300 hover:bg-gray-400'
                }
              `}
              aria-label={`Go to page ${index + 1}`}
              aria-current={index === currentPage}
            />
          ))}
        </div>

        <button
          onClick={handleNextPage}
          disabled={currentPage === book.pages.length - 1}
          className={`
            flex items-center gap-2 px-6 py-4 rounded-2xl font-bold text-xl
            transform transition-all duration-200 active:scale-95
            ${
              currentPage === book.pages.length - 1
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg hover:scale-105'
            }
          `}
          aria-label="Next page"
        >
          <span className="hidden sm:inline">Next</span>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </footer>

      {/* Swipe hint for mobile (shows on first page) */}
      {currentPage === 0 && (
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 text-center animate-pulse md:hidden pointer-events-none">
          <p className="text-sm text-gray-600 bg-white/80 px-4 py-2 rounded-full">
            👆 Swipe to turn pages
          </p>
        </div>
      )}
    </div>
  );
}
