'use client';

import { BookPage as BookPageType, LanguageMode } from '@/lib/bookTypes';

interface BookPageProps {
  page: BookPageType;
  languageMode: LanguageMode;
}

export default function BookPage({ page, languageMode }: BookPageProps) {
  const { englishText, chineseText, chinesePinyin, illustrationPrompt, type } = page;

  // Determine what text to show based on language mode
  const showEnglish = languageMode === 'en' || languageMode === 'both';
  const showChinese = languageMode === 'zh' || languageMode === 'both';

  return (
    <div className="h-full flex flex-col bg-white rounded-3xl shadow-2xl overflow-hidden">
      {/* Illustration area */}
      <div className="flex-1 bg-gradient-to-br from-sky-100 via-blue-50 to-purple-100 flex items-center justify-center p-8">
        <div className="text-center">
          {/* Placeholder for illustration - will be replaced with actual images */}
          <div className="text-8xl mb-4" role="img" aria-label="Illustration">
            {getIllustrationEmoji(illustrationPrompt)}
          </div>
          <p className="text-sm text-gray-600 italic max-w-md">
            {illustrationPrompt}
          </p>
        </div>
      </div>

      {/* Text area */}
      <div className="bg-white p-6 md:p-8 space-y-4">
        {type === 'title' && (
          <div className="text-center space-y-4">
            {showEnglish && (
              <h1 className="text-3xl md:text-5xl font-bold text-blue-900">
                {englishText}
              </h1>
            )}
            {showChinese && (
              <div className="space-y-2">
                <p className="text-lg md:text-2xl text-purple-600 font-medium">
                  {chinesePinyin}
                </p>
                <h2 className="text-3xl md:text-5xl font-bold text-blue-900">
                  {chineseText}
                </h2>
              </div>
            )}
          </div>
        )}

        {type !== 'title' && (
          <div className={`space-y-4 ${languageMode === 'both' ? 'md:grid md:grid-cols-2 md:gap-6 md:space-y-0' : ''}`}>
            {showEnglish && (
              <div className="text-xl md:text-2xl leading-relaxed text-gray-800">
                {englishText}
              </div>
            )}
            {showChinese && (
              <div className="space-y-2">
                <p className="text-base md:text-lg text-purple-600 leading-relaxed">
                  {chinesePinyin}
                </p>
                <p className="text-xl md:text-2xl leading-relaxed text-gray-800">
                  {chineseText}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// Helper function to get emoji based on illustration prompt
function getIllustrationEmoji(prompt: string): string {
  const lowerPrompt = prompt.toLowerCase();

  if (lowerPrompt.includes('butterfly') || lowerPrompt.includes('蝴蝶')) return '🦋';
  if (lowerPrompt.includes('flower') || lowerPrompt.includes('花')) return '🌸';
  if (lowerPrompt.includes('sun') || lowerPrompt.includes('太阳')) return '☀️';
  if (lowerPrompt.includes('moon') || lowerPrompt.includes('月亮')) return '🌙';
  if (lowerPrompt.includes('star') || lowerPrompt.includes('星星')) return '⭐';
  if (lowerPrompt.includes('cat') || lowerPrompt.includes('猫')) return '🐈';
  if (lowerPrompt.includes('dog') || lowerPrompt.includes('狗')) return '🐕';
  if (lowerPrompt.includes('bird') || lowerPrompt.includes('鸟')) return '🐦';
  if (lowerPrompt.includes('tree') || lowerPrompt.includes('树')) return '🌳';
  if (lowerPrompt.includes('house') || lowerPrompt.includes('房子')) return '🏠';
  if (lowerPrompt.includes('car') || lowerPrompt.includes('车')) return '🚗';
  if (lowerPrompt.includes('bus') || lowerPrompt.includes('公交')) return '🚌';
  if (lowerPrompt.includes('rain') || lowerPrompt.includes('雨')) return '🌧️';
  if (lowerPrompt.includes('cloud') || lowerPrompt.includes('云')) return '☁️';
  if (lowerPrompt.includes('rainbow') || lowerPrompt.includes('彩虹')) return '🌈';
  if (lowerPrompt.includes('heart') || lowerPrompt.includes('心')) return '💖';

  return '📖'; // Default book emoji
}
