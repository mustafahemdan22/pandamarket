'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: RegisterData) => Promise<boolean>;
  logout: () => void;
}

interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  password: string;
  confirmPassword: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Convex mutations
  const createUser = useMutation(api.functions.createUser.createUser);
  const loginUser = useMutation(api.functions.login.loginUser);

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('panda-user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem('panda-user');
      }
    }
    setIsLoading(false);
  }, []);

  // Save user to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('panda-user', JSON.stringify(user));
    } else {
      localStorage.removeItem('panda-user');
    }
  }, [user]);

  // Register new user
  const register = async (userData: RegisterData): Promise<boolean> => {
    setIsLoading(true);
    try {
      if (userData.password !== userData.confirmPassword) {
        alert("Passwords do not match!");
        setIsLoading(false);
        return false;
      }

      await createUser({
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        phone: userData.phone || "",
        password: userData.password,
      });

      alert("✅ Account created successfully!");
      setIsLoading(false);
      return true;
    } catch (error: any) {
      console.error("❌ Register error:", error);
      alert(error.message || "Error creating account");
      setIsLoading(false);
      return false;
    }
  };

  // Login existing user
  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const result = await loginUser({ email, password });

      if (result.success) {
        const loggedUser: User = {
          id: result.userId,
          email,
          firstName: result.firstName,
          lastName: result.lastName,
        };
        setUser(loggedUser);
        setIsLoading(false);
        return true;
      }

      setIsLoading(false);
      return false;
    } catch (error: any) {
      console.error("❌ Login error:", error);
      alert(error.message || "Invalid email or password");
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('panda-cart');
    localStorage.removeItem('panda-wishlist');
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
