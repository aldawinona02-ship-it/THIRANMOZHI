// Fetches a warm, LLM-generated encouragement from the backend.
// Falls back gracefully to a static message on any error.
const BACKEND_URL = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_BACKEND_URL) || (typeof process !== 'undefined' && process.env && process.env.REACT_APP_BACKEND_URL) || '';
const API = BACKEND_URL ? `${BACKEND_URL}/api` : '/api';

const FALLBACK = {
  lesson_complete: "You did such a beautiful job.",
  vak_result: "You are such a bright learner.",
  practice_done: "You played wonderfully today.",
  default: "You are doing amazing.",
};

export const fetchEncouragement = async ({ childName, letter, disorder, vakPrimary, context, theme, language }) => {
  try {
    const res = await fetch(`${API}/encourage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        childName: childName || 'friend',
        letter: letter || null,
        disorder: disorder || null,
        vakPrimary: vakPrimary || null,
        context: context || 'default',
        theme: theme || null,
        language: language || 'en',
      }),
    });
    if (!res.ok) throw new Error('bad status');
    const data = await res.json();
    return data.message || FALLBACK[context] || FALLBACK.default;
  } catch (e) {
    return FALLBACK[context] || FALLBACK.default;
  }
};
