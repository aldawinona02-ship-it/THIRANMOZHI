// Themed background decorations — subtle scattered SVG ambient elements per theme.
// Stays in the background (z-index 0), pointer-events none, low opacity so it never
// competes with the main content. Only very slow drift/twinkle animations.
import React from 'react';

const Star = ({ x, y, size = 10, delay = 0 }) => (
  <svg x={x} y={y} width={size} height={size} viewBox="0 0 20 20" className="tm-twinkle" style={{ animationDelay: `${delay}ms` }}>
    <polygon points="10,0 12,7 20,7 14,12 16,20 10,15 4,20 6,12 0,7 8,7" fill="#FBBF24" />
  </svg>
);

const Planet = ({ x, y, size, color, ring = false }) => (
  <svg x={x} y={y} width={size} height={size} viewBox="0 0 60 60" className="tm-float">
    {ring && <ellipse cx="30" cy="34" rx="28" ry="7" fill="none" stroke="#94A3B8" strokeWidth="2" opacity="0.6" />}
    <circle cx="30" cy="30" r="20" fill={color} />
    <ellipse cx="24" cy="24" rx="7" ry="4" fill="#FFFFFF" opacity="0.35" />
  </svg>
);

const Paw = ({ x, y, r = 4 }) => (
  <g transform={`translate(${x}, ${y})`} className="tm-float">
    <circle cx="0" cy="0" r={r * 1.6} fill="#78350F" opacity="0.35" />
    <circle cx="-4" cy="-5" r={r} fill="#78350F" opacity="0.35" />
    <circle cx="4" cy="-5" r={r} fill="#78350F" opacity="0.35" />
    <circle cx="-7" cy="-1" r={r * 0.8} fill="#78350F" opacity="0.35" />
    <circle cx="7" cy="-1" r={r * 0.8} fill="#78350F" opacity="0.35" />
  </g>
);

const Cloud = ({ x, y, size = 60 }) => (
  <svg x={x} y={y} width={size} height={size * 0.6} viewBox="0 0 100 60" className="tm-float" style={{ opacity: 0.5 }}>
    <ellipse cx="30" cy="35" rx="18" ry="14" fill="#F1F5F9" />
    <ellipse cx="55" cy="28" rx="22" ry="18" fill="#F1F5F9" />
    <ellipse cx="72" cy="38" rx="16" ry="12" fill="#F1F5F9" />
  </svg>
);

const Petal = ({ x, y, color, rotate = 0 }) => (
  <svg x={x} y={y} width="30" height="30" viewBox="0 0 30 30" className="tm-float">
    <g transform={`rotate(${rotate} 15 15)`}>
      <ellipse cx="15" cy="15" rx="5" ry="12" fill={color} opacity="0.55" />
    </g>
  </svg>
);

const Leaf = ({ x, y, size = 26 }) => (
  <svg x={x} y={y} width={size} height={size} viewBox="0 0 30 30" className="tm-float">
    <path d="M15 3 Q 3 15 15 27 Q 27 15 15 3" fill="#10B981" opacity="0.4" />
    <line x1="15" y1="6" x2="15" y2="24" stroke="#065F46" strokeWidth="1" opacity="0.4" />
  </svg>
);

const RailTie = ({ x, y }) => (
  <rect x={x} y={y} width="26" height="6" rx="2" fill="#78350F" opacity="0.35" />
);

const Note = ({ x, y, symbol = '♪', color = '#8B5CF6', size = 24 }) => (
  <text x={x} y={y} fontSize={size} fill={color} opacity="0.45" className="tm-float">{symbol}</text>
);

// Deterministic pseudo-random so the scatter looks consistent across renders.
const rand = (seed) => {
  let s = seed;
  return () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
};

const scatter = (count, seed, w = 100, h = 100) => {
  const r = rand(seed);
  return Array.from({ length: count }).map(() => ({ x: r() * w, y: r() * h }));
};

const Layer = ({ children }) => (
  <div aria-hidden style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: 0 }}>
    <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" style={{ position: 'absolute', inset: 0 }}>
      {children}
    </svg>
  </div>
);

export const ThemeBackground = ({ themeId }) => {
  if (themeId === 'space') {
    const stars = scatter(28, 11, 100, 100);
    return (
      <Layer>
        {stars.map((s, i) => <Star key={i} x={s.x} y={s.y} size={2.5} delay={i * 220} />)}
        <Planet x="4" y="6" size="8" color="#F472B6" />
        <Planet x="86" y="70" size="10" color="#38BDF8" ring />
        <Planet x="70" y="10" size="6" color="#FBBF24" />
      </Layer>
    );
  }
  if (themeId === 'animals') {
    const paws = scatter(16, 22, 100, 100);
    return <Layer>{paws.map((p, i) => <Paw key={i} x={p.x} y={p.y} r={1.6} />)}</Layer>;
  }
  if (themeId === 'birds') {
    const clouds = scatter(6, 33, 90, 40);
    return <Layer>{clouds.map((c, i) => <Cloud key={i} x={c.x} y={c.y + 3} size={14} />)}</Layer>;
  }
  if (themeId === 'flowers') {
    const petals = scatter(24, 44, 100, 100);
    const colors = ['#F472B6', '#FBBF24', '#A78BFA', '#F87171'];
    return <Layer>{petals.map((p, i) => <Petal key={i} x={p.x} y={p.y} color={colors[i % 4]} rotate={(i * 47) % 360} />)}</Layer>;
  }
  if (themeId === 'plants') {
    const leaves = scatter(20, 55, 100, 100);
    return <Layer>{leaves.map((l, i) => <Leaf key={i} x={l.x} y={l.y} size={4} />)}</Layer>;
  }
  if (themeId === 'train') {
    return (
      <Layer>
        {Array.from({ length: 20 }).map((_, i) => <RailTie key={i} x={i * 5} y={94} />)}
        <line x1="0" y1="97" x2="100" y2="97" stroke="#78350F" strokeWidth="0.4" opacity="0.4" />
        {scatter(6, 66, 100, 40).map((c, i) => <Cloud key={`c${i}`} x={c.x} y={c.y} size={12} />)}
      </Layer>
    );
  }
  if (themeId === 'music') {
    const notes = scatter(18, 77, 100, 100);
    const syms = ['♪', '♫', '♩', '♬'];
    const colors = ['#8B5CF6', '#EC4899', '#38BDF8', '#FBBF24'];
    return <Layer>{notes.map((n, i) => <Note key={i} x={n.x} y={n.y} symbol={syms[i % 4]} color={colors[i % 4]} size={3.5} />)}</Layer>;
  }
  return null;
};
