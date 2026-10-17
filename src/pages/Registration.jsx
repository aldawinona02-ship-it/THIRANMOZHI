import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Shell, PrimaryButton, OptionCard } from '../components/Shell';
import { Brain, Sparkles, Heart, BookOpen } from 'lucide-react';

const DISORDERS = [
  { id: 'autism', label: 'Autism', icon: Sparkles, desc: 'Predictable, calm, one instruction at a time.' },
  { id: 'idd', label: 'IDD', icon: Heart, desc: 'Micro-steps, errorless learning, gentle repetition.' },
  { id: 'dyslexia', label: 'Dyslexia', icon: BookOpen, desc: 'Multi-sensory, phoneme-first, wide spacing.' },
  { id: 'adhd', label: 'ADHD', icon: Brain, desc: 'Short bursts, immediate rewards, engaging.' },
];

const Registration = () => {
  const nav = useNavigate();
  const { state, update } = useApp();
  const [name, setName] = useState(state.profile?.name || '');
  const [age, setAge] = useState(state.profile?.age || '');
  const [disorder, setDisorder] = useState(state.profile?.disorder || '');

  const canProceed = name.trim().length > 0 && Number(age) > 0 && disorder;

  const submit = () => {
    if (!canProceed) return;
    update({ profile: { name: name.trim(), age: Number(age), disorder } });
    nav('/language');
  };

  return (
    <Shell
      title="Let's get to know your child"
      subtitle="These details help us tailor every lesson. This form is for parents."
      showAvatar={false}
      testid="registration-page"
    >
      <div className="grid grid-cols-1 gap-6 max-w-2xl">
        <div>
          <label className="block text-sm font-bold mb-2 tracking-wide" style={{ color: 'var(--text-secondary)' }}>
            Child's Name
          </label>
          <input
            data-testid="input-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-2xl px-6 py-4 text-lg"
            style={{ background: 'var(--card-white)', border: '2px solid var(--border-slate)', color: 'var(--text-primary)' }}
            placeholder="e.g., Meera"
          />
        </div>
        <div>
          <label className="block text-sm font-bold mb-2 tracking-wide" style={{ color: 'var(--text-secondary)' }}>
            Age
          </label>
          <input
            data-testid="input-age"
            type="number"
            min="2"
            max="18"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            className="w-full rounded-2xl px-6 py-4 text-lg"
            style={{ background: 'var(--card-white)', border: '2px solid var(--border-slate)', color: 'var(--text-primary)' }}
            placeholder="e.g., 6"
          />
        </div>
        <div>
          <label className="block text-sm font-bold mb-3 tracking-wide" style={{ color: 'var(--text-secondary)' }}>
            Which best describes your child?
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {DISORDERS.map(d => {
              const Icon = d.icon;
              const selected = disorder === d.id;
              return (
                <OptionCard
                  key={d.id}
                  selected={selected}
                  onClick={() => setDisorder(d.id)}
                  testid={`disorder-${d.id}`}
                >
                  <div className="flex items-center gap-4">
                    <div className="rounded-2xl p-3" style={{ background: '#F5F3FF' }}>
                      <Icon size={28} style={{ color: 'var(--thiran-purple)' }} />
                    </div>
                    <div>
                      <div className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>{d.label}</div>
                      <div className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>{d.desc}</div>
                    </div>
                  </div>
                </OptionCard>
              );
            })}
          </div>
        </div>
      </div>

      <div className="flex justify-end mt-12">
        <PrimaryButton onClick={submit} disabled={!canProceed} testid="btn-next-registration">
          Next
        </PrimaryButton>
      </div>
    </Shell>
  );
};

export default Registration;
