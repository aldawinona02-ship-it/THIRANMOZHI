// Shared screening test components used by all 4 disorder tracks.
// Each disorder has its own 9-test set with weights & channels tuned to the
// research profile. Tests are randomized at runtime by the Screening runner.

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { speak, playTone, playSequence, hapticPulse } from './speech';
import {
  Volume2, Circle, Square, Triangle, Star, Bell, Cloud, Wind,
  Apple, Rocket, Trees, Sun, Bird, Flower2, Music, TrainFront,
} from 'lucide-react';
import { Draggable } from '../components/Draggable';
import { BellArt, CloudArt, WindArt, AppleArt, BananaArt, OrangeArt, GrapesArt, BasketArt, BalloonArt } from '../components/Illustrations';

// ---------- Reusable primitives ----------
const Tile = ({ onClick, children, testid, active = false, wide = false }) => (
  <button
    onClick={onClick}
    data-testid={testid}
    className={`rounded-2xl p-6 flex items-center justify-center transition-opacity duration-300`}
    style={{
      background: active ? 'var(--teal-calm)' : 'var(--card-white)',
      border: `${active ? '3px' : '1px'} solid ${active ? 'var(--teal-calm)' : 'var(--border-slate)'}`,
      minHeight: wide ? 140 : 100,
      color: active ? '#fff' : 'var(--text-primary)',
    }}
  >
    {children}
  </button>
);

// ================================================================
//  AUTISM TESTS  (previously in AutismScreening.jsx — kept identical)
// ================================================================

const AutT0 = ({ onDone }) => {
  const anomalyIdx = 5;
  return (
    <div className="grid grid-cols-4 gap-4" data-testid="aut-t0">
      {Array.from({ length: 8 }).map((_, i) => (
        <button key={i} onClick={() => onDone(i === anomalyIdx ? 1 : 0)} className="rounded-2xl flex items-center justify-center" style={{ background: 'var(--card-white)', border: '1px solid var(--border-slate)', width: 120, height: 120 }} data-testid={`aut-t0-${i}`}>
          <svg width="70" height="70" viewBox="0 0 70 70">
            {i === anomalyIdx ? (
              <polygon points="10,10 60,10 60,60 10,60 10,30 14,30 14,10" fill="var(--thiran-purple)" />
            ) : (
              <rect x="10" y="10" width="50" height="50" fill="var(--thiran-purple)" />
            )}
          </svg>
        </button>
      ))}
    </div>
  );
};

const AutT1 = ({ onDone }) => {
  const [tab, setTab] = useState('A');
  const [dwellA, setDwellA] = useState(0);
  const [placed, setPlaced] = useState([false, false, false]);
  const startRef = useRef(Date.now());
  useEffect(() => {
    const iv = setInterval(() => { if (tab === 'A') setDwellA(v => v + 200); }, 200);
    return () => clearInterval(iv);
  }, [tab]);
  useEffect(() => {
    if (placed.every(Boolean)) {
      const total = Date.now() - startRef.current;
      const ratio = total > 0 ? dwellA / total : 0.5;
      onDone(ratio > 0.75 ? 1 : 0);
    }
  }, [placed, dwellA, onDone]);
  return (
    <div className="w-full max-w-2xl" data-testid="aut-t1">
      <div className="flex gap-3 mb-6">
        <button onClick={() => setTab('A')} className="flex-1 py-4 rounded-2xl font-bold" style={{ background: tab==='A' ? 'var(--teal-calm)' : 'var(--card-white)', color: tab==='A' ? '#fff' : 'var(--text-primary)', border: '1px solid var(--border-slate)' }}>Picture Guide</button>
        <button onClick={() => setTab('B')} className="flex-1 py-4 rounded-2xl font-bold" style={{ background: tab==='B' ? 'var(--teal-calm)' : 'var(--card-white)', color: tab==='B' ? '#fff' : 'var(--text-primary)', border: '1px solid var(--border-slate)' }}>Text Guide</button>
      </div>
      <div className="rounded-2xl p-6 mb-6" style={{ background: 'var(--card-white)', border: '1px solid var(--border-slate)' }}>
        {tab === 'A' ? (
          <div className="flex items-center justify-around">
            <Circle size={54} style={{ color: 'var(--thiran-purple)' }} />
            <div className="text-3xl">→</div>
            <Square size={54} style={{ color: 'var(--mozhi-pink)' }} />
            <div className="text-3xl">→</div>
            <Triangle size={54} style={{ color: 'var(--teal-calm)' }} />
          </div>
        ) : (
          <p className="text-lg">Place the circle, then square, then triangle into their spots.</p>
        )}
      </div>
      <div className="grid grid-cols-3 gap-4">
        {['Circle', 'Square', 'Triangle'].map((label, i) => (
          <Tile key={i} onClick={() => setPlaced(p => p.map((v, j) => j === i ? true : v))} active={placed[i]} testid={`aut-t1-p-${i}`}>{placed[i] ? '✓' : label}</Tile>
        ))}
      </div>
    </div>
  );
};

