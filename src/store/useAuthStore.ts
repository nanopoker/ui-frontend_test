import { create } from 'zustand';
import { Tutor } from '../types';

interface AuthState {
  tutor: Tutor | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (tutor: Tutor, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  tutor: null,
  token: null,
  isAuthenticated: false,
  login: (tutor, token) => {
    localStorage.setItem('auth', JSON.stringify({ tutor, token }));
    set({ tutor, token, isAuthenticated: true });
  },
  logout: () => {
    localStorage.removeItem('auth');
    set({ tutor: null, token: null, isAuthenticated: false });
  },
}));

// Load from localStorage on init
const storedAuth = localStorage.getItem('auth');
if (storedAuth) {
  try {
    const { tutor, token } = JSON.parse(storedAuth);
    useAuthStore.setState({ tutor, token, isAuthenticated: true });
  } catch (e) {
    // Ignore parse errors
  }
}

