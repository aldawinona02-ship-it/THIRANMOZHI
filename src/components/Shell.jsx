import React from 'react';
import { useApp } from '../context/AppContext';
import { ThemeAvatar } from './ThemeAvatar';
import { getTheme } from '../lib/themes';
import { Volume2 } from 'lucide-react';
import { speak, stopSpeech } from '../lib/speech';
import { ThemeBackground } from './ThemeBackground';

export const Shell = ({ children, title, subtitle, speakText, showAvatar = true, testid = 'shell' }) => {
  const { state } = useApp();
  const theme = state.theme ? getTheme(state.theme) : null;
  // Soft theme-tinted canvas — still a solid pastel, never a neon or dark bg.
  const canvasBg = theme?.bg || 'var(--canvas-slate)';

  return (
    <div className="min-h-screen w-full fade-in relative" style={{ background: canvasBg }} data-testid={testid}>
      {theme && <ThemeBackground themeId={theme.id} />}
      <div className="mx-auto max-w-5xl px-6 md:px-10 py-10 md:py-14 relative" style={{ zIndex: 1 }}>
        {(title || showAvatar) && (
          <div className="flex items-start gap-6 mb-10">
            {showAvatar && theme && (
              <ThemeAvatar themeId={theme.id} size={110} ariaLabel={`${theme.guideName} guide`} />
            )}
            <div className="flex-1">
              {title && (
                <h1 className="display text-3xl md:text-5xl font-extrabold" style={{ color: 'var(--text-primary)' }}>
                  {title}
                </h1>
              )}
              {subtitle && (
                <p className="mt-3 text-base md:text-lg" style={{ color: 'var(--text-secondary)' }}>
                  {subtitle}
                </p>
              )}
              {speakText && (
                <button
                  onClick={() => speak(speakText)}
                  onMouseLeave={stopSpeech}
                  className="mt-4 inline-flex items-center gap-2 px-5 py-3 rounded-full text-sm font-bold"
                  style={{ background: 'var(--card-white)', border: '1px solid var(--border-slate)', color: 'var(--teal-calm)' }}
                  data-testid="replay-audio-btn"
                >
                  <Volume2 size={18} strokeWidth={2.5} /> Replay
                </button>
              )}
            </div>
          </div>
        )}
        {children}
      </div>
    </div>
  );
};

export const PrimaryButton = ({ children, onClick, disabled, testid, variant = 'purple', className = '' }) => {
  const bg = variant === 'pink' ? 'var(--mozhi-pink)' : variant === 'teal' ? 'var(--teal-calm)' : 'var(--thiran-purple)';
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      data-testid={testid}
      className={`rounded-full font-bold tracking-wide min-h-[64px] px-10 text-lg text-white transition-opacity duration-300 ${disabled ? 'opacity-40 cursor-not-allowed' : 'hover:opacity-90'} ${className}`}
      style={{ background: bg }}
    >
      {children}
    </button>
  );
};

export const OptionCard = ({ selected, onClick, children, testid, className = '' }) => (
  <button
    onClick={onClick}
    data-testid={testid}
    className={`w-full text-left rounded-3xl p-6 md:p-8 transition-opacity duration-300 ${className}`}
    style={{
      background: 'var(--card-white)',
      border: `2px solid ${selected ? 'var(--thiran-purple)' : 'var(--border-slate)'}`,
      boxShadow: selected ? '0 0 0 4px rgba(139,92,246,0.15)' : 'none',
      minHeight: 100,
    }}
  >
    {children}
  </button>
);
