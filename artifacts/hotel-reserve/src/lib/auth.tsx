import { createContext, useCallback, useContext, useEffect, useMemo, useState, ReactNode } from 'react';
import { customFetch } from '@workspace/api-client-react';

export interface AuthState {
  accessToken: string;
  refreshToken: string;
  username: string;
}

const STORAGE_KEY = 'velaris_auth';

function readStoredAuth(): AuthState | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as AuthState) : null;
  } catch {
    return null;
  }
}

function writeStoredAuth(state: AuthState | null) {
  if (state) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } else {
    localStorage.removeItem(STORAGE_KEY);
  }
}

// Module-level mirror so non-React code (the fetch wrapper in lib/api.ts)
// can read/update tokens without going through React context.
let currentAuth: AuthState | null = readStoredAuth();
const listeners = new Set<(state: AuthState | null) => void>();

export function getAuth(): AuthState | null {
  return currentAuth;
}

export function setAuth(state: AuthState | null) {
  currentAuth = state;
  writeStoredAuth(state);
  listeners.forEach((l) => l(state));
}

interface AuthContextValue {
  auth: AuthState | null;
  login: (username: string, password: string) => Promise<void>;
  register: (data: { username: string; email: string; password: string; phone_number: string }) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [auth, setAuthState] = useState<AuthState | null>(() => currentAuth);

  useEffect(() => {
    const listener = (state: AuthState | null) => setAuthState(state);
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }, []);

  const login = useCallback(async (username: string, password: string) => {
    const res = await customFetch<{ access: string; refresh: string }>('/login/', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
    setAuth({ accessToken: res.access, refreshToken: res.refresh, username });
  }, []);

  const register = useCallback(
    async (data: { username: string; email: string; password: string; phone_number: string }) => {
      await customFetch('/register/', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      await login(data.username, data.password);
    },
    [login],
  );

  const logout = useCallback(() => {
    setAuth(null);
  }, []);

  const value = useMemo(() => ({ auth, login, register, logout }), [auth, login, register, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
