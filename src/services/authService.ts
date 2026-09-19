import type { User, Role } from '../types';
import { MOCK_USERS } from '../data/mockData';

const SESSION_KEY = 'ngb_session';

export const authService = {
  login(email: string, _password: string, role: Role): User | null {
    const user = MOCK_USERS.find(u => u.email === email && u.role === role);
    if (user) {
      localStorage.setItem(SESSION_KEY, JSON.stringify(user));
      return user;
    }
    return null;
  },

  logout(): void {
    localStorage.removeItem(SESSION_KEY);
  },

  getCurrentUser(): User | null {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as User;
    } catch {
      return null;
    }
  },
};
