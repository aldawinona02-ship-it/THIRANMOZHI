// Calm speech utility — Web Speech API. Slow, deliberate delivery per design guidelines.
let currentUtterance = null;

// Very slow rates (< 0.6) make many TTS engines spell short strings letter-by-letter
// (e.g. "pa" -> "P... A..."). Floor the rate to keep single-syllable letter sounds
// pronounced as a single sound.
const safeRate = (r) => Math.max(0.7, r ?? 0.75);

export const speak = (text, opts = {}) => {
  if (typeof window === 'undefined' || !window.speechSynthesis || !text) return;
  try {
    window.speechSynthesis.cancel();
    // Small delay avoids a Chrome race where cancel() drops the immediate next
    // utterance, especially for very short strings.
    setTimeout(() => {
      try {
        const u = new SpeechSynthesisUtterance(String(text));
        u.rate = safeRate(opts.rate);
        u.pitch = opts.pitch ?? 0.95;
        u.volume = opts.volume ?? 1;
        if (opts.lang) u.lang = opts.lang;
        const voices = window.speechSynthesis.getVoices();
        if (opts.lang === 'ta-IN') {
          const tv = voices.find(v => v.lang && v.lang.startsWith('ta'));
          if (tv) u.voice = tv;
        }
        currentUtterance = u;
        window.speechSynthesis.speak(u);
      } catch (e) { /* silent */ }
    }, 60);
  } catch (e) {
    // silent — speech is enhancement, not blocker
  }
};

// Smart letter-sound speaker.
// - If native voice for the active language is available, speak the native
//   grapheme (e.g. "ம").
// - Otherwise fall back to an English-phonetic single-syllable spelling
//   (e.g. "muh") so the child still hears the sound instead of silence.
// - Always emitted at maximum browser volume (u.volume = 1). Device system
//   volume must be up on the child's end for maximum loudness.
export const speakLetterSound = (letter, appLang = 'en') => {
  if (!letter) return;
  const wantsTamil = appLang === 'ta';
  if (wantsTamil && hasTamilVoice()) {
    speak(letter.sound || letter.glyph, { rate: 0.85, lang: 'ta-IN', volume: 1 });
    return;
  }
  if (wantsTamil) {
    speak(letter.soundEn || letter.romanization || letter.glyph, { rate: 0.85, lang: 'en-US', volume: 1 });
    return;
  }
  speak(letter.sound || letter.glyph, { rate: 0.85, lang: 'en-US', volume: 1 });
};

// Repeat a sound N times with a gap — used to reinforce a single Tamil phoneme
// naturally without triggering letter-spelling.
export const speakRepeat = (text, times = 2, gapMs = 700, opts = {}) => {
  if (!text) return;
  speak(text, opts);
  for (let i = 1; i < times; i++) {
    setTimeout(() => speak(text, opts), i * (gapMs + 900));
  }
};

// Return true if a Tamil voice is installed on this device.
export const hasTamilVoice = () => {
  if (typeof window === 'undefined' || !window.speechSynthesis) return false;
  const voices = window.speechSynthesis.getVoices();
  return voices.some(v => v.lang && v.lang.startsWith('ta'));
};

export const stopSpeech = () => {
  if (typeof window !== 'undefined' && window.speechSynthesis) {
    window.speechSynthesis.cancel();
    currentUtterance = null;
  }
};

// Play a pure tone using Web Audio API (for auditory tests)
export const playTone = (frequency = 440, duration = 1500) => {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.value = frequency;
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.15, ctx.currentTime + 0.05);
    gain.gain.linearRampToValueAtTime(0, ctx.currentTime + duration / 1000);
    osc.connect(gain).connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration / 1000 + 0.05);
  } catch (e) { /* silent */ }
};

export const playSequence = async (freqs = [220, 880, 880], gap = 550) => {
  for (const f of freqs) {
    playTone(f, 400);
    await new Promise(r => setTimeout(r, gap));
  }
};

export const hapticPulse = (pattern = 30) => {
  if (typeof navigator !== 'undefined' && navigator.vibrate) {
    try { navigator.vibrate(pattern); } catch (e) {}
  }
};
