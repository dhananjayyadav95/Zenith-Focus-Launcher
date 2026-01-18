
import React, { useState, useEffect, useRef } from 'react';
import { Screen, FocusSession } from '../types';
import { ArrowLeft, Play, Pause, X, CheckCircle, AlertTriangle, Edit3, BellOff, Bell } from 'lucide-react';
import { saveFocusSession } from '../services/storageService';

interface FocusTimerProps {
  onNavigate: (screen: Screen) => void;
}

const DURATIONS = [5, 15, 25, 45, 60, 90];

const FocusTimer: React.FC<FocusTimerProps> = ({ onNavigate }) => {
  const [isActive, setIsActive] = useState(false);
  const [selectedMinutes, setSelectedMinutes] = useState(25);
  const [isCustom, setIsCustom] = useState(false);
  const [customInput, setCustomInput] = useState('25');
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isFinished, setIsFinished] = useState(false);
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default');
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [sessionStartTime, setSessionStartTime] = useState<number | null>(null);

  // Exit confirmation state
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [exitStep, setExitStep] = useState(0);
  const [exitInput, setExitInput] = useState('');
  const exitInputRef = useRef<HTMLInputElement>(null);
  const customInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if ('Notification' in window) {
      setNotificationPermission(Notification.permission);
    }
  }, []);

  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);
    }
  };

  const sendFinishNotification = () => {
    if (notificationPermission === 'granted') {
      new Notification("Focus Session Complete", {
        body: "Well done. You've reclaimed your time.",
        icon: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='black'/%3E%3Ccircle cx='50' cy='50' r='10' fill='white'/%3E%3C/svg%3E"
      });
    }
  };

  // Update timeLeft when selectedMinutes changes, but only if not active
  useEffect(() => {
    if (!isActive) {
      if (isCustom) {
        const mins = parseInt(customInput) || 0;
        setTimeLeft(mins * 60);
      } else {
        setTimeLeft(selectedMinutes * 60);
      }
    }
  }, [selectedMinutes, customInput, isCustom, isActive]);

  useEffect(() => {
    let interval: any = null;
    if (isActive && timeLeft > 0 && !showExitConfirm) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      // Session completed
      setIsActive(false);
      setIsFinished(true);
      sendFinishNotification();

      // Save completed session
      if (currentSessionId && sessionStartTime) {
        const session: FocusSession = {
          id: currentSessionId,
          duration: isCustom ? parseInt(customInput) : selectedMinutes,
          startTime: sessionStartTime,
          endTime: Date.now(),
          completed: true,
        };
        saveFocusSession(session);
      }

      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, showExitConfirm, currentSessionId, sessionStartTime, isCustom, customInput, selectedMinutes]);

  useEffect(() => {
    if (showExitConfirm && exitInputRef.current) {
      exitInputRef.current.focus();
    }
  }, [showExitConfirm, exitStep]);

  useEffect(() => {
    if (isCustom && customInputRef.current) {
      customInputRef.current.focus();
    }
  }, [isCustom]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleReset = () => {
    // Save incomplete session if exists
    if (currentSessionId && sessionStartTime && isActive) {
      const session: FocusSession = {
        id: currentSessionId,
        duration: isCustom ? parseInt(customInput) : selectedMinutes,
        startTime: sessionStartTime,
        endTime: Date.now(),
        completed: false,
      };
      saveFocusSession(session);
    }

    setIsActive(false);
    const mins = isCustom ? (parseInt(customInput) || 25) : selectedMinutes;
    setTimeLeft(mins * 60);
    setIsFinished(false);
    setShowExitConfirm(false);
    setExitStep(0);
    setExitInput('');
    setCurrentSessionId(null);
    setSessionStartTime(null);
  };

  const initiateExit = () => {
    if (isActive) {
      setShowExitConfirm(true);
      setExitStep(1);
    } else {
      onNavigate(Screen.HOME);
    }
  };

  const handleExitStepSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (exitInput.toLowerCase().trim() === 'yes') {
      if (exitStep < 3) {
        setExitStep(prev => prev + 1);
        setExitInput('');
      } else {
        handleReset();
        onNavigate(Screen.HOME);
      }
    } else {
      setExitStep(1);
      setExitInput('');
    }
  };

  const cancelExit = () => {
    setShowExitConfirm(false);
    setExitStep(0);
    setExitInput('');
  };

  const handleCustomInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^0-9]/g, '');
    if (val.length <= 3) {
      setCustomInput(val);
    }
  };

  if (isFinished) {
    return (
      <div className="flex flex-col items-center justify-center h-full px-8 text-center animate-in zoom-in duration-500">
        <CheckCircle size={80} className="text-white mb-6" strokeWidth={1} />
        <h2 className="text-4xl font-light mb-4">Focus Complete</h2>
        <p className="text-white/50 mb-12">Session ended. Re-center yourself.</p>
        <button
          onClick={handleReset}
          className="px-8 py-3 border border-white/20 hover:bg-white hover:text-black transition-all rounded-full uppercase tracking-widest text-sm"
        >
          Again
        </button>
        <button
          onClick={() => onNavigate(Screen.HOME)}
          className="mt-6 text-white/30 hover:text-white underline underline-offset-8"
        >
          Exit to Home
        </button>
      </div>
    );
  }

  return (
    <div className={`relative flex flex-col h-full px-8 pt-12 transition-all duration-700 ${isActive ? 'bg-zinc-900' : 'bg-black'}`}>
      {/* Exit Confirmation Overlay */}
      {showExitConfirm && (
        <div className="absolute inset-0 z-50 bg-black/95 flex flex-col items-center justify-center px-8 text-center animate-in fade-in duration-300">
          <AlertTriangle size={48} className="text-white/40 mb-6" strokeWidth={1} />
          <h2 className="text-2xl font-light mb-2">Break focus?</h2>
          <p className="text-white/40 text-sm mb-8">Type <span className="text-white font-mono">'yes'</span> to confirm ({exitStep}/3)</p>

          <form onSubmit={handleExitStepSubmit} className="w-full max-w-xs">
            <input
              ref={exitInputRef}
              type="text"
              value={exitInput}
              onChange={(e) => setExitInput(e.target.value)}
              placeholder="type here..."
              className="w-full bg-transparent border-b border-white/20 text-center text-2xl py-2 focus:border-white focus:ring-0 transition-colors uppercase font-light"
              autoFocus
            />
          </form>

          <button
            onClick={cancelExit}
            className="mt-12 text-white/30 hover:text-white uppercase tracking-widest text-xs"
          >
            Go back to work
          </button>
        </div>
      )}

      <div className="flex items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          {!isActive && (
            <button onClick={initiateExit} className="p-2 -ml-2 text-white/50 hover:text-white">
              <ArrowLeft size={24} />
            </button>
          )}
          <h2 className="text-lg uppercase tracking-widest text-white/30 font-light">
            {isActive ? 'Deep Focus Session' : (isCustom ? 'Custom Time' : 'Set Duration')}
          </h2>
        </div>
        {!isActive && (
          <button
            onClick={requestNotificationPermission}
            className={`p-2 transition-colors ${notificationPermission === 'granted' ? 'text-white/40' : 'text-blue-400'}`}
            title={notificationPermission === 'granted' ? 'Alerts enabled' : 'Enable alerts'}
          >
            {notificationPermission === 'granted' ? <Bell size={18} /> : <BellOff size={18} />}
          </button>
        )}
      </div>

      <div className="flex-1 flex flex-col items-center justify-center">
        {!isActive && (
          <div className="flex flex-col items-center gap-6 mb-12 animate-in fade-in slide-in-from-top-4 duration-500">
            {!isCustom ? (
              <div className="flex flex-wrap justify-center gap-6">
                {DURATIONS.map((min) => (
                  <button
                    key={min}
                    onClick={() => setSelectedMinutes(min)}
                    className={`text-xl font-light transition-all duration-300 ${selectedMinutes === min ? 'text-white border-b border-white/40' : 'text-white/20 hover:text-white/40'
                      }`}
                  >
                    {min}
                  </button>
                ))}
                <button
                  onClick={() => setIsCustom(true)}
                  className="flex items-center gap-1 text-xl font-light text-white/20 hover:text-white/40 transition-all duration-300"
                >
                  <Edit3 size={16} /> Custom
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <input
                  ref={customInputRef}
                  type="text"
                  value={customInput}
                  onChange={handleCustomInputChange}
                  placeholder="Mins"
                  className="w-24 bg-transparent border-b border-white text-center text-4xl font-light focus:ring-0 focus:outline-none placeholder:text-white/10"
                />
                <button
                  onClick={() => setIsCustom(false)}
                  className="text-white/30 hover:text-white uppercase text-[10px] tracking-widest mt-4"
                >
                  Presets
                </button>
              </div>
            )}
          </div>
        )}

        <div className={`text-8xl mono font-extralight tracking-tighter mb-12 transition-all duration-500 ${isActive ? 'scale-125' : 'scale-100'}`}>
          {formatTime(timeLeft)}
        </div>

        <div className="flex items-center gap-12">
          {!isActive ? (
            <button
              onClick={() => {
                if (parseInt(customInput) > 0 || !isCustom) {
                  // Create new session
                  const sessionId = `session_${Date.now()}`;
                  setCurrentSessionId(sessionId);
                  setSessionStartTime(Date.now());

                  if (notificationPermission === 'default') {
                    requestNotificationPermission().then(() => setIsActive(true));
                  } else {
                    setIsActive(true);
                  }
                }
              }}
              className="w-20 h-20 rounded-full border border-white/20 flex items-center justify-center hover:bg-white hover:text-black transition-all"
            >
              <Play size={32} fill="currentColor" />
            </button>
          ) : (
            <>
              <button
                onClick={() => setIsActive(false)}
                className="w-16 h-16 rounded-full border border-white/10 flex items-center justify-center hover:border-white transition-all"
              >
                <Pause size={24} fill="currentColor" />
              </button>
              <button
                onClick={initiateExit}
                className="w-16 h-16 rounded-full border border-white/10 flex items-center justify-center hover:border-white transition-all"
              >
                <X size={24} />
              </button>
            </>
          )}
        </div>
      </div>

      {!isActive && (
        <div className="pb-20 text-center text-white/30 text-sm">
          Focus is a practice, not a destination.
        </div>
      )}
    </div>
  );
};

export default FocusTimer;
