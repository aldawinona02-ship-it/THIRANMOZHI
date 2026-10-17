// Cartoon mascot characters — filled colors, cute faces, gentle idle animations.
// Each mascot uses a 200×200 viewBox. Sizing is done via the `size` prop.
// Animation classes are defined in index.css (tm-mascot-idle, tm-eye, tm-hand-wave, tm-tail-wag).
import React from 'react';

const wrap = (size, children) => (
  <svg viewBox="0 0 200 200" width={size} height={size} className="tm-mascot" aria-hidden>
    {children}
  </svg>
);

// ---------- ASTRO (Space) ----------
export const MascotAstro = ({ size = 200 }) => wrap(size, (
  <g>
    {/* backpack */}
    <rect x="55" y="118" width="18" height="46" rx="7" fill="#94A3B8" />
    <rect x="127" y="118" width="18" height="46" rx="7" fill="#94A3B8" />
    {/* body */}
    <rect x="65" y="108" width="70" height="72" rx="26" fill="#F8FAFC" stroke="#64748B" strokeWidth="3" />
    {/* chest badge */}
    <rect x="85" y="122" width="30" height="24" rx="6" fill="#EC4899" />
    <circle cx="100" cy="134" r="5" fill="#FFFFFF" />
    {/* arms */}
    <g className="tm-hand-wave" style={{ transformOrigin: '145px 120px' }}>
      <rect x="135" y="112" width="22" height="42" rx="10" fill="#F8FAFC" stroke="#64748B" strokeWidth="3" />
      <circle cx="146" cy="152" r="9" fill="#F8FAFC" stroke="#64748B" strokeWidth="3" />
    </g>
    <rect x="43" y="112" width="22" height="42" rx="10" fill="#F8FAFC" stroke="#64748B" strokeWidth="3" />
    <circle cx="54" cy="152" r="9" fill="#F8FAFC" stroke="#64748B" strokeWidth="3" />
    {/* legs */}
    <rect x="75" y="170" width="20" height="22" rx="8" fill="#F8FAFC" stroke="#64748B" strokeWidth="3" />
    <rect x="105" y="170" width="20" height="22" rx="8" fill="#F8FAFC" stroke="#64748B" strokeWidth="3" />
    {/* helmet ring */}
    <circle cx="100" cy="72" r="48" fill="#F8FAFC" stroke="#64748B" strokeWidth="3" />
    {/* visor */}
    <ellipse cx="100" cy="72" rx="36" ry="30" fill="#7DD3FC" stroke="#0284C7" strokeWidth="2" />
    <ellipse cx="86" cy="60" rx="9" ry="6" fill="#FFFFFF" opacity="0.65" />
    {/* face */}
    <ellipse cx="90" cy="74" rx="4" ry="6" fill="#1E293B" className="tm-eye" />
    <ellipse cx="110" cy="74" rx="4" ry="6" fill="#1E293B" className="tm-eye" />
    <path d="M 90 88 Q 100 96 110 88" stroke="#1E293B" strokeWidth="2.5" fill="none" strokeLinecap="round" />
    {/* helmet antenna */}
    <line x1="100" y1="24" x2="100" y2="12" stroke="#64748B" strokeWidth="3" strokeLinecap="round" />
    <circle cx="100" cy="10" r="4" fill="#EC4899" className="tm-twinkle" />
  </g>
));

