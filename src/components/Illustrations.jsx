// Illustrative SVG artwork for screening activities.
// Deliberately non-photorealistic but colorful and warm — no thin outline-only icons.
import React from 'react';

export const BellArt = ({ size = 96 }) => (
  <svg viewBox="0 0 100 100" width={size} height={size} aria-hidden>
    <defs>
      <linearGradient id="bell-body" x1="0" x2="0" y1="0" y2="1">
        <stop offset="0" stopColor="#FCD34D" />
        <stop offset="1" stopColor="#D97706" />
      </linearGradient>
    </defs>
    <rect x="45" y="10" width="10" height="10" rx="3" fill="#B45309" />
    <path d="M25 65 Q25 25 50 22 Q75 25 75 65 Z" fill="url(#bell-body)" stroke="#92400E" strokeWidth="2" />
    <rect x="20" y="65" width="60" height="8" rx="4" fill="#92400E" />
    <circle cx="50" cy="82" r="6" fill="#B45309" />
    <path d="M32 45 Q35 40 40 42" stroke="#FEF3C7" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.6" />
  </svg>
);

export const CloudArt = ({ size = 96 }) => (
  <svg viewBox="0 0 100 100" width={size} height={size} aria-hidden>
    <defs>
      <linearGradient id="cloud-body" x1="0" x2="0" y1="0" y2="1">
        <stop offset="0" stopColor="#F1F5F9" />
        <stop offset="1" stopColor="#94A3B8" />
      </linearGradient>
    </defs>
    <ellipse cx="35" cy="45" rx="18" ry="16" fill="url(#cloud-body)" />
    <ellipse cx="55" cy="38" rx="22" ry="18" fill="url(#cloud-body)" />
    <ellipse cx="72" cy="48" rx="16" ry="14" fill="url(#cloud-body)" />
    <ellipse cx="50" cy="55" rx="30" ry="12" fill="url(#cloud-body)" />
    {/* raindrops */}
    <path d="M30 68 L28 78 Q30 82 32 78 Z" fill="#3B82F6" />
    <path d="M46 72 L44 82 Q46 86 48 82 Z" fill="#3B82F6" />
    <path d="M62 68 L60 78 Q62 82 64 78 Z" fill="#3B82F6" />
    <path d="M76 72 L74 82 Q76 86 78 82 Z" fill="#3B82F6" />
  </svg>
);

export const WindArt = ({ size = 96 }) => (
  <svg viewBox="0 0 100 100" width={size} height={size} aria-hidden>
    <path d="M10 30 Q40 20 60 30 T90 30" stroke="#0EA5E9" strokeWidth="6" fill="none" strokeLinecap="round" />
    <path d="M10 52 Q40 40 60 52 T85 52" stroke="#0284C7" strokeWidth="7" fill="none" strokeLinecap="round" />
    <path d="M10 74 Q30 66 50 74 T80 74" stroke="#0EA5E9" strokeWidth="5" fill="none" strokeLinecap="round" />
    {/* leaves swept along */}
    <path d="M78 28 q6 -4 10 2 q-4 6 -10 -2" fill="#059669" />
    <path d="M76 50 q6 -3 9 3 q-4 5 -9 -3" fill="#10B981" />
  </svg>
);

export const AppleArt = ({ size = 96 }) => (
  <svg viewBox="0 0 100 100" width={size} height={size} aria-hidden>
    <defs>
      <radialGradient id="apple-body" cx="0.4" cy="0.35" r="0.7">
        <stop offset="0" stopColor="#FCA5A5" />
        <stop offset="0.5" stopColor="#EF4444" />
        <stop offset="1" stopColor="#B91C1C" />
      </radialGradient>
    </defs>
    <path d="M50 25 Q30 25 25 55 Q25 85 50 85 Q75 85 75 55 Q70 25 50 25 Z" fill="url(#apple-body)" />
    <path d="M50 25 Q52 15 60 12" stroke="#78350F" strokeWidth="4" fill="none" strokeLinecap="round" />
    <path d="M55 20 Q62 15 68 20 Q65 26 58 25" fill="#22C55E" />
    <ellipse cx="40" cy="42" rx="8" ry="5" fill="#FEE2E2" opacity="0.6" />
  </svg>
);

