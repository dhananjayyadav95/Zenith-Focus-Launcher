
import React, { useState, useEffect } from 'react';
import { Screen } from '../types';
import { getDailyMantra } from '../services/focusService';
import { getSettings } from '../services/storageService';
import { Settings as SettingsIcon } from 'lucide-react';

interface HomeProps {
  onNavigate: (screen: Screen) => void;
}

const Home: React.FC<HomeProps> = ({ onNavigate }) => {
  const [time, setTime] = useState(new Date());
  const [mantra, setMantra] = useState<string>("Stay intentional.");

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    setMantra(getDailyMantra());

    // Apply grayscale mode if enabled
    const settings = getSettings();
    if (settings.grayscaleMode) {
      document.documentElement.style.filter = 'grayscale(100%)';
    }

    return () => clearInterval(timer);
  }, []);

  const timeString = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
  const dateString = time.toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' });

  const handlePhone = () => {
    window.location.href = 'tel:';
  };

  return (
    <div className="flex flex-col h-full px-8 pt-20 pb-12 animate-in fade-in duration-700">
      {/* Settings Icon */}
      <button
        onClick={() => onNavigate(Screen.SETTINGS)}
        className="absolute top-16 right-8 p-2 text-white/30 hover:text-white transition-colors"
      >
        <SettingsIcon size={20} />
      </button>

      <div className="mb-12">
        <h1 className="text-7xl font-light tracking-tighter mono mb-2">{timeString}</h1>
        <p className="text-gray-400 text-lg uppercase tracking-widest font-light">{dateString}</p>
      </div>

      <div className="flex-1 flex flex-col justify-center">
        <div className="space-y-5">
          <button
            onClick={handlePhone}
            className="block text-3xl font-light text-white/70 hover:text-white transition-colors duration-300"
          >
            Phone
          </button>
          <button
            onClick={() => onNavigate(Screen.CAMERA)}
            className="block text-3xl font-light text-white/70 hover:text-white transition-colors duration-300"
          >
            Camera
          </button>
          <div className="h-4"></div>
          <button
            onClick={() => onNavigate(Screen.APP_DRAWER)}
            className="block text-3xl font-light text-white/70 hover:text-white transition-colors duration-300"
          >
            All Apps
          </button>
          <button
            onClick={() => onNavigate(Screen.FOCUS_MODE)}
            className="block text-3xl font-light text-white/70 hover:text-white transition-colors duration-300"
          >
            Focus Timer
          </button>
          <button
            onClick={() => onNavigate(Screen.STATS)}
            className="block text-3xl font-light text-white/70 hover:text-white transition-colors duration-300"
          >
            Statistics
          </button>
        </div>
      </div>

      <div className="mt-auto pt-8 border-t border-white/10">
        <p className="text-gray-500 italic font-light leading-relaxed text-sm">
          {mantra}
        </p>
      </div>
    </div>
  );
};

export default Home;
