import React from 'react';
import { useTheme } from '../theme/ThemeProvider';

export const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      type="button"
      className="group relative w-20 h-10 rounded-full flex items-center glass border border-border/50 transition-all duration-500 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 focus:outline-none focus:ring-2 focus:ring-primary/30 overflow-hidden"
    >
      {/* Background gradient that shifts */}
      <div className={`absolute inset-0 transition-all duration-700 ${isDark
          ? 'bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-primary/10'
          : 'bg-gradient-to-r from-amber-400/10 via-yellow-400/10 to-orange-400/10'
        }`} />

      {/* Emoji indicators on track */}
      <div className="absolute inset-0 flex items-center justify-between px-3 pointer-events-none">
        <span className={`text-base transition-all duration-500 ${!isDark ? 'opacity-100 scale-110' : 'opacity-30 scale-75'
          }`}>☀️</span>
        <span className={`text-base transition-all duration-500 ${isDark ? 'opacity-100 scale-110' : 'opacity-30 scale-75'
          }`}>🌙</span>
      </div>

      {/* Sliding toggle knob */}
      <div
        className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-700 shadow-xl border-2
          ${isDark
            ? 'translate-x-11 bg-gradient-to-br from-indigo-600 to-primary border-primary/30 rotate-[360deg]'
            : 'translate-x-1 bg-gradient-to-br from-amber-400 to-yellow-400 border-amber-300/50 rotate-0'}`}
      >
        {/* Inner glow effect */}
        <div className={`absolute inset-0 rounded-full blur-md transition-opacity duration-500 ${isDark ? 'bg-primary/50 opacity-60' : 'bg-amber-400/50 opacity-60'
          }`} />

        {/* Emoji in knob */}
        <div className="relative z-10 text-lg leading-none">
          {isDark ? '🌙' : '☀️'}
        </div>
      </div>

      {/* Shimmer effect on hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

      {/* Subtle pulse effect */}
      <div className={`absolute inset-0 rounded-full transition-opacity duration-500 ${isDark
          ? 'bg-primary/5 group-hover:bg-primary/10'
          : 'bg-amber-500/5 group-hover:bg-amber-500/10'
        }`} />
    </button>
  );
};
