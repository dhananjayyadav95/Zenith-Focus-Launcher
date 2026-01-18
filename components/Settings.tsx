import React from 'react';
import { Screen } from '../types';
import { ArrowLeft, Palette, Eye, EyeOff, Focus, Download, Upload, Trash2 } from 'lucide-react';
import { getSettings, saveSettings, exportData, importData, clearAllData } from '../services/storageService';

interface SettingsProps {
    onNavigate: (screen: Screen) => void;
}

const Settings: React.FC<SettingsProps> = ({ onNavigate }) => {
    const [settings, setSettings] = React.useState(getSettings());

    const updateSetting = <K extends keyof typeof settings>(key: K, value: typeof settings[K]) => {
        const updated = { ...settings, [key]: value };
        setSettings(updated);
        saveSettings({ [key]: value });

        // Apply grayscale immediately
        if (key === 'grayscaleMode') {
            document.documentElement.style.filter = value ? 'grayscale(100%)' : 'none';
        }
    };

    const handleExport = () => {
        const data = exportData();
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `zenith-backup-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const handleImport = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'application/json';
        input.onchange = (e) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    const content = event.target?.result as string;
                    if (importData(content)) {
                        setSettings(getSettings());
                        alert('Data imported successfully!');
                        window.location.reload();
                    } else {
                        alert('Failed to import data. Please check the file format.');
                    }
                };
                reader.readAsText(file);
            }
        };
        input.click();
    };

    const handleClearData = () => {
        if (confirm('Are you sure you want to clear all data? This cannot be undone.')) {
            clearAllData();
            setSettings(getSettings());
            alert('All data cleared.');
            window.location.reload();
        }
    };

    return (
        <div className="flex flex-col h-full px-8 pt-12 pb-20 animate-in fade-in duration-500">
            <div className="flex items-center gap-4 mb-12">
                <button onClick={() => onNavigate(Screen.HOME)} className="p-2 -ml-2 text-white/50 hover:text-white">
                    <ArrowLeft size={24} />
                </button>
                <h2 className="text-xl font-light">Settings</h2>
            </div>

            <div className="flex-1 overflow-y-auto no-scrollbar space-y-8">
                {/* Visual Settings */}
                <section>
                    <h3 className="text-xs uppercase tracking-widest text-white/30 mb-4 flex items-center gap-2">
                        <Palette size={14} /> Visual
                    </h3>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between py-3 border-b border-white/5">
                            <div>
                                <p className="font-light">Grayscale Mode</p>
                                <p className="text-xs text-white/30">Reduce visual appeal</p>
                            </div>
                            <button
                                onClick={() => updateSetting('grayscaleMode', !settings.grayscaleMode)}
                                className={`w-12 h-6 rounded-full transition-colors ${settings.grayscaleMode ? 'bg-white' : 'bg-white/10'
                                    }`}
                            >
                                <div className={`w-5 h-5 rounded-full bg-black transition-transform ${settings.grayscaleMode ? 'translate-x-6' : 'translate-x-0.5'
                                    }`} />
                            </button>
                        </div>

                        <div className="flex items-center justify-between py-3 border-b border-white/5">
                            <div>
                                <p className="font-light">Theme</p>
                                <p className="text-xs text-white/30">Background style</p>
                            </div>
                            <select
                                value={settings.theme}
                                onChange={(e) => updateSetting('theme', e.target.value as 'pure-black' | 'dark-gray')}
                                className="bg-zinc-900/50 border border-white/10 rounded-lg px-3 py-1.5 text-sm"
                            >
                                <option value="pure-black">Pure Black</option>
                                <option value="dark-gray">Dark Gray</option>
                            </select>
                        </div>
                    </div>
                </section>

                {/* Focus Settings */}
                <section>
                    <h3 className="text-xs uppercase tracking-widest text-white/30 mb-4 flex items-center gap-2">
                        <Focus size={14} /> Focus
                    </h3>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between py-3 border-b border-white/5">
                            <div>
                                <p className="font-light">Intentional Mode</p>
                                <p className="text-xs text-white/30">Hide distracting apps</p>
                            </div>
                            <button
                                onClick={() => updateSetting('intentionalMode', !settings.intentionalMode)}
                                className={`w-12 h-6 rounded-full transition-colors ${settings.intentionalMode ? 'bg-white' : 'bg-white/10'
                                    }`}
                            >
                                <div className={`w-5 h-5 rounded-full bg-black transition-transform ${settings.intentionalMode ? 'translate-x-6' : 'translate-x-0.5'
                                    }`} />
                            </button>
                        </div>

                        <div className="flex items-center justify-between py-3 border-b border-white/5">
                            <div>
                                <p className="font-light">Intention Prompt</p>
                                <p className="text-xs text-white/30">Ask before opening apps</p>
                            </div>
                            <button
                                onClick={() => updateSetting('showIntentionPrompt', !settings.showIntentionPrompt)}
                                className={`w-12 h-6 rounded-full transition-colors ${settings.showIntentionPrompt ? 'bg-white' : 'bg-white/10'
                                    }`}
                            >
                                <div className={`w-5 h-5 rounded-full bg-black transition-transform ${settings.showIntentionPrompt ? 'translate-x-6' : 'translate-x-0.5'
                                    }`} />
                            </button>
                        </div>

                        <div className="flex items-center justify-between py-3 border-b border-white/5">
                            <div>
                                <p className="font-light">Launch Delay</p>
                                <p className="text-xs text-white/30">Friction before opening</p>
                            </div>
                            <select
                                value={settings.launchDelay}
                                onChange={(e) => updateSetting('launchDelay', parseInt(e.target.value))}
                                className="bg-zinc-900/50 border border-white/10 rounded-lg px-3 py-1.5 text-sm"
                            >
                                <option value="3">3 seconds</option>
                                <option value="5">5 seconds</option>
                                <option value="10">10 seconds</option>
                                <option value="15">15 seconds</option>
                            </select>
                        </div>
                    </div>
                </section>

                {/* Data Management */}
                <section>
                    <h3 className="text-xs uppercase tracking-widest text-white/30 mb-4">Data</h3>

                    <div className="space-y-3">
                        <button
                            onClick={handleExport}
                            className="w-full flex items-center gap-3 py-3 px-4 bg-zinc-900/50 border border-white/10 rounded-2xl hover:border-white/20 transition-all"
                        >
                            <Download size={18} className="text-white/40" />
                            <span className="font-light">Export Data</span>
                        </button>

                        <button
                            onClick={handleImport}
                            className="w-full flex items-center gap-3 py-3 px-4 bg-zinc-900/50 border border-white/10 rounded-2xl hover:border-white/20 transition-all"
                        >
                            <Upload size={18} className="text-white/40" />
                            <span className="font-light">Import Data</span>
                        </button>

                        <button
                            onClick={handleClearData}
                            className="w-full flex items-center gap-3 py-3 px-4 bg-red-900/20 border border-red-500/20 rounded-2xl hover:border-red-500/40 transition-all"
                        >
                            <Trash2 size={18} className="text-red-400/60" />
                            <span className="font-light text-red-400/80">Clear All Data</span>
                        </button>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Settings;