// ---------- OLLIE (Animals — puppy) ----------
export const MascotOllie = ({ size = 200 }) => wrap(size, (
  <g>
    {/* body */}
    <ellipse cx="100" cy="150" rx="55" ry="38" fill="#D97706" />
    {/* legs */}
    <rect x="72" y="170" width="16" height="24" rx="6" fill="#B45309" />
    <rect x="112" y="170" width="16" height="24" rx="6" fill="#B45309" />
    {/* tail */}
    <path d="M155 138 Q 175 118 170 138" stroke="#D97706" strokeWidth="14" strokeLinecap="round" fill="none" className="tm-tail-wag" style={{ transformOrigin: '155px 138px' }} />
    {/* belly */}
    <ellipse cx="100" cy="158" rx="30" ry="18" fill="#FBBF24" />
    {/* head */}
    <circle cx="100" cy="85" r="50" fill="#D97706" />
    {/* ears */}
    <ellipse cx="60" cy="60" rx="16" ry="26" fill="#78350F" transform="rotate(-20 60 60)" />
    <ellipse cx="140" cy="60" rx="16" ry="26" fill="#78350F" transform="rotate(20 140 60)" />
    {/* muzzle */}
    <ellipse cx="100" cy="105" rx="26" ry="18" fill="#FEF3C7" />
    {/* nose */}
    <ellipse cx="100" cy="92" rx="7" ry="5" fill="#1E293B" />
    {/* mouth */}
    <path d="M 100 98 L 100 106 M 92 106 Q 100 115 108 106" stroke="#1E293B" strokeWidth="2.5" fill="none" strokeLinecap="round" />
    {/* tongue */}
    <ellipse cx="100" cy="112" rx="4" ry="3" fill="#EC4899" />
    {/* eyes */}
    <circle cx="82" cy="80" r="7" fill="#FFFFFF" />
    <circle cx="118" cy="80" r="7" fill="#FFFFFF" />
    <circle cx="83" cy="80" r="4" fill="#1E293B" className="tm-eye" />
    <circle cx="119" cy="80" r="4" fill="#1E293B" className="tm-eye" />
    <circle cx="82" cy="78" r="1.5" fill="#FFFFFF" />
    <circle cx="118" cy="78" r="1.5" fill="#FFFFFF" />
  </g>
));

// ---------- KILI (Birds — pink cardinal) ----------
export const MascotKili = ({ size = 200 }) => wrap(size, (
  <g>
    {/* legs */}
    <line x1="90" y1="172" x2="90" y2="188" stroke="#F59E0B" strokeWidth="4" strokeLinecap="round" />
    <line x1="110" y1="172" x2="110" y2="188" stroke="#F59E0B" strokeWidth="4" strokeLinecap="round" />
    <path d="M85 188 L 82 192 M 90 188 L 90 194 M 95 188 L 98 192" stroke="#F59E0B" strokeWidth="3" strokeLinecap="round" />
    <path d="M105 188 L 102 192 M 110 188 L 110 194 M 115 188 L 118 192" stroke="#F59E0B" strokeWidth="3" strokeLinecap="round" />
    {/* body */}
    <ellipse cx="100" cy="115" rx="55" ry="60" fill="#F472B6" />
    {/* belly */}
    <ellipse cx="100" cy="135" rx="34" ry="38" fill="#FCE7F3" />
    {/* wing */}
    <path d="M55 105 Q 42 135 60 158 Q 76 145 70 115 Z" fill="#DB2777" className="tm-hand-wave" style={{ transformOrigin: '65px 110px' }} />
    {/* head crest */}
    <path d="M100 40 Q 92 55 100 60 Q 108 55 100 40" fill="#DB2777" />
    {/* beak */}
    <polygon points="100,72 88,88 112,88" fill="#F59E0B" stroke="#B45309" strokeWidth="1.5" />
    <line x1="88" y1="88" x2="112" y2="88" stroke="#B45309" strokeWidth="1" />
    {/* eyes */}
    <circle cx="86" cy="80" r="6" fill="#FFFFFF" />
    <circle cx="114" cy="80" r="6" fill="#FFFFFF" />
    <circle cx="86" cy="80" r="3.5" fill="#1E293B" className="tm-eye" />
    <circle cx="114" cy="80" r="3.5" fill="#1E293B" className="tm-eye" />
    <circle cx="85" cy="79" r="1.2" fill="#FFFFFF" />
    <circle cx="113" cy="79" r="1.2" fill="#FFFFFF" />
    {/* tail */}
    <path d="M145 160 L 175 175 L 155 145 Z" fill="#DB2777" />
  </g>
));

