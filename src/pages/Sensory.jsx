import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Shell, PrimaryButton, OptionCard } from '../components/Shell';

const OPTIONS = [
  { id: 'low', label: 'Low sensitivity', desc: 'Comfortable with normal sounds, lights, and touch.' },
  { id: 'medium', label: 'Medium sensitivity', desc: 'Occasionally reacts to loud sounds or bright screens.' },
  { id: 'high', label: 'High sensitivity', desc: 'Easily overwhelmed — needs the calmest possible environment.' },
  { id: 'none', label: 'No sensory response', desc: 'Rarely reacts to sensory input — needs extra multi-sensory prompts.' },
];

const Sensory = () => {
  const nav = useNavigate();
  const { state, update } = useApp();
  const [choice, setChoice] = useState(state.sensory || null);

  const next = () => {
    if (!choice) return;
    update({ sensory: choice });
    nav('/screening-intro');
  };

  return (
    <Shell
      title="How does your child respond to sound, light, and touch?"
      subtitle="This helps us adjust volume, brightness, and haptic feedback."
      showAvatar={false}
      testid="sensory-page"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-4xl">
        {OPTIONS.map(o => (
          <OptionCard
            key={o.id}
            selected={choice === o.id}
            onClick={() => setChoice(o.id)}
            testid={`sensory-${o.id}`}
          >
            <div className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>{o.label}</div>
            <div className="mt-2 text-base" style={{ color: 'var(--text-secondary)' }}>{o.desc}</div>
          </OptionCard>
        ))}
      </div>
      <div className="flex justify-end mt-12">
        <PrimaryButton onClick={next} disabled={!choice} testid="btn-next-sensory">Next</PrimaryButton>
      </div>
    </Shell>
  );
};

export default Sensory;
