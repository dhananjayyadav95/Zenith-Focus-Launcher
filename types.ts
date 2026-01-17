
export enum Screen {
  HOME = 'HOME',
  APP_DRAWER = 'APP_DRAWER',
  FOCUS_MODE = 'FOCUS_MODE',
  STATS = 'STATS',
  CAMERA = 'CAMERA'
}

export interface AppItem {
  id: string;
  name: string;
  category: 'Social' | 'Work' | 'Utility' | 'Entertainment';
}

export interface Message {
  role: 'user' | 'model';
  text: string;
}
