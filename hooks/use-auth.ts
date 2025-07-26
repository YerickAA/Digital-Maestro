import { useState, useEffect } from 'react';

interface User {
  id: number;
  name: string;
  email: string;
  subscriptionStatus?: string;
}

interface AuthData {
  user: User | null;
  isAuthenticated: boolean;
}

export function useAuthData(): AuthData {
  const [authData, setAuthData] = useState<AuthData>({
    user: null,
    isAuthenticated: false
  });

  useEffect(() => {
    try {
      const stored = localStorage.getItem('auth_data');
      if (stored) {
        const parsed = JSON.parse(stored);
        setAuthData({
          user: parsed.user,
          isAuthenticated: !!parsed.user
        });
      }
    } catch (error) {
      console.error('Error parsing auth data:', error);
    }
  }, []);

  return authData;
}

export function setAuthData(user: User | null): void {
  const data = { user, isAuthenticated: !!user };
  localStorage.setItem('auth_data', JSON.stringify(data));
  
  // Dispatch custom event for auth state changes
  window.dispatchEvent(new CustomEvent('auth-changed', { detail: data }));
}

export function clearAuthData(): void {
  localStorage.removeItem('auth_data');
  window.dispatchEvent(new CustomEvent('auth-changed', { detail: { user: null, isAuthenticated: false } }));
}

export function getAuthData(): { userId: number | null; isAuthenticated: boolean } {
  try {
    const stored = localStorage.getItem('auth_data');
    if (stored) {
      const parsed = JSON.parse(stored);
      return {
        userId: parsed.user?.id || null,
        isAuthenticated: !!parsed.user
      };
    }
  } catch (error) {
    console.error('Error parsing auth data:', error);
  }
  
  return { userId: null, isAuthenticated: false };
}