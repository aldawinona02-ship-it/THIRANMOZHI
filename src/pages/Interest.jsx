import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Shell, PrimaryButton } from '../components/Shell';
import { THEME_LIST } from '../lib/themes';

const Interest = () => {
  const nav = useNavigate();
  const { state, update } = useApp();
  const [choice, setChoice] = useState(state.theme || null);

  const next = () => {
    if (!choice) return;
    update({ theme: choice });
    nav('/sensory');
  };

  const isTa = state.language === 'ta';

  return (
    <Shell
      title="What interests your child the most?"
      subtitle="We'll bring this world into every lesson."
      showAvatar={false}
      testid="interest-page"
    >
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {THEME_LIST.map(t => {
          const Icon = t.primaryIcon;
          const active = choice === t.id;
          return (
            <button
              key={t.id}
              data-testid={`theme-${t.id}`}
              onClick={() => setChoice(t.id)}
              className="rounded-3xl p-6 flex flex-col items-center gap-3 transition-opacity duration-300"
              style={{
                background: t.bg,
                border: active ? '3px solid var(--thiran-purple)' : `3px solid ${t.ring}`,
                minHeight: 170,
                boxShadow: active ? '0 0 0 4px rgba(139,92,246,0.15)' : 'none',
              }}
            >
              <Icon size={54} style={{ color: 'var(--thiran-purple)' }} strokeWidth={2} />
              <div className="text-lg font-bold tracking-wide" style={{ color: 'var(--text-primary)' }}>
                {isTa ? t.labelTa : t.label}
              </div>
            </button>
          );
        })}
      </div>
      <div className="flex justify-end mt-12">
        <PrimaryButton onClick={next} disabled={!choice} testid="btn-next-interest">Next</PrimaryButton>
      </div>
    </Shell>
  );
};

export default Interest;
