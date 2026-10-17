// Pirinilai Karpithal — Tier 1 Straight-stroke letters first.
// Tamil Tier 1: ட ப ம ய ர ற | English Tier 1: L T I H F E
//
// Fields:
//   glyph        — displayed letter
//   romanization — shown under glyph
//   sound        — TTS text when a NATIVE voice for the language is available
//   soundEn      — English-phonetic fallback used when no Tamil voice is installed
//                  (single-syllable spellings so TTS won't spell letters out)
//   word         — anchor word (concrete object)
//   wordEn       — English pronunciation hint of the word (for fallback)

export const TIER1_TAMIL = [
  { id: 't-ta',  glyph: 'ட', romanization: 'ṭa', sound: 'ட',  soundEn: 'tuh',  word: 'டப்பா',  wordMeaning: 'box',      wordEn: 'dabbaa' },
  { id: 't-pa',  glyph: 'ப', romanization: 'pa', sound: 'ப',  soundEn: 'puh',  word: 'பந்து',  wordMeaning: 'ball',     wordEn: 'panthu' },
  { id: 't-ma',  glyph: 'ம', romanization: 'ma', sound: 'ம',  soundEn: 'muh',  word: 'மலர்',   wordMeaning: 'flower',   wordEn: 'malar' },
  { id: 't-ya',  glyph: 'ய', romanization: 'ya', sound: 'ய',  soundEn: 'yuh',  word: 'யானை',  wordMeaning: 'elephant', wordEn: 'yaanai' },
  { id: 't-ra',  glyph: 'ர', romanization: 'ra', sound: 'ர',  soundEn: 'ruh',  word: 'ரயில்',  wordMeaning: 'train',    wordEn: 'rayil' },
  { id: 't-rra', glyph: 'ற', romanization: 'ṟa', sound: 'ற', soundEn: 'rruh', word: 'றெக்கை', wordMeaning: 'wing',     wordEn: 'rekkai' },
];

export const TIER1_ENGLISH = [
  { id: 'e-l', glyph: 'L', romanization: 'L', sound: 'L', soundEn: 'L', word: 'Lion',   wordMeaning: 'lion' },
  { id: 'e-t', glyph: 'T', romanization: 'T', sound: 'T', soundEn: 'T', word: 'Train',  wordMeaning: 'train' },
  { id: 'e-i', glyph: 'I', romanization: 'I', sound: 'I', soundEn: 'I', word: 'Ice',    wordMeaning: 'ice' },
  { id: 'e-h', glyph: 'H', romanization: 'H', sound: 'H', soundEn: 'H', word: 'Hat',    wordMeaning: 'hat' },
  { id: 'e-f', glyph: 'F', romanization: 'F', sound: 'F', soundEn: 'F', word: 'Flower', wordMeaning: 'flower' },
  { id: 'e-e', glyph: 'E', romanization: 'E', sound: 'E', soundEn: 'E', word: 'Egg',    wordMeaning: 'egg' },
];

export const getLetters = (lang) => (lang === 'ta' ? TIER1_TAMIL : TIER1_ENGLISH);