const AutT2 = ({ onDone }) => {
  const [count, setCount] = useState(0);
  const advance = () => { const c = count + 1; setCount(c); if (c >= 3) onDone(1); };
  return (
    <div className="w-full max-w-2xl" data-testid="aut-t2">
      <p className="mb-6 text-lg" style={{ color: 'var(--text-secondary)' }}>Tap each shape to snap it into its outline.</p>
      <div className="grid grid-cols-3 gap-6">
        {[Circle, Square, Triangle].map((Icon, i) => (
          <div key={i} className="flex flex-col items-center gap-3">
            <button onClick={advance} disabled={count > i} className="rounded-2xl p-6" style={{ background: count > i ? 'var(--teal-calm)' : 'var(--card-white)', border: '1px solid var(--border-slate)', minHeight: 100 }}>
              <Icon size={54} style={{ color: count > i ? '#fff' : 'var(--thiran-purple)' }} />
            </button>
            <div className="rounded-2xl border-2 border-dashed p-6" style={{ borderColor: 'var(--border-slate)', minHeight: 100 }}>
              <Icon size={54} style={{ color: count > i ? 'var(--teal-calm)' : 'var(--border-slate)' }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const AutT3 = ({ onDone }) => {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => playTone(440, 1500), 400);
    const t2 = setTimeout(() => setShow(true), 2200);
    return () => { clearTimeout(t); clearTimeout(t2); };
  }, []);
  const opts = [
    { id: 'bell',  Art: BellArt,  v: 1, bg: '#FEF3C7' },
    { id: 'cloud', Art: CloudArt, v: 0, bg: '#E0F2FE' },
    { id: 'wind',  Art: WindArt,  v: 0, bg: '#ECFDF5' },
  ];
  return (
    <div className="flex flex-col items-center" data-testid="aut-t3">
      <button onClick={() => playTone(440, 1500)} className="rounded-2xl p-8 mb-8" style={{ background: 'var(--teal-calm)' }}>
        <Volume2 size={70} color="#fff" />
      </button>
      {show && (
        <div className="grid grid-cols-3 gap-4 w-full fade-in">
          {opts.map((o) => (
            <button
              key={o.id}
              onClick={() => onDone(o.v)}
              className="rounded-2xl p-4 flex items-center justify-center transition-opacity duration-300"
              style={{ background: o.bg, border: '1px solid var(--border-slate)', minHeight: 160 }}
              data-testid={`aut-t3-${o.id}`}
            >
              <o.Art size={96} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// Burst all three balloons — replaces the old tone-echo test.
const AutT4 = ({ onDone }) => {
  const [popped, setPopped] = useState([false, false, false]);
  useEffect(() => {
    const t = setTimeout(() => speak('Burst all three balloons.', { rate: 0.72, volume: 1 }), 700);
    return () => clearTimeout(t);
  }, []);
  useEffect(() => { if (popped.every(Boolean)) setTimeout(() => onDone(1), 500); }, [popped, onDone]);
  const pop = (i) => {
    playTone(880, 120);
    hapticPulse(30);
    setPopped(p => p.map((v, j) => (j === i ? true : v)));
  };
  const colors = ['#EF4444', '#3B82F6', '#10B981'];
  return (
    <div className="w-full max-w-2xl" data-testid="aut-t4">
      <div className="flex justify-around items-end" style={{ minHeight: 240 }}>
        {[0, 1, 2].map(i => (
          <button
            key={i}
            onClick={() => !popped[i] && pop(i)}
            disabled={popped[i]}
            className="transition-opacity duration-500"
            style={{ opacity: popped[i] ? 0 : 1, background: 'transparent', border: 'none', cursor: popped[i] ? 'default' : 'pointer' }}
            data-testid={`aut-t4-balloon-${i}`}
            aria-label={`Balloon ${i + 1}`}
          >
            <BalloonArt size={110} color={colors[i]} />
          </button>
        ))}
      </div>
      <div className="mt-6 flex justify-center gap-3">
        {popped.map((p, i) => (
          <div key={i} className="w-8 h-8 rounded-full" style={{ background: p ? 'var(--teal-calm)' : 'var(--border-slate)', transition: 'background 300ms ease' }} />
        ))}
      </div>
    </div>
  );
};

// Instruction-following: "Press the apple three times."
const AutT5 = ({ onDone }) => {
  const [taps, setTaps] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => speak('Press the apple three times.', { rate: 0.72 }), 900);
    return () => clearTimeout(t);
  }, []);
  const tap = () => {
    hapticPulse(15);
    playTone(660, 120);
    const next = taps + 1;
    setTaps(next);
    if (next >= 3) setTimeout(() => onDone(1), 400);
  };
  return (
    <div className="w-full max-w-2xl flex flex-col items-center gap-6" data-testid="aut-t5">
      <button
        onClick={tap}
        className="rounded-3xl p-6 transition-transform duration-200"
        style={{
          background: '#FEE2E2',
          border: '3px solid #FCA5A5',
          transform: `scale(${1 + taps * 0.03})`,
        }}
        data-testid="aut-t5-apple"
      >
        <AppleArt size={140} />
      </button>
      <div className="flex gap-3" aria-label="tap count">
        {[0, 1, 2].map(i => (
          <div key={i} className="w-8 h-8 rounded-full" style={{ background: i < taps ? 'var(--teal-calm)' : 'var(--border-slate)', transition: 'background 300ms ease' }} />
        ))}
      </div>
      <div className="text-sm font-bold" style={{ color: 'var(--text-secondary)' }}>{taps} of 3</div>
    </div>
  );
};

// Real pointer/touch drag — square block into target box.
const AutT6 = ({ onDone }) => {
  const [done, setDone] = useState(false);
  // Container: 480 wide, 180 tall. Target center approx x=400, y=90.
  const targetX = 400, targetY = 90;
  return (
    <div className="w-full max-w-2xl" data-testid="aut-t6">
      <p className="mb-4 text-sm text-center font-bold" style={{ color: 'var(--text-secondary)' }}>Drag the purple square into the dashed box.</p>
      <div className="relative rounded-2xl overflow-hidden mx-auto" style={{ height: 180, width: 480, maxWidth: '100%', border: '1px solid var(--border-slate)', background: '#F1F5F9' }}>
        {/* Target */}
        <div className="absolute rounded-2xl border-2 border-dashed" style={{ left: targetX - 40, top: targetY - 40, width: 80, height: 80, borderColor: done ? 'var(--teal-calm)' : 'var(--mozhi-pink)', background: done ? 'rgba(44,122,123,0.15)' : 'transparent', transition: 'background 300ms ease, border-color 300ms ease' }} />
        {!done && (
          <Draggable
            initialX={30}
            initialY={50}
            width={80}
            height={80}
            testid="aut-t6-block"
            onDrop={({ cx, cy }) => {
              const dx = cx - targetX;
              const dy = cy - targetY;
              if (Math.hypot(dx, dy) < 55) {
                hapticPulse(30);
                setDone(true);
                setTimeout(() => onDone(1), 500);
              }
            }}
          >
            <div style={{ width: 80, height: 80, background: 'var(--thiran-purple)', borderRadius: 16, boxShadow: '0 4px 12px rgba(139,92,246,0.35)' }} />
          </Draggable>
        )}
        {done && (
          <div className="absolute" style={{ left: targetX - 40, top: targetY - 40 }}>
            <div style={{ width: 80, height: 80, background: 'var(--teal-calm)', borderRadius: 16 }} />
          </div>
        )}
      </div>
    </div>
  );
};

// Fruit-into-basket drag game (replaces the bouncing-ball sliders).
const AutT7 = ({ onDone }) => {
  const initial = [
    { id: 'apple',  Art: AppleArt,  x: 20,  y: 40,  placed: false },
    { id: 'banana', Art: BananaArt, x: 180, y: 30,  placed: false },
    { id: 'orange', Art: OrangeArt, x: 40,  y: 180, placed: false },
    { id: 'grapes', Art: GrapesArt, x: 200, y: 200, placed: false },
  ];
  const [fruits, setFruits] = useState(initial);
  // Basket center inside the 500x340 container (bottom-right).
  const BX = 380, BY = 240, SNAP = 100;

  const tryDrop = (id, cx, cy) => {
    const dx = cx - BX;
    const dy = cy - BY;
    if (Math.hypot(dx, dy) < SNAP) {
      hapticPulse(30);
      setFruits(prev => prev.map(f => f.id === id ? { ...f, placed: true, x: BX - 30 + (Math.random() * 30 - 15), y: BY - 60 } : f));
    }
  };

  useEffect(() => {
    if (fruits.every(f => f.placed)) {
      setTimeout(() => onDone(1), 600);
    }
  }, [fruits, onDone]);

  return (
    <div className="w-full max-w-2xl" data-testid="aut-t7">
      <p className="mb-4 text-sm text-center font-bold" style={{ color: 'var(--text-secondary)' }}>Drop every fruit into the basket.</p>
      <div className="relative rounded-3xl overflow-hidden mx-auto" style={{ width: 500, maxWidth: '100%', height: 340, background: 'linear-gradient(180deg, #F0FDF4 0%, #DCFCE7 100%)', border: '1px solid var(--border-slate)' }}>
        {/* grass strip */}
        <div className="absolute left-0 right-0 bottom-0" style={{ height: 40, background: '#86EFAC' }} />
        {/* Basket target */}
        <div className="absolute" style={{ left: BX - 80, top: BY - 60 }}>
          <BasketArt size={160} />
        </div>
        {fruits.map(f => (
          <Draggable
            key={f.id}
            initialX={f.x}
            initialY={f.y}
            width={80}
            height={80}
            disabled={f.placed}
            testid={`aut-t7-${f.id}`}
            z={f.placed ? 5 : 2}
            onDrop={({ cx, cy }) => tryDrop(f.id, cx, cy)}
          >
            <f.Art size={80} />
          </Draggable>
        ))}
      </div>
      <div className="mt-4 flex justify-center gap-3">
        {fruits.map(f => (
          <div key={f.id} className="w-8 h-8 rounded-full" style={{ background: f.placed ? 'var(--teal-calm)' : 'var(--border-slate)', transition: 'background 300ms ease' }} />
        ))}
      </div>
    </div>
  );
};

// Real drag: three DIFFERENT shapes (circle, triangle, star) into their outlines.
const AutT8 = ({ onDone }) => {
  const shapes = [
    { id: 'circle',   color: '#8B5CF6', targetX: 340, targetY: 60,  initialX: 30, initialY: 30 },
    { id: 'triangle', color: '#EC4899', targetX: 340, targetY: 160, initialX: 30, initialY: 140 },
    { id: 'star',     color: '#F59E0B', targetX: 340, targetY: 260, initialX: 30, initialY: 250 },
  ];
  const [placed, setPlaced] = useState({});

  useEffect(() => {
    if (Object.keys(placed).length === 3) setTimeout(() => onDone(1), 600);
  }, [placed, onDone]);

  const renderShape = (id, color, opacity = 1, dashed = false) => (
    <svg viewBox="0 0 80 80" width="80" height="80">
      {id === 'circle' && (
        <circle cx="40" cy="40" r="34"
          fill={dashed ? 'transparent' : color}
          stroke={color} strokeWidth="3"
          strokeDasharray={dashed ? '6 4' : '0'} opacity={opacity} />
      )}
      {id === 'triangle' && (
        <polygon points="40,10 72,68 8,68"
          fill={dashed ? 'transparent' : color}
          stroke={color} strokeWidth="3"
          strokeDasharray={dashed ? '6 4' : '0'} opacity={opacity} />
      )}
      {id === 'star' && (
        <polygon points="40,6 48,30 74,30 53,46 62,72 40,56 18,72 27,46 6,30 32,30"
          fill={dashed ? 'transparent' : color}
          stroke={color} strokeWidth="3"
          strokeDasharray={dashed ? '6 4' : '0'} opacity={opacity} />
      )}
    </svg>
  );

  return (
    <div className="w-full max-w-2xl" data-testid="aut-t8">
      <p className="mb-4 text-sm text-center font-bold" style={{ color: 'var(--text-secondary)' }}>Drag each shape into its matching outline.</p>
      <div className="relative rounded-2xl mx-auto" style={{ width: 460, maxWidth: '100%', height: 340, background: '#F1F5F9', border: '1px solid var(--border-slate)' }}>
        {/* target outlines */}
        {shapes.map(s => (
          <div key={`t-${s.id}`} className="absolute" style={{ left: s.targetX - 40, top: s.targetY - 40, width: 80, height: 80, pointerEvents: 'none' }}>
            {renderShape(s.id, s.color, placed[s.id] ? 1 : 0.9, !placed[s.id])}
          </div>
        ))}
        {/* draggable shapes */}
        {shapes.map(s => !placed[s.id] && (
          <Draggable
            key={s.id}
            initialX={s.initialX}
            initialY={s.initialY}
            width={80}
            height={80}
            testid={`aut-t8-${s.id}`}
            onDrop={({ cx, cy }) => {
              const dx = cx - s.targetX;
              const dy = cy - s.targetY;
              if (Math.hypot(dx, dy) < 60) {
                hapticPulse(30);
                playTone(660, 120);
                setPlaced(prev => ({ ...prev, [s.id]: true }));
              }
            }}
          >
            {renderShape(s.id, s.color)}
          </Draggable>
        ))}
      </div>
    </div>
  );
};

// ================================================================
//  IDD TESTS
// ================================================================

const IddT0_ObjectMatch = ({ onDone }) => {
  const [picked, setPicked] = useState(null);
  const pick = (v) => { setPicked(v); setTimeout(() => onDone(v ? 1 : 0), 700); };
  return (
    <div className="w-full max-w-2xl" data-testid="idd-t0">
      <p className="mb-6 text-lg text-center">Match the real object to its picture.</p>
      <div className="flex items-center gap-6">
        <div className="rounded-2xl p-8 flex-1" style={{ background: '#FEE2E2', border: '1px solid var(--border-slate)' }}>
          <Apple size={90} style={{ color: '#DC2626' }} fill="#DC2626" className="mx-auto" />
          <div className="text-center mt-3 font-bold">Real Apple</div>
        </div>
        <div className="text-3xl">→</div>
        <div className="flex-1 grid grid-cols-3 gap-3">
          {[Apple, Rocket, Bird].map((I, i) => (
            <button key={i} onClick={() => pick(i === 0)} className="rounded-2xl p-4 aspect-square flex items-center justify-center" style={{ background: picked === (i === 0) ? 'var(--teal-calm)' : 'var(--card-white)', border: '2px solid var(--border-slate)' }} data-testid={`idd-t0-${i}`}>
              <I size={40} style={{ color: 'var(--thiran-purple)' }} />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

const IddT1_MemorySpan = ({ onDone }) => {
  const [step, setStep] = useState(0);
  const targets = [Star, Circle];
  const [pressed, setPressed] = useState([]);
  const press = (i) => {
    const next = [...pressed, i];
    setPressed(next);
    if (next.length >= step + 1) {
      const ok = next.every((v, j) => v === j);
      if (ok && step + 1 >= 2) { onDone(1); return; }
      if (ok) { setStep(step + 1); setPressed([]); }
      else { setPressed([]); }
    }
  };
  useEffect(() => { const t = setTimeout(() => onDone(step >= 1 ? 1 : 0), 25000); return () => clearTimeout(t); }, [step, onDone]);
  return (
    <div className="w-full max-w-2xl" data-testid="idd-t1">
      <p className="mb-6 text-lg text-center">Tap {step === 0 ? 'the star' : 'the star, then the circle'}.</p>
      <div className="flex justify-center gap-8">
        {targets.map((Icon, i) => (
          <Tile key={i} onClick={() => press(i)} testid={`idd-t1-${i}`} wide>
            <Icon size={80} style={{ color: i === 0 ? '#F59E0B' : '#10B981' }} fill={i === 0 ? '#F59E0B' : '#10B981'} />
          </Tile>
        ))}
      </div>
    </div>
  );
};

const IddT2_Generalize = ({ onDone }) => {
  const [picked, setPicked] = useState(null);
  const target = 0;
  const options = [
    { bg: '#FEE2E2', shape: 'star' },
    { bg: '#DBEAFE', shape: 'circle' },
    { bg: '#DCFCE7', shape: 'square' },
  ];
  return (
    <div className="w-full max-w-2xl" data-testid="idd-t2">
      <p className="mb-4 text-lg text-center">Find the star.</p>
      <div className="mb-6 rounded-2xl p-6 flex items-center justify-center" style={{ background: '#FEF9C3', border: '1px solid var(--border-slate)' }}>
        <Star size={60} style={{ color: '#F59E0B' }} fill="#F59E0B" />
      </div>
      <div className="grid grid-cols-3 gap-4">
        {options.map((o, i) => (
          <button key={i} onClick={() => { setPicked(i); setTimeout(() => onDone(i === target ? 1 : 0), 700); }} className="rounded-2xl p-6 aspect-square flex items-center justify-center" style={{ background: o.bg, border: picked === i ? '3px solid var(--teal-calm)' : '1px solid var(--border-slate)' }} data-testid={`idd-t2-${i}`}>
            {o.shape === 'star' && <Star size={54} style={{ color: '#F59E0B' }} fill="#F59E0B" />}
            {o.shape === 'circle' && <Circle size={54} style={{ color: '#3B82F6' }} fill="#3B82F6" />}
            {o.shape === 'square' && <Square size={54} style={{ color: '#10B981' }} fill="#10B981" />}
          </button>
        ))}
      </div>
    </div>
  );
};

const IddT3_Latency = ({ onDone }) => {
  const [ready, setReady] = useState(false);
  const startRef = useRef(0);
  useEffect(() => { const t = setTimeout(() => { setReady(true); startRef.current = Date.now(); }, 800); return () => clearTimeout(t); }, []);
  return (
    <div className="w-full max-w-2xl flex flex-col items-center gap-6" data-testid="idd-t3">
      <p className="text-lg text-center">When the friendly icon appears, tap it. Take your time.</p>
      {ready ? (
        <button onClick={() => { const dt = Date.now() - startRef.current; onDone(dt < 8000 ? 1 : 0); }} className="rounded-full p-10" style={{ background: 'var(--teal-calm)' }} data-testid="idd-t3-tap">
          <Rocket size={80} color="#fff" />
        </button>
      ) : <div className="text-sm" style={{ color: 'var(--text-muted)' }}>Waiting…</div>}
    </div>
  );
};

const IddT4_Frustration = ({ onDone }) => {
  const [taps, setTaps] = useState(0);
  const [showPause, setShowPause] = useState(false);
  useEffect(() => { const t = setTimeout(() => onDone(taps >= 3 && !showPause ? 1 : 0), 12000); return () => clearTimeout(t); }, [taps, showPause, onDone]);
  return (
    <div className="w-full max-w-2xl text-center" data-testid="idd-t4">
      <p className="mb-6 text-lg">Tap the sun 3 times.</p>
      <button onClick={() => setTaps(t => t + 1)} className="rounded-full p-8 mx-auto" style={{ background: '#FEF9C3', border: '3px solid #FDE68A' }}>
        <Sun size={80} style={{ color: '#F59E0B' }} />
      </button>
      <div className="mt-4 font-bold">{taps} / 3</div>
      {taps >= 3 && <button onClick={() => onDone(1)} className="mt-6 rounded-full px-6 py-3 font-bold text-white" style={{ background: 'var(--teal-calm)' }} data-testid="idd-t4-done">Continue</button>}
    </div>
  );
};

const IddT5_CauseEffect = ({ onDone }) => {
  const [taps, setTaps] = useState(0);
  return (
    <div className="w-full max-w-2xl text-center" data-testid="idd-t5">
      <p className="mb-6 text-lg">Press the button — see what happens!</p>
      <button onClick={() => { setTaps(t => t + 1); playTone(660, 300); hapticPulse(30); if (taps + 1 >= 2) setTimeout(() => onDone(1), 500); }} className="rounded-full p-12 mx-auto" style={{ background: 'var(--thiran-purple)' }} data-testid="idd-t5-btn">
        <Rocket size={100} color="#fff" style={{ transform: `translateY(${-taps * 15}px)`, transition: 'transform 500ms ease' }} />
      </button>
    </div>
  );
};

const IddT6_BroadTarget = ({ onDone }) => {
  const [popped, setPopped] = useState([false, false, false]);
  useEffect(() => { if (popped.every(Boolean)) setTimeout(() => onDone(1), 400); }, [popped, onDone]);
  return (
    <div className="grid grid-cols-3 gap-6 w-full max-w-2xl" data-testid="idd-t6">
      {[0,1,2].map(i => (
        <button key={i} onClick={() => { hapticPulse(20); setPopped(p => p.map((v,j) => j===i?true:v)); }} className="rounded-full aspect-square" style={{ background: popped[i] ? 'transparent' : 'var(--mozhi-pink)', opacity: popped[i] ? 0.3 : 1, minWidth: 100, minHeight: 100 }} data-testid={`idd-t6-${i}`} />
      ))}
    </div>
  );
};

const IddT7_Attention = ({ onDone }) => {
  const [engaged, setEngaged] = useState(false);
  const [taps, setTaps] = useState(0);
  useEffect(() => { const t = setTimeout(() => onDone(taps >= 4 ? 1 : 0), 15000); return () => clearTimeout(t); }, [taps, onDone]);
  return (
    <div className="w-full max-w-2xl text-center" data-testid="idd-t7">
      <p className="mb-6 text-lg">Tap the little tree whenever you see it.</p>
      <button onClick={() => { setEngaged(true); setTaps(t => t + 1); }} className="rounded-2xl p-8 mx-auto" style={{ background: '#DCFCE7', border: '2px solid #86EFAC' }}>
        <Trees size={80} style={{ color: '#059669' }} />
      </button>
      <div className="mt-4 font-bold">{taps}</div>
    </div>
  );
};

const IddT8_AudioVisual = ({ onDone }) => {
  useEffect(() => { const t = setTimeout(() => speak('Tap the flower.', { rate: 0.7 }), 800); return () => clearTimeout(t); }, []);
  return (
    <div className="grid grid-cols-2 gap-6 w-full max-w-2xl" data-testid="idd-t8">
      <Tile onClick={() => onDone(0)} testid="idd-t8-sun" wide><Sun size={80} style={{ color: '#F59E0B' }} /></Tile>
      <Tile onClick={() => onDone(1)} testid="idd-t8-flower" wide><Flower2 size={80} style={{ color: '#EC4899' }} /></Tile>
    </div>
  );
};

// ================================================================
//  DYSLEXIA TESTS
// ================================================================

const DysT0_Mirror = ({ onDone }) => {
  const options = ['normal', 'mirror', 'flip'];
  const [picked, setPicked] = useState(null);
  return (
    <div className="w-full max-w-2xl" data-testid="dys-t0">
      <p className="mb-4 text-lg text-center">Find the arrow that matches this one.</p>
      <div className="mb-6 flex justify-center"><div className="text-6xl">→</div></div>
      <div className="grid grid-cols-3 gap-4">
        {options.map((o, i) => (
          <button key={i} onClick={() => { setPicked(o); setTimeout(() => onDone(o === 'normal' ? 1 : 0), 600); }} className="rounded-2xl p-8 aspect-square flex items-center justify-center text-5xl" style={{ background: 'var(--card-white)', border: picked === o ? '3px solid var(--teal-calm)' : '1px solid var(--border-slate)' }} data-testid={`dys-t0-${o}`}>
            {o === 'normal' && '→'}{o === 'mirror' && '←'}{o === 'flip' && '↑'}
          </button>
        ))}
      </div>
    </div>
  );
};

const DysT1_Crowding = ({ onDone }) => {
  return (
    <div className="w-full max-w-2xl" data-testid="dys-t1">
      <p className="mb-4 text-lg text-center">Find the pink star.</p>
      <div className="grid grid-cols-6 gap-2 p-4 rounded-2xl" style={{ background: 'var(--card-white)', border: '1px solid var(--border-slate)' }}>
        {Array.from({ length: 24 }).map((_, i) => (
          <button key={i} onClick={() => onDone(i === 13 ? 1 : 0)} className="aspect-square flex items-center justify-center" data-testid={`dys-t1-${i}`}>
            <Star size={28} style={{ color: i === 13 ? 'var(--mozhi-pink)' : '#94A3B8' }} fill={i === 13 ? 'var(--mozhi-pink)' : '#94A3B8'} />
          </button>
        ))}
      </div>
    </div>
  );
};

const DysT2_Pattern = ({ onDone }) => {
  const [picked, setPicked] = useState(null);
  return (
    <div className="w-full max-w-2xl" data-testid="dys-t2">
      <p className="mb-4 text-lg text-center">Which one looks the same as this?</p>
      <div className="mb-6 text-center display font-extrabold text-5xl" style={{ letterSpacing: '0.15em' }}>b p</div>
      <div className="grid grid-cols-3 gap-4">
        {['b p', 'd q', 'p b'].map((o, i) => (
          <button key={i} onClick={() => { setPicked(o); setTimeout(() => onDone(o === 'b p' ? 1 : 0), 600); }} className="rounded-2xl p-6 display font-extrabold text-4xl" style={{ background: 'var(--card-white)', border: picked === o ? '3px solid var(--teal-calm)' : '1px solid var(--border-slate)', letterSpacing: '0.15em' }} data-testid={`dys-t2-${i}`}>{o}</button>
        ))}
      </div>
    </div>
  );
};

const DysT3_Phoneme = ({ onDone }) => {
  useEffect(() => { const t = setTimeout(() => speak('mmm', { rate: 0.8 }), 500); return () => clearTimeout(t); }, []);
  return (
    <div className="w-full max-w-2xl" data-testid="dys-t3">
      <p className="mb-6 text-lg text-center">Which letter makes the sound "mmm"?</p>
      <button onClick={() => speak('mmm', { rate: 0.8 })} className="mx-auto mb-6 flex items-center gap-2 rounded-full px-6 py-3" style={{ background: 'var(--card-white)', border: '1px solid var(--border-slate)' }}><Volume2 size={20} /> Hear again</button>
      <div className="grid grid-cols-3 gap-4">
        {['M', 'S', 'T'].map((L, i) => (
          <Tile key={i} onClick={() => onDone(L === 'M' ? 1 : 0)} testid={`dys-t3-${L}`} wide><span className="display font-extrabold text-6xl">{L}</span></Tile>
        ))}
      </div>
    </div>
  );
};

const DysT4_MinPair = ({ onDone }) => {
  const [same, setSame] = useState(null);
  const play = () => { playTone(220, 300); setTimeout(() => playTone(240, 300), 500); };
  useEffect(() => { const t = setTimeout(play, 500); return () => clearTimeout(t); }, []);
  return (
    <div className="w-full max-w-2xl text-center" data-testid="dys-t4">
      <p className="mb-6 text-lg">Did the two sounds sound the same or different?</p>
      <button onClick={play} className="mx-auto mb-6 rounded-full px-6 py-3 font-bold" style={{ background: 'var(--card-white)', border: '1px solid var(--border-slate)' }}>Play again</button>
      <div className="grid grid-cols-2 gap-4">
        <button onClick={() => { setSame(true); setTimeout(() => onDone(0), 500); }} className="rounded-2xl py-6 font-bold text-lg" style={{ background: 'var(--card-white)', border: '2px solid var(--border-slate)' }} data-testid="dys-t4-same">Same</button>
        <button onClick={() => { setSame(false); setTimeout(() => onDone(1), 500); }} className="rounded-2xl py-6 font-bold text-lg" style={{ background: 'var(--card-white)', border: '2px solid var(--border-slate)' }} data-testid="dys-t4-diff">Different</button>
      </div>
    </div>
  );
};

const DysT5_Echo = ({ onDone }) => {
  const [seq, setSeq] = useState([]);
  const play = async () => { speak('M', { rate: 0.85 }); setTimeout(() => speak('S', { rate: 0.85 }), 900); };
  useEffect(() => { const t = setTimeout(play, 500); return () => clearTimeout(t); }, []);
  const tap = (L) => {
    const next = [...seq, L];
    setSeq(next);
    if (next.length === 2) { const ok = next[0]==='M' && next[1]==='S' ? 1 : 0; setTimeout(() => onDone(ok), 400); }
  };
  return (
    <div className="w-full max-w-2xl" data-testid="dys-t5">
      <p className="mb-4 text-lg text-center">Tap the letters in the same order.</p>
      <button onClick={play} className="mx-auto mb-6 flex items-center gap-2 rounded-full px-6 py-3" style={{ background: 'var(--card-white)', border: '1px solid var(--border-slate)' }}><Volume2 size={20} /> Replay</button>
      <div className="grid grid-cols-3 gap-4">
        {['M', 'S', 'T'].map(L => (
          <Tile key={L} onClick={() => tap(L)} testid={`dys-t5-${L}`} wide><span className="display font-extrabold text-6xl">{L}</span></Tile>
        ))}
      </div>
    </div>
  );
};

const DysT6_StrokeTrace = ({ onDone }) => {
  const [pos, setPos] = useState(0);
  return (
    <div className="w-full max-w-2xl" data-testid="dys-t6">
      <p className="mb-4 text-lg text-center">Slide from the pink dot to the teal dot.</p>
      <div className="relative rounded-2xl h-40 overflow-hidden" style={{ background: 'var(--card-white)', border: '1px solid var(--border-slate)' }}>
        <div className="absolute top-1/2 -translate-y-1/2 left-4 w-6 h-6 rounded-full" style={{ background: 'var(--mozhi-pink)' }} />
        <div className="absolute top-1/2 -translate-y-1/2 right-4 w-6 h-6 rounded-full" style={{ background: 'var(--teal-calm)' }} />
        <div className="absolute top-1/2 -translate-y-1/2 h-2 rounded-full" style={{ background: 'var(--thiran-purple)', width: `${pos}%`, left: 0 }} />
      </div>
      <input type="range" min="0" max="100" value={pos} onChange={(e) => { setPos(Number(e.target.value)); if (Number(e.target.value) >= 100) setTimeout(() => onDone(1), 400); }} className="w-full mt-4 h-3" data-testid="dys-t6-slider" />
    </div>
  );
};

const DysT7_Haptic = ({ onDone }) => {
  const [taps, setTaps] = useState(0);
  return (
    <div className="w-full max-w-2xl text-center" data-testid="dys-t7">
      <p className="mb-6 text-lg">Tap inside the teal zone. Feel the buzz.</p>
      <button onClick={() => { hapticPulse(30); setTaps(t => t + 1); if (taps + 1 >= 3) setTimeout(() => onDone(1), 400); }} className="rounded-2xl mx-auto" style={{ background: '#E6FFFA', border: '3px solid var(--teal-calm)', width: 200, height: 200 }} data-testid="dys-t7-zone" />
      <div className="mt-3 font-bold">{taps} / 3</div>
    </div>
  );
};

const DysT8_Snap = ({ onDone }) => {
  const [placed, setPlaced] = useState(false);
  return (
    <div className="w-full max-w-2xl flex items-center justify-around" data-testid="dys-t8">
      <button onClick={() => { setPlaced(true); hapticPulse(30); setTimeout(() => onDone(1), 400); }} className="rounded-2xl" style={{ background: placed ? 'transparent' : 'var(--thiran-purple)', width: 120, height: 120, opacity: placed ? 0.3 : 1 }} data-testid="dys-t8-piece" />
      <div className="rounded-2xl border-2 border-dashed" style={{ borderColor: placed ? 'var(--teal-calm)' : 'var(--border-slate)', width: 120, height: 120, background: placed ? 'var(--teal-calm)' : 'transparent' }} />
    </div>
  );
};

// ================================================================
//  ADHD TESTS
// ================================================================

const AdhdT0_Chase = ({ onDone }) => {
  const [pos, setPos] = useState({ x: 30, y: 30 });
  const [caught, setCaught] = useState(0);
  const relocate = () => {
    const x = 10 + Math.random() * 80;
    const y = 10 + Math.random() * 80;
    setPos({ x, y });
  };
  const tap = () => { hapticPulse(10); setCaught(c => c + 1); relocate(); if (caught + 1 >= 3) setTimeout(() => onDone(1), 300); };
  return (
    <div className="w-full max-w-2xl" data-testid="adhd-t0">
      <p className="mb-4 text-lg text-center">Catch the rocket. It jumps around!</p>
      <div className="relative rounded-2xl overflow-hidden mx-auto" style={{ background: '#EEF2FF', border: '2px solid #C7D2FE', width: 340, height: 340 }}>
        <button onClick={tap} className="absolute rounded-full p-3" style={{ left: `${pos.x}%`, top: `${pos.y}%`, background: 'var(--thiran-purple)', transition: 'left 300ms ease, top 300ms ease' }} data-testid="adhd-t0-target">
          <Rocket size={40} color="#fff" />
        </button>
      </div>
      <div className="text-center mt-3 font-bold">{caught} / 3</div>
    </div>
  );
};

const AdhdT1_StimulusChoice = ({ onDone }) => {
  const [picked, setPicked] = useState(null);
  return (
    <div className="grid grid-cols-2 gap-4 w-full max-w-2xl" data-testid="adhd-t1">
      <button onClick={() => { setPicked('clean'); setTimeout(() => onDone(1), 500); }} className="rounded-2xl aspect-square flex items-center justify-center" style={{ background: 'var(--card-white)', border: picked === 'clean' ? '3px solid var(--teal-calm)' : '1px solid var(--border-slate)' }} data-testid="adhd-t1-clean">
        <Star size={80} style={{ color: 'var(--thiran-purple)' }} />
      </button>
      <button onClick={() => { setPicked('busy'); setTimeout(() => onDone(0), 500); }} className="rounded-2xl aspect-square grid grid-cols-4 gap-1 p-3" style={{ background: 'var(--card-white)', border: picked === 'busy' ? '3px solid var(--teal-calm)' : '1px solid var(--border-slate)' }} data-testid="adhd-t1-busy">
        {Array.from({length:16}).map((_,i) => <Star key={i} size={14} style={{ color: ['#EF4444','#3B82F6','#10B981','#F59E0B'][i%4] }} />)}
      </button>
    </div>
  );
};

const AdhdT2_Flash = ({ onDone }) => {
  const [phase, setPhase] = useState('show'); // show -> answer
  const [taps, setTaps] = useState([]);
  const order = ['A', 'B', 'C'];
  useEffect(() => { const t = setTimeout(() => setPhase('answer'), 1500); return () => clearTimeout(t); }, []);
  const tap = (L) => {
    const next = [...taps, L];
    setTaps(next);
    if (next.length === 3) { const ok = next.join('') === order.join('') ? 1 : 0; setTimeout(() => onDone(ok), 400); }
  };
  return (
    <div className="w-full max-w-2xl" data-testid="adhd-t2">
      <p className="mb-4 text-lg text-center">{phase === 'show' ? 'Remember the order.' : 'Tap them in order.'}</p>
      <div className="grid grid-cols-3 gap-4">
        {order.map((L, i) => (
          <button key={L} onClick={() => phase === 'answer' && tap(L)} className="rounded-2xl display font-extrabold text-5xl" style={{ background: phase === 'show' ? 'var(--thiran-purple)' : 'var(--card-white)', color: phase === 'show' ? '#fff' : 'var(--text-primary)', border: '1px solid var(--border-slate)', minHeight: 120 }} data-testid={`adhd-t2-${L}`}>
            {phase === 'show' ? L : '?'}
          </button>
        ))}
      </div>
    </div>
  );
};

const AdhdT3_Wait = ({ onDone }) => {
  const [ready, setReady] = useState(false);
  const [premature, setPremature] = useState(false);
  useEffect(() => { const t = setTimeout(() => setReady(true), 2000); return () => clearTimeout(t); }, []);
  return (
    <div className="w-full max-w-2xl text-center" data-testid="adhd-t3">
      <p className="mb-6 text-lg">Wait for the bell, then tap the button.</p>
      <button
        onClick={() => { if (!ready) { setPremature(true); } else { playTone(660, 300); onDone(premature ? 0 : 1); } }}
        className="rounded-full mx-auto p-10"
        style={{ background: ready ? 'var(--teal-calm)' : '#94A3B8' }}
        data-testid="adhd-t3-btn"
      >
        <Bell size={80} color="#fff" />
      </button>
      <div className="mt-3 text-sm" style={{ color: 'var(--text-secondary)' }}>{ready ? 'Now!' : 'Waiting…'}</div>
    </div>
  );
};

const AdhdT4_Rhythm = ({ onDone }) => {
  const [beats, setBeats] = useState(0);
  const play = () => { [0, 300, 600].forEach(d => setTimeout(() => playTone(440, 150), d)); };
  useEffect(() => { const t = setTimeout(play, 400); return () => clearTimeout(t); }, []);
  return (
    <div className="w-full max-w-2xl text-center" data-testid="adhd-t4">
      <p className="mb-6 text-lg">Tap the pad 3 times to the beat.</p>
      <button onClick={play} className="mx-auto mb-4 rounded-full px-6 py-3" style={{ background: 'var(--card-white)', border: '1px solid var(--border-slate)' }}>Replay beat</button>
      <button onClick={() => { setBeats(b => b + 1); playTone(440, 100); if (beats + 1 >= 3) setTimeout(() => onDone(1), 400); }} className="rounded-full mx-auto p-10" style={{ background: 'var(--gold-warm)' }} data-testid="adhd-t4-pad">
        <Music size={80} color="#fff" />
      </button>
      <div className="mt-3 font-bold">{beats} / 3</div>
    </div>
  );
};

const AdhdT5_Directive = ({ onDone }) => {
  useEffect(() => { const t = setTimeout(() => speak('Tap the train.', { rate: 0.85 }), 800); return () => clearTimeout(t); }, []);
  return (
    <div className="grid grid-cols-2 gap-6 w-full max-w-2xl" data-testid="adhd-t5">
      <Tile onClick={() => onDone(0)} testid="adhd-t5-rocket" wide><Rocket size={70} style={{ color: 'var(--thiran-purple)' }} /></Tile>
      <Tile onClick={() => onDone(1)} testid="adhd-t5-train" wide><TrainFront size={70} style={{ color: 'var(--teal-calm)' }} /></Tile>
    </div>
  );
};

const AdhdT6_Tap = ({ onDone }) => {
  const [taps, setTaps] = useState(0);
  useEffect(() => { const t = setTimeout(() => onDone(taps >= 6 ? 1 : 0), 6000); return () => clearTimeout(t); }, [taps, onDone]);
  return (
    <div className="w-full max-w-2xl text-center" data-testid="adhd-t6">
      <p className="mb-6 text-lg">Tap as many times as you want.</p>
      <button onClick={() => { setTaps(t => t + 1); hapticPulse(5); }} className="rounded-full mx-auto p-10" style={{ background: 'var(--thiran-purple)' }} data-testid="adhd-t6-pad">
        <Circle size={80} color="#fff" fill="#fff" />
      </button>
      <div className="mt-3 font-bold text-2xl">{taps}</div>
    </div>
  );
};

const AdhdT7_Sliders = ({ onDone }) => {
  const [g, setG] = useState(50); const [s, setS] = useState(50); const [b, setB] = useState(50);
  const [moves, setMoves] = useState(0);
  useEffect(() => { const t = setTimeout(() => onDone(moves >= 3 ? 1 : 0), 12000); return () => clearTimeout(t); }, [moves, onDone]);
  const bump = (set, v) => { set(v); setMoves(m => m + 1); };
  return (
    <div className="w-full max-w-2xl" data-testid="adhd-t7">
      <div className="rounded-2xl mb-6 flex items-center justify-center" style={{ background: 'var(--card-white)', border: '1px solid var(--border-slate)', height: 200 }}>
        <div className="rounded-full" style={{ width: 40 + b/3, height: 40 + b/3, background: 'var(--thiran-purple)', transform: `translateY(${(50 - g) * 0.6}px) translateX(${(s - 50) * 1.4}px)`, transition: 'all 500ms ease' }} />
      </div>
      {[{ v: g, set: setG }, { v: s, set: setS }, { v: b, set: setB }].map((sl, i) => (
        <input key={i} type="range" min="0" max="100" value={sl.v} onChange={(e) => bump(sl.set, Number(e.target.value))} className="w-full mb-4 h-3" />
      ))}
      <button onClick={() => onDone(moves >= 3 ? 1 : 0)} className="w-full rounded-full py-4 font-bold text-white" style={{ background: 'var(--thiran-purple)' }}>Done exploring</button>
    </div>
  );
};

const AdhdT8_Hold = ({ onDone }) => {
  const [holding, setHolding] = useState(false);
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    if (!holding) return;
    const iv = setInterval(() => setProgress(p => {
      const next = p + 5;
      if (next >= 100) { clearInterval(iv); setTimeout(() => onDone(1), 300); }
      return next;
    }), 100);
    return () => clearInterval(iv);
  }, [holding, onDone]);
  return (
    <div className="w-full max-w-2xl text-center" data-testid="adhd-t8">
      <p className="mb-6 text-lg">Hold the button steady for 2 seconds.</p>
      <button
        onPointerDown={() => setHolding(true)}
        onPointerUp={() => { setHolding(false); setProgress(0); }}
        onPointerLeave={() => { setHolding(false); setProgress(0); }}
        className="rounded-full mx-auto p-10"
        style={{ background: holding ? 'var(--teal-calm)' : 'var(--thiran-purple)', transition: 'background 200ms ease' }}
        data-testid="adhd-t8-btn"
      >
        <Star size={80} color="#fff" fill="#fff" />
      </button>
      <div className="mt-4 h-3 max-w-xs mx-auto rounded-full" style={{ background: 'var(--border-slate)' }}>
        <div className="h-full rounded-full" style={{ background: 'var(--teal-calm)', width: `${progress}%`, transition: 'width 100ms linear' }} />
      </div>
    </div>
  );
};

// ================================================================
//  TEST SETS PER DISORDER
// ================================================================

// Channel + weight follow the research spec: V total max 0.50, A max 0.55, K max 0.55.
export const TEST_SETS = {
  autism: [
    { C: AutT0, prompt: 'Find the tile that looks different.',      ch: 'V', w: 0.20 },
    { C: AutT1, prompt: 'Use the guide to finish the puzzle.',      ch: 'V', w: 0.15 },
    { C: AutT2, prompt: 'Drag each shape into its outline.',        ch: 'V', w: 0.15 },
    { C: AutT3, prompt: 'Which picture makes that sound?',          ch: 'A', w: 0.15 },
    { C: AutT4, prompt: 'Burst all three balloons.',               ch: 'A', w: 0.20 },
    { C: AutT5, prompt: 'Press the apple three times.',             ch: 'A', w: 0.20 },
    { C: AutT6, prompt: 'Move the block into the box.',             ch: 'K', w: 0.15 },
    { C: AutT7, prompt: 'Drop every fruit into the basket.',       ch: 'K', w: 0.20 },
    { C: AutT8, prompt: 'Drag each shape into its outline.',        ch: 'K', w: 0.20 },
  ],
  idd: [
    { C: IddT0_ObjectMatch, prompt: 'Match the real thing to its picture.', ch: 'V', w: 0.20 },
    { C: IddT1_MemorySpan,  prompt: 'Tap the shapes in order.',              ch: 'V', w: 0.15 },
    { C: IddT2_Generalize,  prompt: 'Find the star with a new background.',  ch: 'V', w: 0.15 },
    { C: IddT3_Latency,     prompt: 'Take your time. Tap when ready.',       ch: 'A', w: 0.15 },
    { C: IddT4_Frustration, prompt: 'Tap the sun.',                          ch: 'A', w: 0.20 },
    { C: IddT5_CauseEffect, prompt: 'Press the button.',                     ch: 'A', w: 0.20 },
    { C: IddT6_BroadTarget, prompt: 'Pop the pink circles.',                 ch: 'K', w: 0.15 },
    { C: IddT7_Attention,   prompt: 'Tap the little tree.',                  ch: 'K', w: 0.20 },
    { C: IddT8_AudioVisual, prompt: 'Listen and choose.',                    ch: 'K', w: 0.20 },
  ],
  dyslexia: [
    { C: DysT0_Mirror,      prompt: 'Which arrow matches?',                  ch: 'V', w: 0.20 },
    { C: DysT1_Crowding,    prompt: 'Find the pink star.',                   ch: 'V', w: 0.15 },
    { C: DysT2_Pattern,     prompt: 'Which pair looks the same?',            ch: 'V', w: 0.15 },
    { C: DysT3_Phoneme,     prompt: 'Which letter makes this sound?',        ch: 'A', w: 0.20 },
    { C: DysT4_MinPair,     prompt: 'Same or different sound?',              ch: 'A', w: 0.20 },
    { C: DysT5_Echo,        prompt: 'Tap the letters in order.',             ch: 'A', w: 0.15 },
    { C: DysT6_StrokeTrace, prompt: 'Trace from pink to teal.',              ch: 'K', w: 0.15 },
    { C: DysT7_Haptic,      prompt: 'Feel the buzz. Tap the teal zone.',     ch: 'K', w: 0.20 },
    { C: DysT8_Snap,        prompt: 'Snap the piece into place.',            ch: 'K', w: 0.20 },
  ],
  adhd: [
    { C: AdhdT0_Chase,          prompt: 'Catch the rocket.',                 ch: 'V', w: 0.20 },
    { C: AdhdT1_StimulusChoice, prompt: 'Pick the one you like.',            ch: 'V', w: 0.15 },
    { C: AdhdT2_Flash,          prompt: 'Remember the order.',               ch: 'V', w: 0.15 },
    { C: AdhdT3_Wait,           prompt: 'Wait for the bell.',                ch: 'A', w: 0.20 },
    { C: AdhdT4_Rhythm,         prompt: 'Match the beat.',                   ch: 'A', w: 0.20 },
    { C: AdhdT5_Directive,      prompt: 'Follow the voice.',                 ch: 'A', w: 0.15 },
    { C: AdhdT6_Tap,            prompt: 'Tap the pad freely.',               ch: 'K', w: 0.15 },
    { C: AdhdT7_Sliders,        prompt: 'Move the bars.',                    ch: 'K', w: 0.20 },
    { C: AdhdT8_Hold,           prompt: 'Hold it steady.',                   ch: 'K', w: 0.20 },
  ],
};

export const getTestSet = (disorder) => TEST_SETS[disorder] || TEST_SETS.autism;
