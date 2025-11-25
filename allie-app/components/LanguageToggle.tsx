'use client';

import { LanguageMode } from '@/lib/bookTypes';

interface LanguageToggleProps {
  currentMode: LanguageMode;
  onModeChange: (mode: LanguageMode) => void;
}

export default function LanguageToggle({ currentMode, onModeChange }: LanguageToggleProps) {
  const modes: { mode: LanguageMode; label: string; icon: string }[] = [
    { mode: 'en', label: 'English', icon: '🇺🇸' },
    { mode: 'zh', label: '中文', icon: '🇨🇳' },
    { mode: 'both', label: 'Both', icon: '🌏' },
  ];

  return (
    <div className="flex gap-2 bg-white/90 backdrop-blur-sm rounded-2xl p-2 shadow-lg">
      {modes.map(({ mode, label, icon }) => (
        <button
          key={mode}
          onClick={() => onModeChange(mode)}
          className={`
            flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-lg
            transition-all duration-200 transform active:scale-95
            ${
              currentMode === mode
                ? 'bg-gradient-to-br from-blue-500 to-purple-500 text-white shadow-md scale-105'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }
          `}
          aria-label={`Switch to ${label}`}
          aria-pressed={currentMode === mode}
        >
          <span className="text-2xl" role="img" aria-label={label}>
            {icon}
          </span>
          <span className="hidden sm:inline">{label}</span>
        </button>
      ))}
    </div>
  );
}
