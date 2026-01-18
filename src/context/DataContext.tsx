import { createContext, useContext, ReactNode, useEffect, useState } from 'react';
import { savingsData, loansData, activityLogs, AccountSummary } from '../data';
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
  loanData?: typeof loansData; // Optional, if you want to provide loan data
  accountSummary: AccountSummary | undefined;
  monthlySavings: SavingsData[] | undefined;
  isLoading: boolean;
  activity: any[]; // Add this line to include the activity property
  refreshData: () => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const [dynaccountSummary, setAccountSummary] = useState<AccountSummary>();
  const [monthlySavings, setMonthlySavings] = useState<SavingsData[]>();
  const [loanData, setLoansData] = useState<typeof loansData>();
  const [isLoading, setIsLoading] = useState(true);
  const [activity, setActivity] = useState<any[]>(activityLogs);
  const baseUrl = import.meta.env.VITE_API_URL_DEV;

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const userStr = localStorage.getItem('user');
      const user = userStr ? JSON.parse(userStr) : null;
      const token = user?.token;
      
      if (!token) return;

      const headers = { Authorization: `Bearer ${token}` };
      const isAdmin = user?.role === 'ADMIN';

      // Define fetch promises
      const summaryUrl = isAdmin 
        ? `${baseUrl}/dashboard/admin-summary` 
        : `${baseUrl}/dashboard/summary`;

      const fetchSummary = axios.get(summaryUrl, { headers })
        .then(res => {
          if (isAdmin) {
            setAccountSummary({
              totalSavings: res.data.data.totalSavings,
              totalLoans: res.data.data.totalLoans,
              monthlyContribution: 0, // Not applicable for admin
              interestEarned: 0,      // Not applicable for admin
              creditScore: 0,         // Not applicable for admin
              availableCredit: 0,      // Not applicable for admin
              totalUsers: res.data.data.totalUsers,
              totalIngoboka: res.data.data.totalIngoboka
            });
          } else {
            setAccountSummary({
              ...res.data.data,
              interestEarned: 0, 
              creditScore: 'Good'
            });
          }
          console.log("accountSummary loaded:", res.data.data);
        })
        .catch(err => console.error("Failed to fetch summary:", err));

      const fetchMonthly = axios.get(`${baseUrl}/savings/monthly-summary`, { headers })
        .then(res => {
          setMonthlySavings(res.data.data);
          console.log("monthlySavings loaded");
        })
        .catch(err => console.error("Failed to fetch monthly savings:", err));

      const fetchLoans = axios.get(`${baseUrl}/loans/me`, { headers })
        .then(res => {
           setLoansData(res.data.loans);
        })
        .catch(err => console.error("Failed to fetch loans:", err));

      const fetchActivities = axios.get(`${baseUrl}/activities`, { headers })
        .then(res => {
          setActivity(res.data.data);
          console.log("activities loaded:", res.data.data);
        })
        .catch(err => console.error("Failed to fetch activities:", err));

      // Execute all
      await Promise.allSettled([fetchSummary, fetchMonthly, fetchLoans, fetchActivities]);
      
    } catch (err) {
      console.error('Unexpected error in dashboard data fetch:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const refreshData = async () => {
    await fetchData();
  };

  return (
    <DataContext.Provider value={{
      savingsData,
      loansData,
      activityLogs,
      // mydynamic data
      loanData,
      accountSummary: dynaccountSummary || undefined,
      monthlySavings,
      activity,
      isLoading,
      refreshData
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