// ---------- POO (Flowers — daisy) ----------
export const MascotPoo = ({ size = 200 }) => wrap(size, (
  <g>
    {/* stem */}
    <rect x="95" y="130" width="10" height="60" rx="5" fill="#059669" />
    <path d="M100 155 Q 118 145 130 160 Q 118 168 100 158" fill="#10B981" />
    <path d="M100 170 Q 82 158 70 172 Q 82 182 100 174" fill="#10B981" />
    {/* petals */}
    <g className="tm-mascot-spin" style={{ transformOrigin: '100px 90px' }}>
      {[0,60,120,180,240,300].map(a => (
        <ellipse key={a} cx="100" cy="55" rx="14" ry="22" fill="#F472B6" transform={`rotate(${a} 100 90)`} />
      ))}
    </g>
    {/* center */}
    <circle cx="100" cy="90" r="30" fill="#FBBF24" stroke="#D97706" strokeWidth="2.5" />
    {/* face */}
    <circle cx="90" cy="85" r="4" fill="#1E293B" className="tm-eye" />
    <circle cx="110" cy="85" r="4" fill="#1E293B" className="tm-eye" />
    <circle cx="89" cy="83" r="1.2" fill="#FFFFFF" />
    <circle cx="109" cy="83" r="1.2" fill="#FFFFFF" />
    <path d="M 88 98 Q 100 108 112 98" stroke="#1E293B" strokeWidth="2.5" fill="none" strokeLinecap="round" />
    {/* cheeks */}
    <circle cx="80" cy="95" r="4" fill="#F472B6" opacity="0.6" />
    <circle cx="120" cy="95" r="4" fill="#F472B6" opacity="0.6" />
  </g>
));

// ---------- ILAI (Plants — sprout) ----------
export const MascotIlai = ({ size = 200 }) => wrap(size, (
  <g>
    {/* pot */}
    <path d="M60 155 L 75 195 L 125 195 L 140 155 Z" fill="#D97706" stroke="#78350F" strokeWidth="3" />
    <rect x="55" y="150" width="90" height="12" rx="4" fill="#78350F" />
    {/* soil */}
    <ellipse cx="100" cy="155" rx="42" ry="6" fill="#44403C" />
    {/* stem */}
    <rect x="95" y="105" width="10" height="52" rx="5" fill="#059669" />
    {/* leaves (big) */}
    <path d="M100 115 Q 55 100 55 60 Q 90 65 100 115" fill="#10B981" stroke="#065F46" strokeWidth="2" />
    <path d="M100 115 Q 145 100 145 60 Q 110 65 100 115" fill="#10B981" stroke="#065F46" strokeWidth="2" />
    <path d="M75 88 L 95 105" stroke="#065F46" strokeWidth="1.5" fill="none" />
    <path d="M125 88 L 105 105" stroke="#065F46" strokeWidth="1.5" fill="none" />
    {/* head (top bud) */}
    <circle cx="100" cy="60" r="28" fill="#34D399" stroke="#065F46" strokeWidth="2" />
    {/* face */}
    <circle cx="90" cy="55" r="4" fill="#1E293B" className="tm-eye" />
    <circle cx="110" cy="55" r="4" fill="#1E293B" className="tm-eye" />
    <circle cx="89" cy="53" r="1.2" fill="#FFFFFF" />
    <circle cx="109" cy="53" r="1.2" fill="#FFFFFF" />
    <path d="M 90 68 Q 100 76 110 68" stroke="#1E293B" strokeWidth="2.5" fill="none" strokeLinecap="round" />
  </g>
));

