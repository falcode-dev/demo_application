import { createContext, useContext, ReactNode } from 'react';
import type { ToastType } from '../components/Toast';

interface ToastContextType {
  success: (message: string, duration?: number) => void;
  error: (message: string, duration?: number) => void;
  info: (message: string, duration?: number) => void;
  warning: (message: string, duration?: number) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToastContext = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToastContext must be used within ToastProvider');
  }
  return context;
};

interface ToastProviderProps {
  children: ReactNode;
  value: ToastContextType;
}

export const ToastProvider = ({ children, value }: ToastProviderProps) => {
  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>;
};

