
import React, { useState } from 'react';
import { Screen } from './types';
import Home from './components/Home';
import AppDrawer from './components/AppDrawer';
import FocusTimer from './components/FocusTimer';
import Stats from './components/Stats';
import Camera from './components/Camera';

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>(Screen.HOME);

  const renderScreen = () => {
    switch (currentScreen) {
      case Screen.HOME:
        return <Home onNavigate={setCurrentScreen} />;
      case Screen.APP_DRAWER:
        return <AppDrawer onNavigate={setCurrentScreen} />;
      case Screen.FOCUS_MODE:
        return <FocusTimer onNavigate={setCurrentScreen} />;
      case Screen.STATS:
        return <Stats onNavigate={setCurrentScreen} />;
      case Screen.CAMERA:
        return <Camera onNavigate={setCurrentScreen} />;
      default:
        return <Home onNavigate={setCurrentScreen} />;
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-zinc-950">
      {/* Container optimized for Mobile Viewport */}
      <div className="relative w-full h-full max-w-md bg-black shadow-2xl overflow-hidden md:h-[850px] md:max-h-[90vh] md:rounded-[3rem] md:border-[12px] md:border-zinc-900">
        
        {/* Notch / Status Bar Area */}
        <div className="h-10 px-8 flex justify-between items-center text-[10px] text-white/30 font-light tracking-tighter pt-safe">
          <span>ZENITH</span>
          <div className="flex gap-2">
            <span>5G</span>
            <span>99%</span>
          </div>
        </div>

        {/* Content Area */}
        <div className="h-[calc(100%-40px)] overflow-hidden">
          {renderScreen()}
        </div>

        {/* Home Indicator (Mock) */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-white/10 rounded-full"></div>
      </div>
    </div>
  );
};

export default App;
