import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import '@/App.css';
import { AppProvider, useApp } from './context/AppContext';
import Splash from './pages/Splash';
import Registration from './pages/Registration';
import Language from './pages/Language';
import Interest from './pages/Interest';
import Sensory from './pages/Sensory';
import ScreeningIntro from './pages/ScreeningIntro';
import Screening from './pages/Screening';
import VakResult from './pages/VakResult';
import Dashboard from './pages/Dashboard';
import LetterLesson from './pages/LetterLesson';
import DoAndPractice from './pages/DoAndPractice';
import Settings from './pages/Settings';

const RequireProfile = ({ children }) => {
  const { state, loaded } = useApp();
  if (!loaded) return null;
  if (!state.profile) return <Navigate to="/register" replace />;
  return children;
};

const RequireVak = ({ children }) => {
  const { state, loaded } = useApp();
  if (!loaded) return null;
  if (!state.vak) return <Navigate to="/screening-intro" replace />;
  return children;
};

function App() {
  return (
    <div className="App">
      <AppProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Splash />} />
            <Route path="/register" element={<Registration />} />
            <Route path="/language" element={<RequireProfile><Language /></RequireProfile>} />
            <Route path="/interest" element={<RequireProfile><Interest /></RequireProfile>} />
            <Route path="/sensory" element={<RequireProfile><Sensory /></RequireProfile>} />
            <Route path="/screening-intro" element={<RequireProfile><ScreeningIntro /></RequireProfile>} />
            <Route path="/screening/:disorder" element={<RequireProfile><Screening /></RequireProfile>} />
            <Route path="/vak-result" element={<RequireProfile><VakResult /></RequireProfile>} />
            <Route path="/dashboard" element={<RequireVak><Dashboard /></RequireVak>} />
            <Route path="/lesson/:letterId" element={<RequireVak><LetterLesson /></RequireVak>} />
            <Route path="/practice" element={<RequireVak><DoAndPractice /></RequireVak>} />
            <Route path="/settings" element={<RequireProfile><Settings /></RequireProfile>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AppProvider>
    </div>
  );
}

export default App;
