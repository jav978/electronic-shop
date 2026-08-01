import { defineStore } from 'pinia';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'USER' | 'ADMIN';
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as User | null,
    token: null as string | null,
  }),
  getters: {
    isLoggedIn: (state) => !!state.token && !!state.user,
    isAdmin: (state) => state.user?.role === 'ADMIN',
  },
  actions: {
    initAuth() {
      if (import.meta.client) {
        const storedToken = localStorage.getItem('electrotech_token');
        const storedUser = localStorage.getItem('electrotech_user');
        if (storedToken && storedUser) {
          this.token = storedToken;
          try {
            this.user = JSON.parse(storedUser);
          } catch {
            this.user = null;
          }
        }
      }
    },
    setAuth(user: User, token: string) {
      this.user = user;
      this.token = token;
      if (import.meta.client) {
        localStorage.setItem('electrotech_token', token);
        localStorage.setItem('electrotech_user', JSON.stringify(user));
      }
    },
    logout() {
      this.user = null;
      this.token = null;
      if (import.meta.client) {
        localStorage.removeItem('electrotech_token');
        localStorage.removeItem('electrotech_user');
      }
    }
  }
});
