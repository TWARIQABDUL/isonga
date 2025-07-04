import { createContext, useContext, ReactNode } from 'react';
import { savingsData, loansData, activityLogs, accountSummary } from '../data';

interface DataContextType {
  savingsData: typeof savingsData;
  loansData: typeof loansData;
  activityLogs: typeof activityLogs;
  accountSummary: typeof accountSummary;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  return (
    <DataContext.Provider value={{
      savingsData,
      loansData,
      activityLogs,
      accountSummary
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}