import React, { createContext, useContext, ReactNode } from 'react';
import { useFarmManager } from '../hooks/useFarmManager';

type FarmManagerHook = ReturnType<typeof useFarmManager>;

const FarmContext = createContext<FarmManagerHook | null>(null);

export const FarmProvider = ({ children }: { children: ReactNode }) => {
  const farmManager = useFarmManager();
  return (
    <FarmContext.Provider value={farmManager}>
      {children}
    </FarmContext.Provider>
  );
};

export const useFarmContext = () => {
  const context = useContext(FarmContext);
  if (!context) {
    throw new Error('useFarmContext must be used within a FarmProvider');
  }
  return context;
};
