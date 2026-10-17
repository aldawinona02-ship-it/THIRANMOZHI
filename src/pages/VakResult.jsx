import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Shell, PrimaryButton } from '../components/Shell';
import { Eye, Ear, Hand } from 'lucide-react';
import { speak } from '../lib/speech';
import { fetchEncouragement } from '../lib/encourage';

const LABELS = { V: 'Visual', A: 'Auditory', K: 'Kinesthetic' };
const ICONS = { V: Eye, A: Ear, K: Hand };
const DESCRIPTIONS = {
  V: 'learns brilliantly through pictures, colors, and shapes.',
  A: 'learns brilliantly through sounds, songs, and voices.',
  K: 'learns brilliantly through touch, movement, and doing.',
};

const VakResult = () => {
  const nav = useNavigate();
  const { state } = useApp();
  const vak = state.vak;
  const name = state.profile?.name || 'Your child';
  const [llmMessage, setLlmMessage] = useState(null);

  useEffect(() => {
    if (!vak) return;
    setTimeout(() => speak(`Wonderful work, ${name}. Let's start learning together.`, { rate: 0.78, volume: 1 }), 700);
    let cancelled = false;
    fetchEncouragement({
      childName: name,
      disorder: state.profile?.disorder,
      vakPrimary: vak.primary,
      context: 'vak_result',
      theme: state.theme,
      language: state.language,
    }).then((msg) => { if (!cancelled) setLlmMessage(msg); });
    return () => { cancelled = true; };
  }, [vak, name, state.profile, state.theme, state.language]);

  if (!vak) {
    return (
      <Shell title="No profile yet" showAvatar={false} testid="vak-empty">
        <PrimaryButton onClick={() => nav('/screening-intro')} testid="btn-restart">Start Screening</PrimaryButton>
      </Shell>
    );
  }

  const Primary = ICONS[vak.primary];

  return (
    <Shell showAvatar={false} testid="vak-result">
      <div className="max-w-3xl mx-auto text-center">
        <div className="inline-flex items-center justify-center rounded-full mb-8 tm-avatar-bob" style={{ width: 140, height: 140, background: '#F5F3FF', border: '4px solid #DDD6FE' }}>
          <span className="tm-avatar-primary" style={{ display: 'inline-flex' }}>
            <Primary size={70} style={{ color: 'var(--thiran-purple)' }} strokeWidth={2} />
          </span>
        </div>
        <h1 className="display text-3xl md:text-4xl font-extrabold" style={{ color: 'var(--text-primary)' }}>
          Wonderful work, {name}!
        </h1>
        <p className="mt-6 text-lg" style={{ color: 'var(--text-secondary)' }}>
          We are ready to start learning together.
        </p>
        {llmMessage && (
          <p className="mt-4 text-lg fade-in" data-testid="vak-llm-msg" style={{ color: 'var(--text-primary)' }}>
            {llmMessage}
          </p>
        )}

        <div className="mt-12">
          <PrimaryButton onClick={() => nav('/dashboard')} testid="btn-go-dashboard">Start Learning</PrimaryButton>
        </div>
      </div>
    </Shell>
  );
};

export default VakResult;
