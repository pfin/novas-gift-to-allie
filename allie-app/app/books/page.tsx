'use client';

import { useState } from 'react';
import { Book } from '@/lib/bookTypes';
import { sampleBooks } from '@/lib/sampleBooks';
import BookGallery from '@/components/BookGallery';
import BookViewer from '@/components/BookViewer';

export default function BooksPage() {
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  return (
    <>
      {selectedBook ? (
        <BookViewer book={selectedBook} onClose={() => setSelectedBook(null)} />
      ) : (
        <BookGallery books={sampleBooks} onSelectBook={setSelectedBook} />
      )}
    </>
  );
}
