import React from 'react';
import { getTheme } from '../lib/themes';
import { getMascot } from './Mascots';

// Full cartoon mascot on a soft ring backdrop.
export const ThemeAvatar = ({ themeId, size = 120, ring = true, ariaLabel = 'Guide' }) => {
  const theme = getTheme(themeId);
  const Mascot = getMascot(themeId);

  return (
    <div
      role="img"
      aria-label={ariaLabel}
      className="relative inline-flex items-center justify-center rounded-full"
      style={{
        width: size,
        height: size,
        background: theme.bg,
        border: ring ? `4px solid ${theme.ring}` : 'none',
      }}
      data-testid="theme-avatar"
    >
      <Mascot size={size * 0.86} />
    </div>
  );
};