export const BananaArt = ({ size = 96 }) => (
  <svg viewBox="0 0 100 100" width={size} height={size} aria-hidden>
    <path d="M20 30 Q15 70 55 82 Q75 84 85 70 Q60 70 40 55 Q28 40 30 25 Q25 25 20 30 Z" fill="#FBBF24" stroke="#A16207" strokeWidth="2" />
    <path d="M30 25 Q26 22 22 24" stroke="#78350F" strokeWidth="3" fill="none" strokeLinecap="round" />
  </svg>
);

export const OrangeArt = ({ size = 96 }) => (
  <svg viewBox="0 0 100 100" width={size} height={size} aria-hidden>
    <defs>
      <radialGradient id="orange-body" cx="0.4" cy="0.4" r="0.7">
        <stop offset="0" stopColor="#FED7AA" />
        <stop offset="1" stopColor="#EA580C" />
      </radialGradient>
    </defs>
    <circle cx="50" cy="55" r="32" fill="url(#orange-body)" stroke="#9A3412" strokeWidth="2" />
    <path d="M45 25 Q50 18 58 22 Q54 28 48 27" fill="#22C55E" />
    <path d="M50 30 L50 78 M30 55 L70 55 M35 40 L65 70 M35 70 L65 40" stroke="#C2410C" strokeWidth="1" opacity="0.4" />
  </svg>
);

export const GrapesArt = ({ size = 96 }) => (
  <svg viewBox="0 0 100 100" width={size} height={size} aria-hidden>
    {[
      [45,30],[55,30],
      [40,42],[50,42],[60,42],
      [45,54],[55,54],[35,54],[65,54],
      [50,66],[40,66],[60,66],
      [45,78],[55,78],
    ].map(([cx,cy], i) => (
      <circle key={i} cx={cx} cy={cy} r="7" fill="#8B5CF6" stroke="#5B21B6" strokeWidth="1" />
    ))}
    <path d="M50 22 Q54 14 62 12" stroke="#78350F" strokeWidth="3" fill="none" strokeLinecap="round" />
    <path d="M55 15 Q65 10 70 18 Q64 22 56 20" fill="#22C55E" />
  </svg>
);

export const BalloonArt = ({ size = 120, color = '#EF4444' }) => (
  <svg viewBox="0 0 100 150" width={size} height={size * 1.5} aria-hidden>
    <ellipse cx="50" cy="55" rx="36" ry="45" fill={color} stroke="rgba(0,0,0,0.15)" strokeWidth="1.5" />
    <ellipse cx="38" cy="40" rx="8" ry="14" fill="#FFFFFF" opacity="0.4" />
    <polygon points="45,100 55,100 50,110" fill={color} />
    <path d="M50 110 Q 55 125 48 138 Q 42 128 50 122 Q 56 118 50 110" stroke="#78350F" strokeWidth="2" fill="none" strokeLinecap="round" />
  </svg>
);

export const BasketArt = ({ size = 160 }) => (
  <svg viewBox="0 0 200 140" width={size} height={size * 0.7} aria-hidden>
    <path d="M20 40 Q100 20 180 40" stroke="#78350F" strokeWidth="6" fill="none" />
    <path d="M25 45 L45 130 L155 130 L175 45 Z" fill="#D97706" stroke="#78350F" strokeWidth="3" />
    <path d="M25 45 L175 45" stroke="#78350F" strokeWidth="4" />
    {Array.from({ length: 7 }).map((_, i) => (
      <line key={i} x1={35 + i * 22} y1="50" x2={40 + i * 22} y2="128" stroke="#78350F" strokeWidth="2" opacity="0.6" />
    ))}
    {Array.from({ length: 4 }).map((_, i) => (
      <line key={i} x1="30" y1={60 + i * 18} x2="170" y2={60 + i * 18} stroke="#78350F" strokeWidth="2" opacity="0.5" />
    ))}
  </svg>
);
