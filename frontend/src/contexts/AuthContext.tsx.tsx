// src/contexts/AuthContext.tsx
"use client";

import { createContext, useContext, ReactNode } from 'react';
import { KeyedMutator } from 'swr';
import { UserType } from '@/models/user';

interface AuthContextType {
  user: UserType | undefined;
  loading: boolean;
  mutate: KeyedMutator<unknown>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ 
  children,
  user,
  loading,
  mutate 
}: { 
  children: ReactNode;
  user: UserType | undefined;
  loading: boolean;
  mutate: KeyedMutator<unknown>;
}) => {
  return (
    <AuthContext.Provider value={{ user, loading, mutate }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};