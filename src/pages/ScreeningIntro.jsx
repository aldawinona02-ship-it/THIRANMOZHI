import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Shell, PrimaryButton } from '../components/Shell';
import { ThemeAvatar } from '../components/ThemeAvatar';
import { getTheme } from '../lib/themes';
import { speak } from '../lib/speech';

const ScreeningIntro = () => {
  const nav = useNavigate();
  const { state } = useApp();
  const theme = state.theme ? getTheme(state.theme) : null;
  const disorder = state.profile?.disorder || 'autism';
  const name = state.profile?.name || 'friend';

  useEffect(() => {
    const t = setTimeout(() => {
      speak(`Hello ${name}. Let us play some fun activities together.`);
    }, 500);
    return () => clearTimeout(t);
  }, [name]);

  const start = () => {
    const d = disorder;
    if (['autism', 'idd', 'dyslexia', 'adhd'].includes(d)) nav(`/screening/${d}`);
    else nav('/screening/autism');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 fade-in" data-testid="screening-intro">
      <div className="max-w-2xl w-full text-center">
        {theme && <div className="flex justify-center mb-8"><ThemeAvatar themeId={theme.id} size={140} /></div>}
        <h1 className="display text-3xl md:text-5xl font-extrabold" style={{ color: 'var(--text-primary)' }}>
          Let's understand how {name} learns best.
        </h1>
        <p className="mt-6 text-lg" style={{ color: 'var(--text-secondary)' }}>
          These are gentle activities — not a test. There is no right or wrong.
        </p>
        <p className="mt-2 text-lg" style={{ color: 'var(--text-secondary)' }}>
          {theme?.guideName} will guide you through each one.
        </p>
        <div className="mt-12">
          <PrimaryButton onClick={start} testid="btn-start-screening">Start</PrimaryButton>
        </div>
      </div>
    </div>
  );
};

export default ScreeningIntro;
