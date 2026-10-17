import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Shell } from '../components/Shell';
import { speak, stopSpeech } from '../lib/speech';
import { getTestSet } from '../lib/screeningTests.jsx';

const Screening = () => {
  const { disorder } = useParams();
  const nav = useNavigate();
  const { state, update } = useApp();
  const activeDisorder = disorder || state.profile?.disorder || 'autism';
  const TESTS = getTestSet(activeDisorder);

  const order = useMemo(() => {
    const arr = TESTS.map((_, i) => i);
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeDisorder]);

  const [step, setStep] = useState(0);
  const [scores, setScores] = useState({ V: 0, A: 0, K: 0 });
  const testIdx = order[step];
  const t = TESTS[testIdx];
  const Current = t.C;

  useEffect(() => {
    stopSpeech();
    const timer = setTimeout(() => speak(t.prompt, { rate: 0.75 }), 500);
    return () => clearTimeout(timer);
  }, [testIdx, t.prompt]);

  const handleDone = (success) => {
    const nextScores = { ...scores, [t.ch]: scores[t.ch] + (success ? t.w : 0) };
    setScores(nextScores);

    if (step + 1 >= TESTS.length) {
      // Normalize per research max weights.
      const V = Math.min(1, nextScores.V / 0.50);
      const A = Math.min(1, nextScores.A / 0.55);
      const K = Math.min(1, nextScores.K / 0.55);
      const arr = [{ k: 'V', v: V }, { k: 'A', v: A }, { k: 'K', v: K }].sort((a, b) => b.v - a.v);
      update({ vak: { V, A, K, primary: arr[0].k, secondary: arr[1].k } });
      nav('/vak-result');
    } else {
      setStep(s => s + 1);
    }
  };

  const progressPct = (step / TESTS.length) * 100;

  return (
    <Shell
      title={`Activity ${step + 1} of ${TESTS.length}`}
      subtitle={t.prompt}
      speakText={t.prompt}
      testid={`screening-step-${step}`}
    >
      <div className="w-full h-3 rounded-full mb-10" style={{ background: 'var(--border-slate)' }}>
        <div className="h-full rounded-full transition-all duration-500" style={{ background: 'var(--teal-calm)', width: `${progressPct}%` }} />
      </div>
      <div className="flex justify-center">
        <Current onDone={handleDone} />
      </div>
      <div className="flex justify-end mt-10">
        <button onClick={() => handleDone(0)} className="text-sm font-bold px-6 py-3 rounded-full" style={{ color: 'var(--text-muted)', background: 'transparent' }} data-testid="btn-skip-test">Skip this one</button>
      </div>
    </Shell>
  );
};

export default Screening;
