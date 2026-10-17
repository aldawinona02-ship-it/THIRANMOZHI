import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Shell, PrimaryButton } from '../components/Shell';
import { getLetters } from '../lib/letters';
import { getTheme } from '../lib/themes';
import { Lock, Check, Settings, GraduationCap } from 'lucide-react';

const Dashboard = () => {
  const nav = useNavigate();
  const { state } = useApp();
  const letters = getLetters(state.language);
  const completed = state.progress.completedLetters;
  const theme = state.theme ? getTheme(state.theme) : null;
  const name = state.profile?.name || 'friend';

  const nextIdx = letters.findIndex(l => !completed.includes(l.id));
  const currentLetter = nextIdx === -1 ? letters[letters.length - 1] : letters[nextIdx];
  const allDone = nextIdx === -1;
  const progressPct = Math.round((completed.length / letters.length) * 100);

  const startLesson = () => {
    if (allDone) nav(`/practice`);
    else nav(`/lesson/${currentLetter.id}`);
  };

  return (
    <Shell
      title={`Welcome, ${name}`}
      subtitle={`Day ${state.progress.day} • Tier 1: Straight-stroke letters`}
      testid="dashboard-page"
    >
      <div className="flex justify-end mb-6">
        <Link to="/settings" className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold" style={{ background: 'var(--card-white)', border: '1px solid var(--border-slate)', color: 'var(--text-secondary)' }} data-testid="btn-settings">
          <Settings size={16} /> Parent Settings
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
        <div className="lg:col-span-2 rounded-3xl p-8" style={{ background: theme?.bg || '#F5F3FF', border: `2px solid ${theme?.ring || '#DDD6FE'}` }}>
          <div className="flex items-center gap-6">
            <div className="rounded-3xl p-8" style={{ background: '#fff', border: '1px solid var(--border-slate)' }}>
              <div className="display font-extrabold" style={{ fontSize: 100, lineHeight: 1, color: 'var(--thiran-purple)' }}>
                {currentLetter.glyph}
              </div>
            </div>
            <div>
              <div className="text-sm font-bold uppercase tracking-widest" style={{ color: 'var(--text-secondary)' }}>Today's letter</div>
              <div className="mt-1 display text-3xl font-extrabold">{currentLetter.romanization}</div>
              <div className="mt-2" style={{ color: 'var(--text-secondary)' }}>Guide: <b>{theme?.guideName}</b></div>
              <div className="mt-6">
                <PrimaryButton onClick={startLesson} testid="btn-start-lesson">
                  {allDone ? "Let's Practice" : 'Start Lesson'}
                </PrimaryButton>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-3xl p-8 flex flex-col items-center justify-center" style={{ background: 'var(--card-white)', border: '1px solid var(--border-slate)' }}>
          <div className="relative" style={{ width: 140, height: 140 }}>
            <svg width="140" height="140" viewBox="0 0 140 140">
              <circle cx="70" cy="70" r="60" fill="none" stroke="var(--border-slate)" strokeWidth="12" />
              <circle cx="70" cy="70" r="60" fill="none" stroke="var(--teal-calm)" strokeWidth="12"
                strokeDasharray={`${(progressPct / 100) * 377} 377`} strokeLinecap="round" transform="rotate(-90 70 70)" style={{ transition: 'stroke-dasharray 1s ease' }} />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="display text-3xl font-extrabold" style={{ color: 'var(--teal-calm)' }} data-testid="progress-pct">{progressPct}%</div>
              <div className="text-xs font-bold uppercase" style={{ color: 'var(--text-secondary)' }}>Progress</div>
            </div>
          </div>
          <div className="mt-4 text-sm" style={{ color: 'var(--text-secondary)' }}>{completed.length} of {letters.length} letters</div>
        </div>
      </div>

      <h2 className="display text-2xl font-extrabold mb-4">Today's 6 Letters</h2>
      <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
        {letters.map((l, idx) => {
          const done = completed.includes(l.id);
          const isNext = !done && idx === nextIdx;
          return (
            <button key={l.id} onClick={() => nav(`/lesson/${l.id}`)} className="rounded-3xl aspect-square flex flex-col items-center justify-center gap-2" style={{ background: 'var(--card-white)', border: isNext ? '3px solid var(--thiran-purple)' : '1px solid var(--border-slate)', opacity: done ? 0.7 : 1 }} data-testid={`letter-tile-${l.id}`}>
              <div className="display font-extrabold" style={{ fontSize: 48, color: 'var(--text-primary)' }}>{l.glyph}</div>
              <div className="text-xs font-bold" style={{ color: 'var(--text-secondary)' }}>{l.romanization}</div>
              {done ? <Check size={16} style={{ color: 'var(--teal-calm)' }} /> : (isNext ? <GraduationCap size={16} style={{ color: 'var(--thiran-purple)' }} /> : <Lock size={16} style={{ color: 'var(--text-muted)' }} />)}
            </button>
          );
        })}
      </div>

      {allDone && (
        <div className="mt-10 rounded-3xl p-8 text-center" style={{ background: '#ECFDF5', border: '2px solid #A7F3D0' }}>
          <div className="display text-2xl font-extrabold">All 6 letters done for today!</div>
          <p className="mt-2" style={{ color: 'var(--text-secondary)' }}>Let's practice together — no test, just play.</p>
          <div className="mt-6 flex justify-center">
            <PrimaryButton onClick={() => nav('/practice')} variant="teal" testid="btn-start-practice">Let's Practice</PrimaryButton>
          </div>
        </div>
      )}
    </Shell>
  );
};

export default Dashboard;
