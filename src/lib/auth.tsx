import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { api, ApiUser } from './api';

/**
 * Session state for the app.
 *
 * - Signed in:  ps_auth_token + ps_auth_user are set.
 * - Guest:      ps_guest = '1' — browsing without an account.
 * - Neither:    first-run — the root layout routes to /auth.
 */

const TOKEN_KEY = 'ps_auth_token';
const USER_KEY = 'ps_auth_user';
const GUEST_KEY = 'ps_guest';

export type AuthState = {
  user: ApiUser | null;
  token: string | null;
  isGuest: boolean;
  ready: boolean;
  signIn: (identifier: string, password: string) => Promise<void>;
  signUp: (data: { name: string; email: string; phone: string; password: string }) => Promise<void>;
  signOut: () => Promise<void>;
  continueAsGuest: () => Promise<void>;
  /** Patch the profile on the server (when signed in) and locally. */
  updateProfile: (patch: Partial<ApiUser>) => Promise<ApiUser | null>;
};

const AuthContext = createContext<AuthState>({
  user: null,
  token: null,
  isGuest: false,
  ready: false,
  signIn: async () => {},
  signUp: async () => {},
  signOut: async () => {},
  continueAsGuest: async () => {},
  updateProfile: async () => null,
});

export function useAuth() {
  return useContext(AuthContext);
}

/** Lightweight storage probe used by the root layout / onboarding (no context). */
export async function hasSession(): Promise<boolean> {
  try {
    const [token, guest] = await Promise.all([
      AsyncStorage.getItem(TOKEN_KEY),
      AsyncStorage.getItem(GUEST_KEY),
    ]);
    return !!token || guest === '1';
  } catch {
    return false;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<ApiUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isGuest, setIsGuest] = useState(false);
  const [ready, setReady] = useState(false);

  /* Restore the session on launch. */
  useEffect(() => {
    (async () => {
      try {
        const [t, u, g] = await Promise.all([
          AsyncStorage.getItem(TOKEN_KEY),
          AsyncStorage.getItem(USER_KEY),
          AsyncStorage.getItem(GUEST_KEY),
        ]);
        if (t && u) {
          setToken(t);
          setUser(JSON.parse(u));
        } else if (g === '1') {
          setIsGuest(true);
        }
      } catch {
        /* storage unavailable */
      } finally {
        setReady(true);
      }
    })();
  }, []);

  const persistSession = useCallback(async (newToken: string, newUser: ApiUser) => {
    setToken(newToken);
    setUser(newUser);
    setIsGuest(false);
    try {
      await AsyncStorage.multiSet([
        [TOKEN_KEY, newToken],
        [USER_KEY, JSON.stringify(newUser)],
        [GUEST_KEY, ''],
      ]);
    } catch {
      /* ignore */
    }
  }, []);

  const signIn = useCallback(
    async (identifier: string, password: string) => {
      const res = await api<{ token: string; user: ApiUser }>('login.php', {
        method: 'POST',
        body: { identifier: identifier.trim(), password },
      });
      await persistSession(res.token, res.user);
    },
    [persistSession],
  );

  const signUp = useCallback(
    async (data: { name: string; email: string; phone: string; password: string }) => {
      const res = await api<{ token: string; user: ApiUser }>('register.php', {
        method: 'POST',
        body: data,
      });
      await persistSession(res.token, res.user);
    },
    [persistSession],
  );

  const signOut = useCallback(async () => {
    const t = token;
    setUser(null);
    setToken(null);
    setIsGuest(false);
    try {
      await AsyncStorage.multiRemove([TOKEN_KEY, USER_KEY, GUEST_KEY]);
    } catch {
      /* ignore */
    }
    if (t) {
      // Best-effort token revocation; ignore failures (offline etc.).
      api('logout.php', { method: 'POST', token: t }).catch(() => {});
    }
  }, [token]);

  const continueAsGuest = useCallback(async () => {
    setIsGuest(true);
    try {
      await AsyncStorage.setItem(GUEST_KEY, '1');
    } catch {
      /* ignore */
    }
  }, []);

  const updateProfile = useCallback(
    async (patch: Partial<ApiUser>) => {
      if (!token) return null;
      const res = await api<{ user: ApiUser }>('update_profile.php', {
        method: 'POST',
        body: patch,
        token,
      });
      setUser(res.user);
      try {
        await AsyncStorage.setItem(USER_KEY, JSON.stringify(res.user));
      } catch {
        /* ignore */
      }
      return res.user;
    },
    [token],
  );

  const value = useMemo(
    () => ({ user, token, isGuest, ready, signIn, signUp, signOut, continueAsGuest, updateProfile }),
    [user, token, isGuest, ready, signIn, signUp, signOut, continueAsGuest, updateProfile],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
