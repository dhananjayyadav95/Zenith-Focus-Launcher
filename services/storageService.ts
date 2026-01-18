import { UserSettings, AppLaunchLog, FocusSession, AppItem } from '../types';

const STORAGE_KEYS = {
    SETTINGS: 'zenith_settings',
    APP_LAUNCHES: 'zenith_app_launches',
    FOCUS_SESSIONS: 'zenith_focus_sessions',
    APP_CATEGORIES: 'zenith_app_categories',
};

const DEFAULT_SETTINGS: UserSettings = {
    grayscaleMode: false,
    intentionalMode: false,
    theme: 'pure-black',
    showIntentionPrompt: true,
    launchDelay: 5,
};

// Settings Management
export const getSettings = (): UserSettings => {
    try {
        const stored = localStorage.getItem(STORAGE_KEYS.SETTINGS);
        return stored ? { ...DEFAULT_SETTINGS, ...JSON.parse(stored) } : DEFAULT_SETTINGS;
    } catch {
        return DEFAULT_SETTINGS;
    }
};

export const saveSettings = (settings: Partial<UserSettings>): void => {
    try {
        const current = getSettings();
        const updated = { ...current, ...settings };
        localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(updated));
    } catch (error) {
        console.error('Failed to save settings:', error);
    }
};

// App Launch Tracking
export const logAppLaunch = (appId: string, appName: string, intention?: string): void => {
    try {
        const launches = getAppLaunches();
        const log: AppLaunchLog = {
            appId,
            appName,
            timestamp: Date.now(),
            intention,
        };
        launches.push(log);

        // Keep only last 1000 launches
        const trimmed = launches.slice(-1000);
        localStorage.setItem(STORAGE_KEYS.APP_LAUNCHES, JSON.stringify(trimmed));
    } catch (error) {
        console.error('Failed to log app launch:', error);
    }
};

export const getAppLaunches = (days?: number): AppLaunchLog[] => {
    try {
        const stored = localStorage.getItem(STORAGE_KEYS.APP_LAUNCHES);
        const all: AppLaunchLog[] = stored ? JSON.parse(stored) : [];

        if (days) {
            const cutoff = Date.now() - (days * 24 * 60 * 60 * 1000);
            return all.filter(log => log.timestamp >= cutoff);
        }

        return all;
    } catch {
        return [];
    }
};

export const getTodayLaunchCount = (): number => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const launches = getAppLaunches();
    return launches.filter(log => log.timestamp >= today.getTime()).length;
};

// Focus Session Tracking
export const saveFocusSession = (session: FocusSession): void => {
    try {
        const sessions = getFocusSessions();
        sessions.push(session);

        // Keep only last 100 sessions
        const trimmed = sessions.slice(-100);
        localStorage.setItem(STORAGE_KEYS.FOCUS_SESSIONS, JSON.stringify(trimmed));
    } catch (error) {
        console.error('Failed to save focus session:', error);
    }
};

export const getFocusSessions = (days?: number): FocusSession[] => {
    try {
        const stored = localStorage.getItem(STORAGE_KEYS.FOCUS_SESSIONS);
        const all: FocusSession[] = stored ? JSON.parse(stored) : [];

        if (days) {
            const cutoff = Date.now() - (days * 24 * 60 * 60 * 1000);
            return all.filter(session => session.startTime >= cutoff);
        }

        return all;
    } catch {
        return [];
    }
};

export const getCompletionRate = (days: number = 7): number => {
    const sessions = getFocusSessions(days);
    if (sessions.length === 0) return 0;

    const completed = sessions.filter(s => s.completed).length;
    return Math.round((completed / sessions.length) * 100);
};

// App Category Management
export const saveAppCategory = (appId: string, category: string): void => {
    try {
        const categories = getAppCategories();
        categories[appId] = category;
        localStorage.setItem(STORAGE_KEYS.APP_CATEGORIES, JSON.stringify(categories));
    } catch (error) {
        console.error('Failed to save app category:', error);
    }
};

export const getAppCategories = (): Record<string, string> => {
    try {
        const stored = localStorage.getItem(STORAGE_KEYS.APP_CATEGORIES);
        return stored ? JSON.parse(stored) : {};
    } catch {
        return {};
    }
};

// Data Export/Import
export const exportData = (): string => {
    const data = {
        settings: getSettings(),
        launches: getAppLaunches(),
        sessions: getFocusSessions(),
        categories: getAppCategories(),
        exportDate: new Date().toISOString(),
    };
    return JSON.stringify(data, null, 2);
};

export const importData = (jsonString: string): boolean => {
    try {
        const data = JSON.parse(jsonString);

        if (data.settings) {
            localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(data.settings));
        }
        if (data.launches) {
            localStorage.setItem(STORAGE_KEYS.APP_LAUNCHES, JSON.stringify(data.launches));
        }
        if (data.sessions) {
            localStorage.setItem(STORAGE_KEYS.FOCUS_SESSIONS, JSON.stringify(data.sessions));
        }
        if (data.categories) {
            localStorage.setItem(STORAGE_KEYS.APP_CATEGORIES, JSON.stringify(data.categories));
        }

        return true;
    } catch (error) {
        console.error('Failed to import data:', error);
        return false;
    }
};

// Clear all data
export const clearAllData = (): void => {
    Object.values(STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key);
    });
};
