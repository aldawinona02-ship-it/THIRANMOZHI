import React, { useRef, useState, useEffect, useCallback } from 'react';
import { getTheme } from '../lib/themes';
import { hapticPulse } from '../lib/speech';
import { getMascot } from './Mascots';

// Sand-tray tracing.
// - Inside the letter shape a warm sand-toned tile is exposed.
// - The child drags a finger over the letter and their trail leaves darker sand
//   marks (like drawing in a sandbox) plus scattered grain particles.
// - Coverage is forgiving: only ~14 grid cells inside the letter's bbox needed
//   to reach 100%, so a light gestural trace works.
// - A theme-mascot glider gently follows the finger.
export const TraceCanvas = ({ glyph, themeId, onComplete, size = 340 }) => {
  const svgRef = useRef(null);
  const [points, setPoints] = useState([]);
  const [grains, setGrains] = useState([]); // scattered sand particles along the trail
  const [pct, setPct] = useState(0);
  const cellsRef = useRef(new Set());
  const [charPos, setCharPos] = useState({ x: size * 0.5, y: size * 0.15 });
  const drawingRef = useRef(false);
  const uniqueId = useRef(`tm-${Math.random().toString(36).slice(2, 9)}`);

  const theme = getTheme(themeId);
  const Mascot = getMascot(themeId);

  const GRID = 8;               // 8×8 = 64 potential cells inside the letter bbox
  const TARGET_CELLS = 14;      // very forgiving — a light stroke reaches 100%

  const getSvgPoint = useCallback((e) => {
    const svg = svgRef.current;
    if (!svg) return null;
    const pt = svg.createSVGPoint();
    const source = e.touches?.[0] || e;
    pt.x = source.clientX;
    pt.y = source.clientY;
    const ctm = svg.getScreenCTM();
    if (!ctm) return null;
    const local = pt.matrixTransform(ctm.inverse());
    return { x: local.x, y: local.y };
  }, []);

  const registerPoint = useCallback((p) => {
    const margin = size * 0.13;
    const inner = size - margin * 2;
    if (p.x < margin || p.x > size - margin || p.y < margin || p.y > size - margin) return;
    const cx = Math.floor(((p.x - margin) / inner) * GRID);
    const cy = Math.floor(((p.y - margin) / inner) * GRID);
    const key = `${cx}:${cy}`;
    if (!cellsRef.current.has(key)) {
      cellsRef.current.add(key);
      const n = cellsRef.current.size;
      const nextPct = Math.min(100, Math.round((n / TARGET_CELLS) * 100));
      setPct(nextPct);
      if (nextPct >= 100 && onComplete) {
        setTimeout(() => onComplete(), 350);
      }
    }
    // Scatter a couple of sand grains around the pointer (drop the older ones)
    setGrains(prev => {
      const fresh = [
        { x: p.x + (Math.random() - 0.5) * 40, y: p.y + (Math.random() - 0.5) * 40, r: 1 + Math.random() * 2 },
        { x: p.x + (Math.random() - 0.5) * 34, y: p.y + (Math.random() - 0.5) * 34, r: 0.8 + Math.random() * 1.6 },
      ];
      const next = [...prev, ...fresh];
      return next.length > 320 ? next.slice(next.length - 320) : next;
    });
    setCharPos({ x: p.x, y: p.y });
  }, [size, onComplete]);

  const onDown = (e) => {
    e.preventDefault();
    drawingRef.current = true;
    const p = getSvgPoint(e);
    if (p) {
      setPoints((prev) => [...prev, [p]]);
      registerPoint(p);
      hapticPulse(6);
    }
  };
  const onMove = (e) => {
    if (!drawingRef.current) return;
    e.preventDefault();
    const p = getSvgPoint(e);
    if (!p) return;
    setPoints((prev) => {
      const copy = [...prev];
      const cur = copy[copy.length - 1] || [];
      copy[copy.length - 1] = [...cur, p];
      return copy;
    });
    registerPoint(p);
  };
  const onUp = () => { drawingRef.current = false; };

  useEffect(() => {
    const up = () => { drawingRef.current = false; };
    window.addEventListener('pointerup', up);
    window.addEventListener('touchend', up);
    return () => {
      window.removeEventListener('pointerup', up);
      window.removeEventListener('touchend', up);
    };
  }, []);

  const reset = () => {
    setPoints([]);
    setGrains([]);
    cellsRef.current = new Set();
    setPct(0);
  };

  const done = pct >= 100;
  const SAND_LIGHT = '#FDE68A';
  const SAND_MID = '#D6A24E';
  const SAND_DARK = '#78350F';

  return (
    <div className="flex flex-col items-center gap-4 select-none">
      <svg
        ref={svgRef}
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onTouchStart={onDown}
        onTouchMove={onMove}
        onTouchEnd={onUp}
        style={{
          background: '#FFF7ED',
          borderRadius: 24,
          border: `2px solid ${theme.ring}`,
          touchAction: 'none',
          cursor: 'crosshair',
          boxShadow: 'inset 0 4px 20px rgba(120, 53, 15, 0.12)',
        }}
        data-testid="trace-canvas"
      >
        <defs>
          <mask id={`letter-mask-${uniqueId.current}`}>
            <rect x="0" y="0" width={size} height={size} fill="black" />
            <text
              x="50%"
              y="50%"
              dominantBaseline="middle"
              textAnchor="middle"
              fontSize={size * 0.68}
              fontFamily="Lexend, sans-serif"
              fontWeight="800"
              fill="white"
            >
              {glyph}
            </text>
          </mask>
          <filter id={`sand-blur-${uniqueId.current}`}>
            <feGaussianBlur stdDeviation="0.6" />
          </filter>
        </defs>

        {/* Sand base showing INSIDE the letter — light beige */}
        <g mask={`url(#letter-mask-${uniqueId.current})`}>
          <rect x="0" y="0" width={size} height={size} fill={SAND_LIGHT} />
        </g>

        {/* Subtle grey outline of the letter for guidance */}
        <text
          x="50%"
          y="50%"
          dominantBaseline="middle"
          textAnchor="middle"
          fontSize={size * 0.68}
          fontFamily="Lexend, sans-serif"
          fontWeight="800"
          fill="none"
          stroke="#B45309"
          strokeWidth="3"
          strokeLinejoin="round"
          pointerEvents="none"
          opacity="0.55"
        >
          {glyph}
        </text>

        {/* Sand trail — brush strokes and grains, ALL clipped to letter shape */}
        <g mask={`url(#letter-mask-${uniqueId.current})`} pointerEvents="none">
          {/* soft brush base */}
          {points.map((path, i) => (
            <polyline
              key={`b-${i}`}
              points={path.map(p => `${p.x},${p.y}`).join(' ')}
              fill="none"
              stroke={SAND_MID}
              strokeWidth="52"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.55"
              filter={`url(#sand-blur-${uniqueId.current})`}
            />
          ))}
          {/* darker inner trail */}
          {points.map((path, i) => (
            <polyline
              key={`d-${i}`}
              points={path.map(p => `${p.x},${p.y}`).join(' ')}
              fill="none"
              stroke={SAND_DARK}
              strokeWidth="20"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.32"
            />
          ))}
          {/* scattered grains */}
          {grains.map((g, i) => (
            <circle key={i} cx={g.x} cy={g.y} r={g.r} fill={SAND_DARK} opacity="0.42" />
          ))}
        </g>

        {/* Start anchor dot — small guide */}
        <circle cx={size * 0.5} cy={size * 0.19} r="7" fill="var(--mozhi-pink)" pointerEvents="none">
          <animate attributeName="r" values="7;10;7" dur="1600ms" repeatCount="indefinite" />
        </circle>

        {/* Mascot glider */}
        <foreignObject
          x={charPos.x - 32}
          y={charPos.y - 32}
          width="64"
          height="64"
          pointerEvents="none"
          style={{ transition: 'x 200ms ease-out, y 200ms ease-out' }}
        >
          <div
            xmlns="http://www.w3.org/1999/xhtml"
            style={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              background: '#FFFFFF',
              border: `3px solid ${theme.ring}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
              overflow: 'hidden',
            }}
          >
            <Mascot size={58} />
          </div>
        </foreignObject>
      </svg>

      <div className="w-full max-w-md">
        <div className="h-3 rounded-full" style={{ background: 'var(--border-slate)' }}>
          <div
            className="h-full rounded-full"
            style={{ background: 'var(--teal-calm)', width: `${pct}%`, transition: 'width 300ms ease' }}
            data-testid="trace-progress"
          />
        </div>
        <div className="text-center text-sm mt-2 font-bold" style={{ color: 'var(--text-secondary)' }}>
          {done ? 'Beautiful writing!' : `Sweep your finger in the sand — ${pct}%`}
        </div>
      </div>

      <button
        onClick={reset}
        className="text-sm font-bold rounded-full px-4 py-2"
        style={{ background: 'var(--card-white)', border: '1px solid var(--border-slate)', color: 'var(--text-secondary)' }}
        data-testid="trace-reset"
      >
        Smooth the sand
      </button>
    </div>
  );
};
