import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from './AuthContext';

type Ctx = {
  ids: string[];
  isFav: (id: string) => boolean;
  toggle: (id: string) => Promise<void>;
  remove: (id: string) => Promise<void>;
  reload: () => Promise<void>;
};

const FavoritesContext = createContext<Ctx | null>(null);

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [ids, setIds] = useState<string[]>([]);
  const key = useMemo(() => user ? `favourites_${user.email.toLowerCase()}` : 'favourites_guest', [user?.email]);

  const reload = async () => {
    const raw = await AsyncStorage.getItem(key);
    setIds(raw ? JSON.parse(raw) : []);
  };

  useEffect(() => { reload(); }, [key]);

  const write = async (next: string[]) => {
    setIds(next);
    await AsyncStorage.setItem(key, JSON.stringify(next));
  };

  const isFav = (id: string) => ids.includes(id);

  const toggle = async (id: string) => {
    const next = isFav(id) ? ids.filter(x => x !== id) : [...ids, id];
    await write(next);
  };

  const remove = async (id: string) => {
    const next = ids.filter(x => x !== id);
    await write(next);
  };

  return <FavoritesContext.Provider value={{ ids, isFav, toggle, remove, reload }}>{children}</FavoritesContext.Provider>;
};

export const useFavoritesCtx = () => {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error('useFavoritesCtx must be used within FavoritesProvider');
  return ctx;
};
