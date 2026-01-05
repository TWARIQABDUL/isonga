export interface SavingsData {
  month: string;
  amount: number;
  target: number;
}

export interface LoanData {
  id: string;
  amount: number;
  purpose: string;
  duration: number;
  status: 'pending' | 'approved' | 'rejected' | 'active' | 'completed';
  requestDate: string;
  approvalDate?: string;
  interestRate: number;
  monthlyPayment: number;
  remainingBalance: number;
  createdAt?: string;
}

export interface Activity {
  id: string;
  type: 'deposit' | 'withdrawal' | 'loan_request' | 'loan_payment' | 'interest';
  description: string;
  amount: number;
  date: string;
  status: 'completed' | 'pending' | 'failed';
}

export interface AccountSummary {
  totalSavings: number;
  totalLoans: number;
  monthlyContribution: number;
  interestEarned: number;
  creditScore: number;
  availableCredit: number;
  totalUsers?: number;
}

export const savingsData: SavingsData[] = [
  // { month: 'Janf', amount: 250000, target: 300000 },
  // { month: 'Feb', amount: 420000, target: 400000 },
  // { month: 'Mar', amount: 380000, target: 450000 },
  // { month: 'Apr', amount: 520000, target: 500000 },
  // { month: 'May', amount: 680000, target: 650000 },
  // { month: 'Jun', amount: 750000, target: 700000 },
  // { month: 'Jul', amount: 920000, target: 850000 },
  // { month: 'Aug', amount: 1100000, target: 1000000 },
  // { month: 'Sep', amount: 1250000, target: 1200000 },
  // { month: 'Oct', amount: 1420000, target: 1350000 },
  // { month: 'Nov', amount: 1580000, target: 1500000 },
  // { month: 'Dec', amount: 750000, target: 1650000 }
];

export const loansData: LoanData[] = [
  {
    id: '1',
    amount: 500000,
    purpose: 'Business Investment',
    duration: 12,
    status: 'active',
    requestDate: '2024-01-15',
    approvalDate: '2024-01-20',
    interestRate: 12,
    monthlyPayment: 44400,
    remainingBalance: 355200
  },

  {
    // userIdNumber: "1199680057907051",
    id: "819b9227-825e-4630-9319-a55a424fefcb",
    amount: 400000,
    purpose: "Emergency Medical Support",
    duration: 4,
    status: "active",
    requestDate: "2025-07-01",
    approvalDate: "2025-07-04",
    interestRate: 5.00,
    monthlyPayment: 105000,
    createdAt: "2025-07-01T22:46:51",
    remainingBalance: 400000
  },
  {
    id: '2',
    amount: 800000,
    purpose: 'Education',
    duration: 24,
    status: 'active',
    requestDate: '2024-02-10',
    approvalDate: '2024-02-15',
    interestRate: 10,
    monthlyPayment: 36800,
    remainingBalance: 800000
  },
  {
    id: '3',
    amount: 300000,
    purpose: 'Emergency',
    duration: 6,
    status: 'pending',
    requestDate: '2024-12-01',
    interestRate: 15,
    monthlyPayment: 52500,
    remainingBalance: 300000
  }
];

export const activityLogs: Activity[] = [
  {
    id: '1',
    type: 'deposit',
    description: 'Monthly savings contribution',
    amount: 150000,
    date: '2024-12-01',
    status: 'completed'
  },
  {
    id: '2',
    type: 'loan_payment',
    description: 'Business loan payment',
    amount: -44400,
    date: '2024-11-30',
    status: 'completed'
  },
  {
    id: '3',
    type: 'interest',
    description: 'Interest earned on savings',
    amount: 12500,
    date: '2024-11-30',
    status: 'completed'
  },
  {
    id: '4',
    type: 'deposit',
    description: 'Additional savings deposit',
    amount: 75000,
    date: '2024-11-28',
    status: 'completed'
  },
  {
    id: '5',
    type: 'loan_request',
    description: 'Emergency loan application',
    amount: 300000,
    date: '2024-12-01',
    status: 'pending'
  }
];

export const accountSummary: AccountSummary = {
  totalSavings: 1750000,
  totalLoans: 355200,
  monthlyContribution: 150000,
  interestEarned: 87500,
  creditScore: 750,
  availableCredit: 1200000
};