import { createContext, useContext, ReactNode, useEffect, useState } from 'react';
import { savingsData, loansData, activityLogs, accountSummary, AccountSummary } from '../data';
import axios from 'axios';

interface SavingsData {
  month: string;
  amount: number;
  target: number;
}

interface DataContextType {
  savingsData: typeof savingsData;
  loansData: typeof loansData;
  activityLogs: typeof activityLogs;
  accountSummary: AccountSummary | undefined;
  monthlySavings: SavingsData[] | undefined;
  isLoading: boolean;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const [dynaccountSummary, setAccountSummary] = useState<AccountSummary>();
  const [monthlySavings, setMonthlySavings] = useState<SavingsData[]>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = JSON.parse(localStorage.getItem('user') || '{}')?.token;
        if (!token) return;

        // Fetch account summary
        const summaryRes = await axios.get('http://localhost:8080/api/dashboard/summary', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setAccountSummary({
          ...summaryRes.data.data,
          interestEarned: 0, // Placeholder
          creditScore: 'Good' // Placeholder
        });

        // Fetch monthly savings summary
        const monthlyRes = await axios.get('http://localhost:8080/api/savings/monthly-summary', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMonthlySavings(monthlyRes.data.data);

      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <DataContext.Provider value={{
      savingsData,
      loansData,
      activityLogs,
      accountSummary: dynaccountSummary || accountSummary,
      monthlySavings,
      isLoading
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
