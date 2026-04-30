import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authApi, usersApi, User } from '@/services/api';
import { getTokens, setTokens, clearTokens } from '@/lib/api';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, role: 'developer' | 'startup', name: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  /**
   * On Mount: Check if we have a token and fetch the user profile
   * to keep the user session persistent.
   */
  useEffect(() => {
    const initAuth = async () => {
      const tokens = getTokens();
      
      if (tokens?.accessToken) {
        try {
          // Fetch current user from /api/v1/users/me
          const userData = await usersApi.getMe();
          setUser(userData);
        } catch (error) {
          console.error("Session restoration failed:", error);
          // If the token is invalid/expired and refresh failed, clear everything
          clearTokens();
          setUser(null);
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
  setIsLoading(true);

  try {
    const data = await authApi.login({ email, password });

    setTokens({
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
    });

    setUser(data.user); // ✅ safe now
  } finally {
    setIsLoading(false);
  }
};

const register = async (
  email: string,
  password: string,
  role: "developer" | "startup",
  name: string
) => {
  setIsLoading(true);

  try {
    const data = await authApi.register({
      email,
      password,
      role,
      name,
    });

    setTokens({
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
    });

    setUser(data.user);
  } finally {
    setIsLoading(false);
  }
};

  const logout = () => {
    // We don't necessarily need to await this to clear the UI
    authApi.logout().finally(() => {
      clearTokens();
      setUser(null);
      // Optional: Force redirect to login
      window.location.href = '/login';
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};