// ---------- SAM (Train) ----------
export const MascotSam = ({ size = 200 }) => wrap(size, (
  <g>
    {/* rails */}
    <line x1="20" y1="185" x2="180" y2="185" stroke="#78350F" strokeWidth="4" />
    {[30,60,90,120,150,180].map(x => <line key={x} x1={x} y1="180" x2={x} y2="192" stroke="#78350F" strokeWidth="4" />)}
    {/* body */}
    <rect x="45" y="90" width="120" height="70" rx="10" fill="#EF4444" stroke="#B91C1C" strokeWidth="3" />
    {/* cabin */}
    <rect x="115" y="60" width="45" height="45" rx="6" fill="#DC2626" stroke="#B91C1C" strokeWidth="3" />
    <rect x="125" y="70" width="25" height="20" rx="3" fill="#7DD3FC" />
    {/* chimney */}
    <rect x="65" y="45" width="20" height="30" rx="3" fill="#1E293B" />
    <ellipse cx="75" cy="42" rx="12" ry="6" fill="#1E293B" />
    {/* steam */}
    <circle cx="70" cy="30" r="8" fill="#F1F5F9" opacity="0.8" className="tm-twinkle" />
    <circle cx="86" cy="22" r="10" fill="#F1F5F9" opacity="0.75" className="tm-twinkle" />
    <circle cx="60" cy="20" r="7" fill="#F1F5F9" opacity="0.65" className="tm-twinkle" />
    {/* front light */}
    <circle cx="50" cy="128" r="9" fill="#FBBF24" stroke="#B45309" strokeWidth="2" />
    {/* wheels */}
    <circle cx="70" cy="165" r="16" fill="#1E293B" />
    <circle cx="70" cy="165" r="5" fill="#94A3B8" />
    <circle cx="130" cy="165" r="20" fill="#1E293B" />
    <circle cx="130" cy="165" r="7" fill="#94A3B8" />
    {/* face on the boiler */}
    <circle cx="90" cy="115" r="6" fill="#FFFFFF" />
    <circle cx="110" cy="115" r="6" fill="#FFFFFF" />
    <circle cx="90" cy="115" r="3.5" fill="#1E293B" className="tm-eye" />
    <circle cx="110" cy="115" r="3.5" fill="#1E293B" className="tm-eye" />
    <path d="M 88 132 Q 100 140 112 132" stroke="#1E293B" strokeWidth="2.5" fill="none" strokeLinecap="round" />
  </g>
));

// ---------- MELO (Music note) ----------
export const MascotMelo = ({ size = 200 }) => wrap(size, (
  <g>
    {/* stem */}
    <rect x="130" y="50" width="10" height="90" rx="4" fill="#8B5CF6" />
    {/* flag */}
    <path d="M140 50 Q 168 70 155 100 Q 152 78 140 78 Z" fill="#8B5CF6" />
    {/* note head */}
    <ellipse cx="105" cy="140" rx="42" ry="32" fill="#8B5CF6" stroke="#6D28D9" strokeWidth="3" transform="rotate(-18 105 140)" />
    {/* face on note head */}
    <circle cx="92" cy="135" r="5" fill="#FFFFFF" />
    <circle cx="116" cy="132" r="5" fill="#FFFFFF" />
    <circle cx="93" cy="136" r="3" fill="#1E293B" className="tm-eye" />
    <circle cx="117" cy="133" r="3" fill="#1E293B" className="tm-eye" />
    <path d="M 90 148 Q 104 158 118 149" stroke="#1E293B" strokeWidth="2.5" fill="none" strokeLinecap="round" />
    {/* little sparkle notes */}
    <text x="45" y="70" fontSize="26" fill="#EC4899" className="tm-twinkle">♪</text>
    <text x="165" y="150" fontSize="22" fill="#38BDF8" className="tm-twinkle">♫</text>
  </g>
));

const MAP = {
  space: MascotAstro,
  animals: MascotOllie,
  birds: MascotKili,
  flowers: MascotPoo,
  plants: MascotIlai,
  train: MascotSam,
  music: MascotMelo,
};

export const getMascot = (themeId) => MAP[themeId] || MascotAstro;
