
export enum Screen {
  HOME = 'HOME',
  APP_DRAWER = 'APP_DRAWER',
  FOCUS_MODE = 'FOCUS_MODE',
  STATS = 'STATS',
  CAMERA = 'CAMERA',
  SETTINGS = 'SETTINGS'
}

export type AppCategory = 'Essential' | 'Productive' | 'Distracting';

export interface AppItem {
  id: string;
  name: string;
  category: 'Social' | 'Work' | 'Utility' | 'Entertainment';
  userCategory?: AppCategory;
}

export interface UserSettings {
  grayscaleMode: boolean;
  intentionalMode: boolean;
  theme: 'pure-black' | 'dark-gray';
  showIntentionPrompt: boolean;
  launchDelay: number; // seconds
}

export interface AppLaunchLog {
  appId: string;
  appName: string;
  timestamp: number;
  intention?: string;
}

export interface FocusSession {
  id: string;
  duration: number; // minutes
  startTime: number;
  endTime?: number;
  completed: boolean;
}
