import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const Splash = () => {
  const nav = useNavigate();
  const { state, loaded } = useApp();

  useEffect(() => {
    if (!loaded) return;
    const t = setTimeout(() => {
      // If user has completed onboarding, jump to dashboard
      if (state.profile && state.language && state.theme && state.sensory && state.vak) {
        nav('/dashboard');
      } else {
        nav('/register');
      }
    }, 4000);
    return () => clearTimeout(t);
  }, [loaded, state, nav]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center fade-in" style={{ background: '#FFFFFF' }} data-testid="splash-screen">
      <h1 className="display text-6xl md:text-8xl font-extrabold" style={{ letterSpacing: '0.06em' }}>
        <span style={{ color: 'var(--thiran-purple)' }} data-testid="brand-thiran">THIRAN</span>
        <span style={{ color: 'var(--mozhi-pink)' }} data-testid="brand-mozhi">MOZHI</span>
      </h1>
      <p className="mt-8 text-base md:text-xl" style={{ color: 'var(--text-secondary)', letterSpacing: '0.04em' }}>
        Learning that understands every child.
      </p>
      <div className="mt-16 flex items-center gap-2" aria-label="loading">
        <span className="w-3 h-3 rounded-full" style={{ background: 'var(--thiran-purple)' }} />
        <span className="w-3 h-3 rounded-full" style={{ background: 'var(--mozhi-pink)' }} />
        <span className="w-3 h-3 rounded-full" style={{ background: 'var(--teal-calm)' }} />
      </div>
    </div>
  );
};

export default Splash;
