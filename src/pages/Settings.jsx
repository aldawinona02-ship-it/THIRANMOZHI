import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Shell, PrimaryButton, OptionCard } from '../components/Shell';
import { Lock, RefreshCw } from 'lucide-react';

const Settings = () => {
  const nav = useNavigate();
  const { state, resetAll } = useApp();
  const [unlocked, setUnlocked] = useState(false);
  const [answer, setAnswer] = useState('');
  const [error, setError] = useState('');

  const check = () => {
    if (answer.trim() === '12') { setUnlocked(true); setError(''); }
    else { setError('Try again. Hint: 3 × 4'); }
  };

  if (!unlocked) {
    return (
      <Shell title="Parent Lock" subtitle="Please solve this so only grown-ups get through." showAvatar={false} testid="settings-lock">
        <div className="max-w-md">
          <div className="rounded-3xl p-8" style={{ background: 'var(--card-white)', border: '1px solid var(--border-slate)' }}>
            <div className="flex items-center gap-3 mb-4">
              <Lock size={24} style={{ color: 'var(--mozhi-pink)' }} />
              <div className="text-xl font-bold">What is 3 × 4?</div>
            </div>
            <input value={answer} onChange={(e) => setAnswer(e.target.value)} className="w-full rounded-2xl px-6 py-4 text-lg mb-3" style={{ background: '#fff', border: '2px solid var(--border-slate)' }} data-testid="lock-input" />
            {error && <p className="text-sm mb-3" style={{ color: 'var(--mozhi-pink)' }}>{error}</p>}
            <PrimaryButton onClick={check} testid="lock-submit">Unlock</PrimaryButton>
          </div>
          <button onClick={() => nav('/dashboard')} className="mt-6 text-sm font-bold" style={{ color: 'var(--text-muted)' }} data-testid="lock-back">← Back to Dashboard</button>
        </div>
      </Shell>
    );
  }

  return (
    <Shell title="Parent Settings" subtitle="Profile & progress overview" showAvatar={false} testid="settings-page">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl">
        <OptionCard testid="settings-profile">
          <div className="text-sm font-bold uppercase tracking-widest" style={{ color: 'var(--text-secondary)' }}>Profile</div>
          <div className="mt-2 text-lg"><b>{state.profile?.name}</b> • Age {state.profile?.age}</div>
          <div className="mt-1 capitalize" style={{ color: 'var(--text-secondary)' }}>{state.profile?.disorder}</div>
          <div className="mt-1" style={{ color: 'var(--text-secondary)' }}>Language: {state.language === 'ta' ? 'Tamil' : 'English'}</div>
          <div className="mt-1" style={{ color: 'var(--text-secondary)' }}>Theme: {state.theme}</div>
          <div className="mt-1" style={{ color: 'var(--text-secondary)' }}>Sensory: {state.sensory}</div>
        </OptionCard>

        <OptionCard testid="settings-vak">
          <div className="text-sm font-bold uppercase tracking-widest" style={{ color: 'var(--text-secondary)' }}>Learning Profile</div>
          {state.vak ? (
            <>
              <div className="mt-2">Visual: <b>{Math.round(state.vak.V * 100)}%</b></div>
              <div>Auditory: <b>{Math.round(state.vak.A * 100)}%</b></div>
              <div>Kinesthetic: <b>{Math.round(state.vak.K * 100)}%</b></div>
              <div className="mt-2" style={{ color: 'var(--text-secondary)' }}>Primary: <b>{state.vak.primary}</b></div>
            </>
          ) : <p style={{ color: 'var(--text-secondary)' }}>Not yet assessed.</p>}
        </OptionCard>

        <OptionCard testid="settings-progress">
          <div className="text-sm font-bold uppercase tracking-widest" style={{ color: 'var(--text-secondary)' }}>Progress</div>
          <div className="mt-2">Day: <b>{state.progress.day}</b></div>
          <div>Letters completed: <b>{state.progress.completedLetters.length}</b></div>
        </OptionCard>

        <div className="rounded-3xl p-6" style={{ background: '#FEF2F2', border: '1px solid #FECACA' }} data-testid="settings-reset">
          <div className="text-sm font-bold uppercase tracking-widest" style={{ color: 'var(--text-secondary)' }}>Danger Zone</div>
          <div className="mt-2 text-lg font-bold">Reset all progress</div>
          <p className="mt-1 text-sm" style={{ color: 'var(--text-secondary)' }}>This clears the profile and returns to the splash screen.</p>
          <button onClick={() => { resetAll(); nav('/'); }} className="mt-4 inline-flex items-center gap-2 rounded-full px-5 py-3 font-bold" style={{ background: 'var(--mozhi-pink)', color: '#fff' }} data-testid="settings-reset-btn">
            <RefreshCw size={16} /> Reset Everything
          </button>
        </div>
      </div>

      <div className="mt-10">
        <button onClick={() => nav('/dashboard')} className="rounded-full px-6 py-3 font-bold" style={{ background: 'var(--card-white)', border: '1px solid var(--border-slate)' }} data-testid="settings-back">← Back to Dashboard</button>
      </div>
    </Shell>
  );
};

export default Settings;
