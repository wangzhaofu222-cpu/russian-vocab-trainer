import { createContext, createElement, useContext, useEffect, useMemo, useState } from 'react';

export const CURRENT_USER_STORAGE_KEY = 'current_user';
const MAX_NICKNAME_LENGTH = 20;

const AuthContext = createContext(null);

function readCurrentUser() {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const storedValue = window.localStorage.getItem(CURRENT_USER_STORAGE_KEY);
    if (!storedValue) {
      return null;
    }

    return sanitizeNickname(JSON.parse(storedValue));
  } catch (error) {
    console.warn('Failed to read current user from localStorage', error);
    return null;
  }
}

export function sanitizeNickname(value) {
  const nickname = String(value ?? '')
    .trim()
    .slice(0, MAX_NICKNAME_LENGTH);

  return nickname || '';
}

export function buildUserInitial(nickname) {
  const cleaned = sanitizeNickname(nickname);
  return cleaned ? cleaned.slice(0, 1).toUpperCase() : 'Я';
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => readCurrentUser());

  useEffect(() => {
    const handleStorage = (event) => {
      if (event.key === CURRENT_USER_STORAGE_KEY) {
        setCurrentUser(readCurrentUser());
      }
    };

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const login = (nickname) => {
    const cleanedNickname = sanitizeNickname(nickname);

    if (!cleanedNickname) {
      return {
        ok: false,
        error: '请输入昵称后再进入学习。',
      };
    }

    try {
      window.localStorage.setItem(CURRENT_USER_STORAGE_KEY, JSON.stringify(cleanedNickname));
      setCurrentUser(cleanedNickname);
      return { ok: true, user: cleanedNickname };
    } catch (error) {
      console.warn('Failed to save current user', error);
      return {
        ok: false,
        error: '保存登录状态失败，请稍后重试。',
      };
    }
  };

  const logout = () => {
    try {
      window.localStorage.removeItem(CURRENT_USER_STORAGE_KEY);
    } catch (error) {
      console.warn('Failed to clear current user', error);
    }

    setCurrentUser(null);
  };

  const value = useMemo(
    () => ({
      currentUser,
      isLoggedIn: Boolean(currentUser),
      userInitial: buildUserInitial(currentUser),
      login,
      logout,
    }),
    [currentUser],
  );

  return createElement(AuthContext.Provider, { value }, children);
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}
