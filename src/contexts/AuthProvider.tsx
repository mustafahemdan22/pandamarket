'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';

// ===== Types =====
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  password: string;
  confirmPassword: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResult {
  success: boolean;
  userId: string;
  firstName: string;
  lastName: string;
  message?: string;
}

export interface CreateUserData extends Omit<RegisterData, 'confirmPassword'> {
  phone: string; // Making phone required but can be empty string
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: RegisterData) => Promise<boolean>;
  logout: () => void;
  clearError: () => void;
}

// ===== Context =====
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

// ===== Provider =====
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Convex mutations
  const createUser = useMutation(api.functions.createUser.createUser);
  const loginUser = useMutation(api.functions.login.loginUser);

  const loadUserFromStorage = (): void => {
    try {
      const savedUser = localStorage.getItem('panda-user');
      if (savedUser) {
        const parsedUser = JSON.parse(savedUser) as User;
        setUser(parsedUser);
      }
    } catch (err) {
      console.error('Error loading user from storage:', err);
      localStorage.removeItem('panda-user');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUserFromStorage();
  }, []);

  // Save user to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('panda-user', JSON.stringify(user));
    } else {
      localStorage.removeItem('panda-user');
    }
  }, [user]);

  const clearError = (): void => setError(null);

  const register = async (userData: RegisterData): Promise<boolean> => {
    setIsLoading(true);
    clearError();

    try {
      if (userData.password !== userData.confirmPassword) {
        throw new Error('Passwords do not match!');
      }

      if (userData.password.length < 6) {
        throw new Error('Password must be at least 6 characters long');
      }

      const createUserData: CreateUserData = {
        firstName: userData.firstName.trim(),
        lastName: userData.lastName.trim(),
        email: userData.email.toLowerCase().trim(),
        phone: userData.phone?.trim() || '',
        password: userData.password,
      };

      await createUser(createUserData);
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Error creating account';
      
      setError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
      // ✅ لا يوجد return هنا — هذا هو الإصلاح الرئيسي
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    clearError();

    try {
      const loginCredentials: LoginCredentials = {
        email: email.toLowerCase().trim(),
        password,
      };

      const result = (await loginUser(loginCredentials)) as LoginResult;

      if (!result.success || !result.userId) {
        throw new Error(result.message || 'Invalid credentials');
      }

      const loggedInUser: User = {
        id: result.userId,
        email: loginCredentials.email,
        firstName: result.firstName,
        lastName: result.lastName,
      };

      setUser(loggedInUser);
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Invalid email or password';
      
      setError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
      // ✅ لا يوجد return هنا — هذا هو الإصلاح الرئيسي
    }
  };

  const logout = (): void => {
    setUser(null);
    clearError();
    const storageKeys: Array<string> = ['panda-cart', 'panda-wishlist', 'panda-user'];
    storageKeys.forEach((key: string) => localStorage.removeItem(key));
  };

  const contextValue: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    error,
    login,
    register,
    logout,
    clearError,
  };

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};