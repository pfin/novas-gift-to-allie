// TypeScript interfaces for bilingual book system

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
  coverColor?: string; // Optional gradient color for cover
}

export interface BookState {
  currentBookId: string | null;
  currentPage: number;
  languageMode: LanguageMode;
}
