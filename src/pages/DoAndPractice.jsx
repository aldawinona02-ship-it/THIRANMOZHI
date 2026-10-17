import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Shell, PrimaryButton } from '../components/Shell';
import { getLetters } from '../lib/letters';
import { getTheme } from '../lib/themes';
import { speakLetterSound } from '../lib/speech';
import { Sparkles, Volume2 } from 'lucide-react';

const shuffle = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const DoAndPractice = () => {
  const nav = useNavigate();
  const { state } = useApp();
  const letters = getLetters(state.language);
  const theme = state.theme ? getTheme(state.theme) : null;
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState(null);
  const [done, setDone] = useState(false);

  const target = letters[idx];
  const options = useMemo(() => {
    if (!target) return [];
    const others = letters.filter(l => l.id !== target.id).slice(0, 3);
    return shuffle([target, ...others]);
  }, [idx, letters]);

  useEffect(() => {
    if (!target) return;
    const t = setTimeout(() => speakLetterSound(target, state.language), 500);
    return () => clearTimeout(t);
  }, [idx, target, state.language]);

  const pick = (opt) => {
    setPicked(opt);
    if (opt.id === target.id) {
      setTimeout(() => {
        setPicked(null);
        if (idx + 1 >= letters.length) setDone(true);
        else setIdx(i => i + 1);
      }, 900);
    } else {
      // errorless — gentle nudge back
      setTimeout(() => setPicked(null), 900);
    }
  };

  if (done) {
    return (
      <Shell showAvatar={false} testid="practice-done">
        <div className="rounded-3xl p-12 text-center max-w-2xl mx-auto" style={{ background: '#ECFDF5', border: '2px solid #A7F3D0' }}>
          <Sparkles size={80} style={{ color: 'var(--teal-calm)' }} className="mx-auto" />
          <div className="display text-3xl font-extrabold mt-4">Beautiful work!</div>
          <p className="mt-3 text-lg" style={{ color: 'var(--text-secondary)' }}>You played with all 6 letters today. {theme?.guideName} is proud of you.</p>
          <div className="mt-8"><PrimaryButton onClick={() => nav('/dashboard')} variant="teal" testid="practice-back">Back Home</PrimaryButton></div>
        </div>
      </Shell>
    );
  }

  return (
    <Shell
      title="Let's play together!"
      subtitle={`Round ${idx + 1} of ${letters.length}`}
      testid="practice-page"
    >
      <div className="max-w-3xl mx-auto text-center">
        <button onClick={() => speakLetterSound(target, state.language)} className="mx-auto mb-8 rounded-full px-6 py-4 inline-flex items-center gap-3 font-bold" style={{ background: 'var(--teal-calm)', color: '#fff' }} data-testid="practice-hear">
          <Volume2 size={22} /> Where is <span className="display text-2xl">{target.glyph}</span> ?
        </button>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {options.map((o, i) => {
            const p = picked === o;
            const correct = o.id === target.id;
            return (
              <button key={o.id} onClick={() => pick(o)} className="rounded-3xl aspect-square flex items-center justify-center" style={{
                background: p ? (correct ? 'var(--teal-calm)' : 'var(--card-white)') : 'var(--card-white)',
                border: p ? (correct ? '3px solid var(--teal-calm)' : '3px solid var(--mozhi-pink)') : '2px solid var(--border-slate)',
              }} data-testid={`practice-opt-${i}`}>
                <span className="display font-extrabold" style={{ fontSize: 80, color: p && correct ? '#fff' : 'var(--text-primary)' }}>{o.glyph}</span>
              </button>
            );
          })}
        </div>
        <div className="mt-8 h-3 rounded-full" style={{ background: 'var(--border-slate)' }}>
          <div className="h-full rounded-full" style={{ background: 'var(--teal-calm)', width: `${(idx / letters.length) * 100}%`, transition: 'width 500ms ease' }} />
        </div>
      </div>
    </Shell>
  );
};

export default DoAndPractice;
