import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const USER_KEY = 'app_user'; 
const CURRENT_USER_KEY = 'current_user'; 

type User = {
  name: string;
  email: string;
  password: string;
  biometric?: boolean;
};

type AuthContextType = {
  user: User | null;
  signup: (data: User) => Promise<{ ok: boolean; message?: string }>;
  login: (email: string, password: string) => Promise<{ ok: boolean; message?: string }>;
  logout: () => Promise<void>;
  loadUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  // load from CURRENT_USER (session)
  const loadUser = async () => {
    const raw = await AsyncStorage.getItem(CURRENT_USER_KEY);
    if (raw) setUser(JSON.parse(raw));
  };

  useEffect(() => {
    loadUser();
  }, []);

  const signup = async (data: User) => {
    try {
      // save permanently
      await AsyncStorage.setItem(USER_KEY, JSON.stringify(data));
      // set session
      await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify(data));
      setUser(data);
      return { ok: true };
    } catch (e) {
      return { ok: false, message: 'Signup failed' };
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const raw = await AsyncStorage.getItem(USER_KEY);
      if (!raw) return { ok: false, message: 'No user found. Please sign up first.' };

      const savedUser: User = JSON.parse(raw);
      if (savedUser.email === email && savedUser.password === password) {
        // set session
        await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify(savedUser));
        setUser(savedUser);
        return { ok: true };
      }
      return { ok: false, message: 'Invalid credentials' };
    } catch (e) {
      return { ok: false, message: 'Login failed' };
    }
  };

  const logout = async () => {
    await AsyncStorage.removeItem(CURRENT_USER_KEY);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, signup, login, logout, loadUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
