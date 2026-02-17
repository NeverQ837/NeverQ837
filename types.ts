
export interface Alarm {
  id: string;
  time: string; // HH:mm format
  label: string;
  isActive: boolean;
  repeat: string[]; // ['Mon', 'Tue', etc.]
  sound: string;
  snoozeEnabled: boolean;
  snoozeDuration: number; // 1-15 minutes
}

export type ThemeMode = 'deep' | 'dawn' | 'midnight';

export interface GeminiResponse {
  message: string;
  type: 'affirmation' | 'advice';
}
