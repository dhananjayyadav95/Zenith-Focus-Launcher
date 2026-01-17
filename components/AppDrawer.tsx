
import React, { useState, useMemo } from 'react';
import { Screen } from '../types';
import { MOCK_APPS } from '../constants';
import { ArrowLeft, Search } from 'lucide-react';

interface AppDrawerProps {
  onNavigate: (screen: Screen) => void;
}

const AppDrawer: React.FC<AppDrawerProps> = ({ onNavigate }) => {
  const [search, setSearch] = useState('');

  const filteredApps = useMemo(() => {
    return MOCK_APPS.filter(app => 
      app.name.toLowerCase().includes(search.toLowerCase())
    ).sort((a, b) => a.name.localeCompare(b.name));
  }, [search]);

  return (
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
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar pb-12">
        <div className="space-y-4">
          {filteredApps.map((app) => (
            <div 
              key={app.id} 
              className="group flex justify-between items-center py-2 cursor-pointer hover:translate-x-2 transition-transform duration-200"
              onClick={() => alert(`Launching ${app.name}...`)}
            >
              <span className="text-2xl font-light text-white/60 group-hover:text-white">{app.name}</span>
              <span className="text-xs text-white/20 uppercase tracking-widest">{app.category}</span>
            </div>
          ))}
          {filteredApps.length === 0 && (
            <p className="text-white/30 italic">No apps found</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AppDrawer;
