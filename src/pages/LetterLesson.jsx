import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Shell, PrimaryButton } from '../components/Shell';
import { getLetters } from '../lib/letters';
import { getTheme } from '../lib/themes';
import { ThemeAvatar } from '../components/ThemeAvatar';
import { speak, stopSpeech, hapticPulse, speakLetterSound } from '../lib/speech';
import { fetchEncouragement } from '../lib/encourage';
import { TraceCanvas } from '../components/TraceCanvas';
import { Volume2, ArrowRight, Check, Sparkles } from 'lucide-react';

const STAGES = ['intro', 'pronounce', 'trace', 'recognize', 'celebrate'];

const LetterLesson = () => {
  const { letterId } = useParams();
  const nav = useNavigate();
  const { state, markLetterComplete } = useApp();
  const letters = getLetters(state.language);
  const letter = letters.find(l => l.id === letterId) || letters[0];
  const theme = state.theme ? getTheme(state.theme) : null;
  const [stage, setStage] = useState('intro');
  const [mouthOpen, setMouthOpen] = useState(false);
  const [traceDone, setTraceDone] = useState(false);
  const [celebrateMessage, setCelebrateMessage] = useState(null);
  const [recognizePicked, setRecognizePicked] = useState(null);

  const advance = () => {
    stopSpeech();
    const idx = STAGES.indexOf(stage);
    if (idx < STAGES.length - 1) setStage(STAGES[idx + 1]);
  };

  const finish = () => {
    markLetterComplete(letter.id);
    nav('/dashboard');
  };

  useEffect(() => {
    return () => stopSpeech();
  }, []);

  useEffect(() => {
    if (stage !== 'celebrate') return;
    let cancelled = false;
    fetchEncouragement({
      childName: state.profile?.name,
      letter: letter.glyph,
      disorder: state.profile?.disorder,
      vakPrimary: state.vak?.primary,
      context: 'lesson_complete',
      theme: state.theme,
      language: state.language,
    }).then((msg) => { if (!cancelled) setCelebrateMessage(msg); });
    return () => { cancelled = true; };
  }, [stage, letter.glyph, state.profile, state.vak, state.theme, state.language]);

  const speakLetter = () => {
    setMouthOpen(true);
    // Speak twice with a small gap for clearer / louder perception on all devices.
    speakLetterSound(letter, state.language);
    setTimeout(() => speakLetterSound(letter, state.language), 1400);
    setTimeout(() => setMouthOpen(false), 2600);
  };

  // Recognize options: correct glyph + 3 distractor shapes (lines/curves, no other letters)
  const distractors = ['◯', '△', '/'];
  const recogOptions = [letter.glyph, ...distractors].sort(() => Math.random() - 0.5);
  const handleRecognize = (opt) => {
    setRecognizePicked(opt);
    if (opt === letter.glyph) {
      hapticPulse(30);
      setTimeout(() => advance(), 800);
    } else {
      // errorless — nudge back
      setTimeout(() => setRecognizePicked(null), 900);
    }
  };

  return (
    <Shell showAvatar={false} testid={`lesson-${letter.id}`}>
      <div className="flex items-center gap-4 mb-8">
        {theme && <ThemeAvatar themeId={theme.id} size={64} />}
        <div>
          <div className="text-sm font-bold uppercase tracking-widest" style={{ color: 'var(--text-secondary)' }}>Letter</div>
          <div className="display text-2xl font-extrabold">{letter.romanization}</div>
        </div>
        <div className="ml-auto flex gap-2">
          {STAGES.map((s, i) => (
            <div key={s} className="w-8 h-2 rounded-full" style={{ background: STAGES.indexOf(stage) >= i ? 'var(--teal-calm)' : 'var(--border-slate)' }} />
          ))}
        </div>
      </div>

      {stage === 'intro' && (
        <div className="rounded-3xl p-12 text-center fade-in" style={{ background: theme?.bg || '#F5F3FF', border: `2px solid ${theme?.ring || '#DDD6FE'}` }} data-testid="stage-intro">
          <div className="display font-extrabold mx-auto" style={{ fontSize: 240, lineHeight: 1, color: 'var(--thiran-purple)' }}>{letter.glyph}</div>
          <div className="mt-8 flex justify-center gap-3">
            <button onClick={() => { speakLetterSound(letter, state.language); setTimeout(() => speakLetterSound(letter, state.language), 1400); }} className="rounded-full px-5 py-3 inline-flex items-center gap-2 font-bold" style={{ background: 'var(--card-white)', border: '1px solid var(--border-slate)', color: 'var(--teal-calm)' }} data-testid="intro-hear">
              <Volume2 size={18} /> Hear it
            </button>
            <PrimaryButton onClick={advance} testid="intro-next">Next <ArrowRight size={20} className="inline ml-1" /></PrimaryButton>
          </div>
        </div>
      )}

      {stage === 'pronounce' && (
        <div className="rounded-3xl p-12 text-center fade-in" style={{ background: 'var(--card-white)', border: '1px solid var(--border-slate)' }} data-testid="stage-pronounce">
          <div className="text-lg mb-6" style={{ color: 'var(--text-secondary)' }}>Watch the mouth and say it with me.</div>
          <div className="mx-auto rounded-full flex items-center justify-center mb-6 transition-all duration-500" style={{ width: 160, height: 160, background: '#FCE7F3', border: '4px solid #FBCFE8' }}>
            <div className="rounded-full" style={{ width: mouthOpen ? 80 : 30, height: mouthOpen ? 60 : 15, background: '#831843', transition: 'all 500ms ease' }} />
          </div>
          <div className="display font-extrabold" style={{ fontSize: 100, color: 'var(--thiran-purple)' }}>{letter.glyph}</div>
          <div className="mt-4 text-3xl font-bold" style={{ color: 'var(--mozhi-pink)', letterSpacing: '0.15em' }}>{letter.glyph}</div>
          <div className="mt-8 flex justify-center gap-3">
            <button onClick={speakLetter} className="rounded-full px-5 py-3 inline-flex items-center gap-2 font-bold" style={{ background: 'var(--teal-calm)', color: '#fff' }} data-testid="pronounce-hear">
              <Volume2 size={18} /> Say it
            </button>
            <PrimaryButton onClick={advance} testid="pronounce-next">Next</PrimaryButton>
          </div>
        </div>
      )}

      {stage === 'trace' && (
        <div className="rounded-3xl p-8 fade-in" style={{ background: 'var(--card-white)', border: '1px solid var(--border-slate)' }} data-testid="stage-trace">
          <div className="text-lg text-center mb-4" style={{ color: 'var(--text-secondary)' }}>Colour inside the letter with your finger. {theme?.guideName} will follow you.</div>
          <div className="flex justify-center">
            <TraceCanvas
              glyph={letter.glyph}
              themeId={theme?.id || 'space'}
              size={340}
              onComplete={() => { setTraceDone(true); hapticPulse(40); }}
            />
          </div>
          <div className="mt-6 flex justify-center">
            <PrimaryButton onClick={advance} disabled={!traceDone} testid="trace-next">Next</PrimaryButton>
          </div>
        </div>
      )}

      {stage === 'recognize' && (
        <div className="rounded-3xl p-8 fade-in" style={{ background: 'var(--card-white)', border: '1px solid var(--border-slate)' }} data-testid="stage-recognize">
          <div className="text-center text-lg mb-6" style={{ color: 'var(--text-secondary)' }}>Which one is <b>{letter.romanization}</b>?</div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {recogOptions.map((opt, i) => {
              const correct = opt === letter.glyph;
              const picked = recognizePicked === opt;
              return (
                <button key={i} onClick={() => handleRecognize(opt)} className="rounded-3xl aspect-square flex items-center justify-center" style={{
                  background: picked ? (correct ? 'var(--teal-calm)' : 'var(--card-white)') : 'var(--card-white)',
                  border: picked ? (correct ? '3px solid var(--teal-calm)' : '3px solid var(--mozhi-pink)') : '2px solid var(--border-slate)',
                  transition: 'border 300ms ease',
                }} data-testid={`recognize-opt-${i}`}>
                  <span className="display font-extrabold" style={{ fontSize: 72, color: picked && correct ? '#fff' : 'var(--text-primary)' }}>{opt}</span>
                </button>
              );
            })}
          </div>
          {recognizePicked && recognizePicked !== letter.glyph && (
            <p className="text-center mt-4 text-sm" style={{ color: 'var(--text-secondary)' }}>Try again — the answer is safe with us.</p>
          )}
        </div>
      )}

      {stage === 'celebrate' && (
        <div className="rounded-3xl p-12 text-center fade-in" style={{ background: '#ECFDF5', border: '2px solid #A7F3D0' }} data-testid="stage-celebrate">
          <Sparkles size={80} style={{ color: 'var(--teal-calm)' }} className="mx-auto" />
          <div className="display text-3xl font-extrabold mt-4">Wonderful!</div>
          <p className="mt-3 text-lg" style={{ color: 'var(--text-secondary)' }}>You learned <b style={{ color: 'var(--thiran-purple)' }}>{letter.glyph}</b> ({letter.romanization}).</p>
          {celebrateMessage && (
            <p className="mt-4 text-lg fade-in" style={{ color: 'var(--text-primary)' }} data-testid="celebrate-llm-msg">
              {celebrateMessage}
            </p>
          )}
          <div className="mt-8">
            <PrimaryButton onClick={finish} variant="teal" testid="celebrate-continue">
              <Check size={20} className="inline mr-2" /> Continue
            </PrimaryButton>
          </div>
        </div>
      )}
    </Shell>
  );
};

export default LetterLesson;
