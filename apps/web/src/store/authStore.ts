import { create } from 'zustand';

interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  user: {
    name: string;
    avatar: string;
  } | null;
  login: (name: string, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => {
  // Try to load from localStorage on init
  const savedToken = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
  const savedUser = typeof window !== 'undefined' ? localStorage.getItem('user_info') : null;

  return {
    isAuthenticated: !!savedToken,
    token: savedToken,
    user: (savedUser && savedUser !== 'undefined') ? JSON.parse(savedUser) : null,
    login: (name: string, token: string) => {
      localStorage.setItem('access_token', token);
      const userInfo = { name, avatar: name[0].toUpperCase() };
      localStorage.setItem('user_info', JSON.stringify(userInfo));
      set({ isAuthenticated: true, token, user: userInfo });
    },
    logout: () => {
      localStorage.removeItem('access_token');
      localStorage.removeItem('user_info');
      set({ isAuthenticated: false, token: null, user: null });
    },
  };
});
