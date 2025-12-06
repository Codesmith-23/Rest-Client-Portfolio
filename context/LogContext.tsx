'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface LogEntry {
  id: string;
  timestamp: string;
  method: 'GET' | 'POST' | 'SYSTEM' | 'ERROR';
  message: string;
  status?: string;
}

interface LogContextType {
  logs: LogEntry[];
  addLog: (method: LogEntry['method'], message: string, status?: string) => void;
}

const LogContext = createContext<LogContextType | undefined>(undefined);

export function LogProvider({ children }: { children: ReactNode }) {
  const [logs, setLogs] = useState<LogEntry[]>([]);

  const addLog = (method: LogEntry['method'], message: string, status?: string) => {
    const newLog: LogEntry = {
      id: crypto.randomUUID(),
      timestamp: new Date().toLocaleTimeString('en-US', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      }),
      method,
      message,
      status
    };

    setLogs(prev => {
      const updated = [...prev, newLog];
      return updated.slice(-50); // Keep last 50 entries
    });
  };

  return (
    <LogContext.Provider value={{ logs, addLog }}>
      {children}
    </LogContext.Provider>
  );
}

export function useLogContext() {
  const context = useContext(LogContext);
  if (context === undefined) {
    throw new Error('useLogContext must be used within LogProvider');
  }
  return context;
}
