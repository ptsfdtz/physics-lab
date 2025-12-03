import { create } from 'zustand';

interface UserSettingsState {
  showGrid: boolean;
  toggleGrid: () => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  fontSize: number;
  toggleFontSize: () => void;
}

export const useUserSettings = create<UserSettingsState>(set => ({
  showGrid: true,
  toggleGrid: () => set(state => ({ showGrid: !state.showGrid })),
  theme: 'light',
  toggleTheme: () => set(state => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
  fontSize: 16,
  toggleFontSize: () => set(state => ({ fontSize: state.fontSize === 16 ? 20 : 16 })),
}));
