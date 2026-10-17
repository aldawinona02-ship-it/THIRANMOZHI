import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Shell, PrimaryButton } from '../components/Shell';

const Language = () => {
  const nav = useNavigate();
  const { state, update } = useApp();
  const [choice, setChoice] = useState(state.language || null);

  const pick = (lang) => setChoice(lang);
  const next = () => {
    if (!choice) return;
    update({ language: choice });
    nav('/interest');
  };

  const Card = ({ id, label, sub, glyph, color, testid }) => {
    const active = choice === id;
    return (
      <button
        data-testid={testid}
        onClick={() => pick(id)}
        className="w-full rounded-3xl p-8 md:p-12 flex flex-col items-center justify-center gap-4 transition-opacity duration-300"
        style={{
          background: color,
          border: active ? '4px solid var(--text-primary)' : '4px solid transparent',
          transform: active ? 'scale(1.02)' : 'scale(1)',
          minHeight: 320,
          color: '#FFFFFF',
        }}
      >
        <div className="display font-extrabold" style={{ fontSize: 140, lineHeight: 1 }}>{glyph}</div>
        <div className="text-2xl md:text-3xl font-bold tracking-wide">{label}</div>
        <div className="text-base opacity-90">{sub}</div>
      </button>
    );
  };

  return (
    <Shell
      title="Which language would your child like to learn?"
      subtitle="You can change this anytime from settings."
      showAvatar={false}
      testid="language-page"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card id="ta" label="தமிழ்" sub="Tamil" glyph="அ" color="var(--mozhi-pink)" testid="lang-tamil" />
        <Card id="en" label="English" sub="English" glyph="A" color="var(--thiran-purple)" testid="lang-english" />
      </div>
      <div className="flex justify-end mt-12">
        <PrimaryButton onClick={next} disabled={!choice} testid="btn-next-language">Next</PrimaryButton>
      </div>
    </Shell>
  );
};

export default Language;
