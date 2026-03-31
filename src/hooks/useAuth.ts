import { create } from 'zustand';
import { login as loginRequest, LoginPayload } from '../api/auth';

const STORAGE_KEY = 'pg-dev-guide-auth';

export interface AuthUser {
  username: string;
  email: string;
  role: string;
}

interface AuthPersisted {
  token?: string;
  expiresAt?: string;
  user?: AuthUser;
}

interface AuthState extends AuthPersisted {
  loading: boolean;
  error?: string;
  login: (payload: LoginPayload) => Promise<void>;
  logout: () => void;
}

const readStoredState = (): AuthPersisted => {
  if (typeof window === 'undefined') {
    return {};
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};

const persistState = (state: AuthPersisted) => {
  if (typeof window === 'undefined') {
    return;
  }

  if (state.token) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } else {
    window.localStorage.removeItem(STORAGE_KEY);
  }
};

export const useAuthStore = create<AuthState>((set) => {
  const stored = readStoredState();

  return {
    ...stored,
    loading: false,
    error: undefined,
    login: async (payload) => {
      set({ loading: true, error: undefined });
      try {
        const response = await loginRequest(payload);
        const nextState: AuthPersisted = {
          token: response.accessToken,
          expiresAt: response.expiresAt,
          user: {
            username: response.username,
            email: response.email,
            role: response.role,
          },
        };
        set({ ...nextState, error: undefined });
        persistState(nextState);
      } catch (err) {
        const message = err instanceof Error ? err.message : '로그인에 실패했습니다.';
        set({ error: message });
        throw err;
      } finally {
        set({ loading: false });
      }
    },
    logout: () => {
      set({ token: undefined, expiresAt: undefined, user: undefined, error: undefined });
      persistState({});
    },
  };
});
