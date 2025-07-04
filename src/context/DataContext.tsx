import { createContext, useContext, ReactNode, useEffect, useState } from 'react';
import { savingsData, loansData, activityLogs, accountSummary, AccountSummary } from '../data';
import axios from 'axios';

interface DataContextType {
  savingsData: typeof savingsData;
  loansData: typeof loansData;
  activityLogs: typeof activityLogs;
  accountSummary: typeof accountSummary;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {

  const [dynaccountSummary, setAccountSummary] = useState<AccountSummary | undefined>();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = JSON.parse(localStorage.getItem('user') || '{}')?.token;
        if (!token) return;

        // 🟢 Fetch summary
        const summaryRes = await axios.get('http://localhost:8080/api/dashboard/summary', {
          headers: { Authorization: `Bearer ${token}` }
        });

        setAccountSummary({
          ...summaryRes.data.data,
          interestEarned: 0,      // You can adjust later
          creditScore: 'Good'     // Placeholder, adjust later
        });
        console.log("dyn",dynaccountSummary);
        
        // You can also fetch loans & savings if needed here
        // const loansRes = await axios.get('...');
        // setLoansData(loansRes.data);

      } catch (err) {
        console.error('Errords fetching daffshboard data:', err);
      }
    };

    fetchData();
  }, []);
  return (
    <DataContext.Provider value={{
      savingsData,
      loansData,
      activityLogs,
      accountSummary: dynaccountSummary || accountSummary // Use dynamic summary if available
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData from here must be used within a DataProvider');
  }
  return context;
}