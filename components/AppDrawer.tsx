import React, { useState, useMemo } from 'react';
import { Screen, AppCategory } from '../types';
import { MOCK_APPS } from '../constants';
import { ArrowLeft, Search, Eye, EyeOff } from 'lucide-react';
import { getSettings, getAppCategories, saveAppCategory, logAppLaunch } from '../services/storageService';
import IntentionPrompt from './IntentionPrompt';

interface AppDrawerProps {
  onNavigate: (screen: Screen) => void;
}

const AppDrawer: React.FC<AppDrawerProps> = ({ onNavigate }) => {
  const [search, setSearch] = useState('');
  const [showIntentionPrompt, setShowIntentionPrompt] = useState(false);
  const [selectedApp, setSelectedApp] = useState<{ id: string; name: string } | null>(null);

  const settings = getSettings();
  const appCategories = getAppCategories();

  const appsWithCategories = useMemo(() => {
    return MOCK_APPS.map(app => ({
      ...app,
      userCategory: (appCategories[app.id] as AppCategory) || 'Productive'
    }));
  }, [appCategories]);

  const filteredApps = useMemo(() => {
    let apps = appsWithCategories.filter(app =>
      app.name.toLowerCase().includes(search.toLowerCase())
    );

    // Filter by intentional mode
    if (settings.intentionalMode) {
      apps = apps.filter(app => app.userCategory === 'Essential');
    }

    return apps.sort((a, b) => a.name.localeCompare(b.name));
  }, [search, appsWithCategories, settings.intentionalMode]);

  const handleAppClick = (app: typeof MOCK_APPS[0]) => {
    const userCategory = appCategories[app.id] as AppCategory || 'Productive';

    // Show intention prompt for distracting apps if enabled
    if (settings.showIntentionPrompt && userCategory === 'Distracting') {
      setSelectedApp({ id: app.id, name: app.name });
      setShowIntentionPrompt(true);
    } else {
      launchApp(app.id, app.name);
    }
  };

  const launchApp = (appId: string, appName: string, intention?: string) => {
    logAppLaunch(appId, appName, intention);
    alert(`Launching ${appName}...${intention ? `\nIntention: ${intention}` : ''}`);
    setShowIntentionPrompt(false);
    setSelectedApp(null);
  };

  const handleCategoryChange = (appId: string, category: AppCategory) => {
    saveAppCategory(appId, category);
    // Force re-render by updating state
    window.location.reload();
  };

  const getCategoryColor = (category?: AppCategory) => {
    switch (category) {
      case 'Essential':
        return 'text-green-400/60';
      case 'Productive':
        return 'text-blue-400/60';
      case 'Distracting':
        return 'text-red-400/60';
      default:
        return 'text-white/20';
    }
  };

  return (
    <>
      {showIntentionPrompt && selectedApp && (
        <IntentionPrompt
          appName={selectedApp.name}
          delay={settings.launchDelay}
          onConfirm={(intention) => launchApp(selectedApp.id, selectedApp.name, intention)}
          onCancel={() => {
            setShowIntentionPrompt(false);
            setSelectedApp(null);
          }}
        />
      )}

      <div className="flex flex-col h-full px-8 pt-12 animate-in slide-in-from-bottom duration-500">
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => onNavigate(Screen.HOME)} className="p-2 -ml-2 text-white/50 hover:text-white">
            <ArrowLeft size={24} />
          </button>
          <div className="relative flex-1">
            <Search className="absolute left-0 top-1/2 -translate-y-1/2 text-white/30" size={18} />
            <input
              autoFocus
              type="text"
              placeholder="Search apps..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-transparent border-none focus:ring-0 text-xl pl-8 py-2 font-light placeholder:text-white/20"
            />
          </div>
          {settings.intentionalMode && (
            <div className="flex items-center gap-1 text-xs text-green-400/60 uppercase tracking-widest">
              <Eye size={14} /> Intentional
            </div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar pb-12">
          <div className="space-y-4">
            {filteredApps.map((app) => (
              <div
                key={app.id}
                className="group"
              >
                <div
                  className="flex justify-between items-center py-2 cursor-pointer hover:translate-x-2 transition-transform duration-200"
                  onClick={() => handleAppClick(app)}
                >
                  <span className="text-2xl font-light text-white/60 group-hover:text-white">{app.name}</span>
                  <div className="flex items-center gap-3">
                    <select
                      value={app.userCategory}
                      onChange={(e) => {
                        e.stopPropagation();
                        handleCategoryChange(app.id, e.target.value as AppCategory);
                      }}
                      className={`text-xs uppercase tracking-widest bg-transparent border-none focus:ring-0 cursor-pointer ${getCategoryColor(app.userCategory)}`}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <option value="Essential">Essential</option>
                      <option value="Productive">Productive</option>
                      <option value="Distracting">Distracting</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}
            {filteredApps.length === 0 && (
              <p className="text-white/30 italic">
                {settings.intentionalMode
                  ? 'No essential apps. Mark apps as Essential in the dropdown.'
                  : 'No apps found'}
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default AppDrawer;
