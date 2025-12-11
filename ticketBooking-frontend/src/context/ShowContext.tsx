import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Show } from '../types';
import { showsApi } from '../api/shows';

interface ShowContextType {
  shows: Show[];
  loading: boolean;
  error: string | null;
  fetchShows: () => Promise<void>;
  addShow: (show: Show) => void;
  removeShow: (id: number) => void;
}

const ShowContext = createContext<ShowContextType | undefined>(undefined);

export const ShowProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [shows, setShows] = useState<Show[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchShows = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await showsApi.getShows();
      setShows(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch shows');
    } finally {
      setLoading(false);
    }
  };

  const addShow = (show: Show) => {
    setShows((prev) => [...prev, show]);
  };

  const removeShow = (id: number) => {
    setShows((prev) => prev.filter((show) => show.id !== id));
  };

  useEffect(() => {
    fetchShows();
  }, []);

  return (
    <ShowContext.Provider value={{ shows, loading, error, fetchShows, addShow, removeShow }}>
      {children}
    </ShowContext.Provider>
  );
};

export const useShows = () => {
  const context = useContext(ShowContext);
  if (!context) {
    throw new Error('useShows must be used within ShowProvider');
  }
  return context;
};