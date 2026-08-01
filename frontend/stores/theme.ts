import { defineStore } from 'pinia';

export type Theme = 'dark' | 'light';

export const useThemeStore = defineStore('theme', {
  state: () => ({
    theme: 'dark' as Theme
  }),
  actions: {
    applyTheme() {
      if (import.meta.client) {
        const root = document.documentElement;
        root.classList.remove('dark', 'light');
        root.classList.add(this.theme);
      }
    },
    initTheme() {
      if (import.meta.client) {
        const saved = localStorage.getItem('electrotech_theme') as Theme;
        if (saved === 'light' || saved === 'dark') {
          this.theme = saved;
        }
        this.applyTheme();
      }
    },
    toggleTheme() {
      this.theme = this.theme === 'dark' ? 'light' : 'dark';
      if (import.meta.client) {
        localStorage.setItem('electrotech_theme', this.theme);
      }
      this.applyTheme();
    },
    setTheme(newTheme: Theme) {
      this.theme = newTheme;
      if (import.meta.client) {
        localStorage.setItem('electrotech_theme', this.theme);
      }
      this.applyTheme();
    }
  }
});
