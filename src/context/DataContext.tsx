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
  loanData?: typeof loansData; // Optional, if you want to provide loan data
  accountSummary: AccountSummary | undefined;
  monthlySavings: SavingsData[] | undefined;
  isLoading: boolean;
  activity: any[]; // Add this line to include the activity property
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const [dynaccountSummary, setAccountSummary] = useState<AccountSummary>();
  const [monthlySavings, setMonthlySavings] = useState<SavingsData[]>();
  const [loanData, setLoansData] = useState<typeof loansData>();
  const [isLoading, setIsLoading] = useState(true);
  const [activity, setActivity] = useState<any[]>(activityLogs);
const baseUrl = import.meta.env.VITE_API_URL_DEV;
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = JSON.parse(localStorage.getItem('user') || '{}')?.token;
        if (!token) return;

        // Fetch account summary
        const summaryRes = await axios.get(`${baseUrl}/dashboard/summary`, {
          headers: { Authorization: `Bearer ${token}` }
        });


        setAccountSummary({
          ...summaryRes.data.data,
          interestEarned: 0, // Placeholder
          creditScore: 'Good' // Placeholder
        });

        console.log("accountSummary here:", summaryRes.data.data);



        // Fetch monthly savings summary
        const monthlyRes = await axios.get(`${baseUrl}/savings/monthly-summary`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMonthlySavings(monthlyRes.data.data);
        // Fetch monthly savings summary
        const loanRes = await axios.get(`${baseUrl}/loans/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setLoansData(loanRes.data.loans)

        const activities = await axios.get(`${baseUrl}/activities`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setActivity(activities.data.data);
        console.log("activities here:", activities.data.data);

        setIsLoading(false);


        //  console.log(loanData);
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
      // mydynamic data
      loanData,
      accountSummary: dynaccountSummary || undefined,
      monthlySavings,
      activity,
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
