import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

const KEY = 'thiranmozhi_state_v1';

const defaultState = {
  profile: null,           // { name, age, disorder }
  language: null,          // 'ta' | 'en'
  theme: null,             // key from THEMES
  sensory: null,           // 'low' | 'medium' | 'high' | 'none'
  vak: null,               // { V, A, K, primary, secondary }
  progress: {
    day: 1,
    completedLetters: [],  // letter ids
    currentIndex: 0,
  },
};

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  const [state, setState] = useState(defaultState);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setState({ ...defaultState, ...JSON.parse(raw) });
    } catch (e) {}
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {}
  }, [state, loaded]);

  const update = useCallback((patch) => {
    setState(prev => ({ ...prev, ...(typeof patch === 'function' ? patch(prev) : patch) }));
  }, []);

  const resetAll = useCallback(() => {
    localStorage.removeItem(KEY);
    setState(defaultState);
  }, []);

  const markLetterComplete = useCallback((letterId) => {
    setState(prev => {
      if (prev.progress.completedLetters.includes(letterId)) return prev;
      return {
        ...prev,
        progress: {
          ...prev.progress,
          completedLetters: [...prev.progress.completedLetters, letterId],
        },
      };
    });
  }, []);

  return (
    <AppContext.Provider value={{ state, update, resetAll, markLetterComplete, loaded }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};
