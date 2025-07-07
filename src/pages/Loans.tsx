import React, { useState } from 'react';
import { 
  CreditCard, 
  Plus, 
  Calendar,
  DollarSign,
  Clock,
  CheckCircle,
  AlertCircle,
  FileText,
  Calculator,
  TrendingDown
} from 'lucide-react';
import DashboardCard from '../components/layout/DashboardCard';
import LoanChart from '../components/charts/LoanChart';
import Table from '../components/layout/Table';
import Badge from '../components/layout/Badge';
import { useData } from '../context/DataContext';
import { formatCurrency, formatDate, formatDateFromMonths } from '../utils/formatters';
import { useAuth } from '../context/AuthContext';

interface LoanPayment {
  id: string;
  loanId: string;
  amount: number;
  dueDate: string;
  paidDate?: string;
  status: 'pending' | 'paid' | 'overdue';
}

export default function Loans() {
  const{user}=useAuth()
  const { loansData, loanData,accountSummary } = useData();
  const [showPaymentForm, setShowPaymentForm] = useState(false);


  const [selectedLoan, setSelectedLoan] = useState<string | null>(null);

  // Mock payment schedule data
  const upcomingPayments: LoanPayment[] = [
    {
      id: '1',
      loanId: '1',
      amount: 44400,
      dueDate: '2024-12-15',
      status: 'pending'
    },
    {
      id: '2',
      loanId: '2',
      amount: 36800,
      dueDate: '2024-12-20',
      status: 'pending'
    },
    {
      id: '3',
      loanId: '1',
      amount: 44400,
      dueDate: '2024-11-15',
      paidDate: '2024-11-14',
      status: 'paid'
    },
    {
      id: '4',
      loanId: '2',
      amount: 36800,
      dueDate: '2024-11-20',
      paidDate: '2024-11-19',
      status: 'paid'
    }
  ];

  const loanColumns = [
    { 
      key: 'id', 
      label: 'Loan ID',
      render: (id: string) => `#${id}`
    },
    {
      key: 'amount',
      label: 'Original Amount',
      render: (amount: number) => formatCurrency(amount)
    },
    { key: 'purpose', label: 'Purpose' },
    {
      key: 'status',
      label: 'Status',
      render: (status: string) => {
        const variants = {
          pending: 'warning' as const,
          approved: 'success' as const,
          rejected: 'error' as const,
          active: 'info' as const,
          completed: 'default' as const
        };
        return (
          <Badge variant={variants[status as keyof typeof variants] || 'default'}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
        );
      }
    },
    {
      key: 'remainingBalance',
      label: 'Remaining Balance',
      render: (balance: number) => (
        <span className="font-medium text-red-600">
          {formatCurrency(balance)}
        </span>
      )
    },
    {
      key: 'monthlyPayment',
      label: 'Monthly Payment',
      render: (payment: number) => formatCurrency(payment)
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, loan: any) => (
        <div className="flex space-x-2">
          {user?.role == 'ADMIN' &&
          
          <button 
            onClick={() => {
              setSelectedLoan(loan.id);
              setShowPaymentForm(true);
            }}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            Make Payment
          </button>
    }
          <button className="text-gray-600 hover:text-gray-700 text-sm font-medium">
            View Details
          </button>
        </div>
      )
    }
  ];

  const paymentColumns = [
    {
      key: 'loanId',
      label: 'Loan',
      render: (loanId: string) => `Loan #${loanId}`
    },
    {
      key: 'amount',
      label: 'Amount',
      render: (amount: number) => formatCurrency(amount)
    },
    {
      key: 'dueDate',
      label: 'Due Date',
      render: (date: string) => formatDate(date)
    },
    {
      key: 'paidDate',
      label: 'Paid Date',
      render: (date: string) => date ? formatDate(date) : '-'
    },
    {
      key: 'status',
      label: 'Status',
      render: (status: string) => {
        const variants = {
          pending: 'warning' as const,
          paid: 'success' as const,
          overdue: 'error' as const
        };
        return (
          <Badge variant={variants[status as keyof typeof variants] || 'default'}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
        );
      }
    }
  ];

  const activeLoans = loanData.filter(loan => loan.status === 'active');
  const totalMonthlyPayments = activeLoans.reduce((sum, loan) => sum + loan.monthlyPayment, 0);
  const pendingPayments = loanData.filter(payment => payment.status === 'pending');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Loans</h1>
          <p className="text-gray-600">Manage your loans and track payments</p>
        </div>
        <div className="flex space-x-3">
          {user?.role === 'ADMIN' && 
          <button 
            onClick={() => setShowPaymentForm(true)}
            className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            <DollarSign className="w-4 h-4" />
            <span>Make Payment</span>
          </button>
}
          <button className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            <Plus className="w-4 h-4" />
            <span>Request Loan</span>
          </button>
        </div>
      </div>

      {/* Loan Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard
          title="Total Outstanding"
          value={formatCurrency(accountSummary.totalLoans)}
          icon={CreditCard}
          trend={{ value: -5.2, isPositive: false }}
        />
        <DashboardCard
          title="Monthly Payments"
          value={formatCurrency(totalMonthlyPayments)}
          icon={Calendar}
          trend={{ value: 0, isPositive: true }}
        />
        <DashboardCard
          title="Active Loans"
          value={activeLoans.length}
          icon={FileText}
        />
        <DashboardCard
          title="Available Credit"
          value={formatCurrency(accountSummary.availableCredit)}
          icon={TrendingDown}
          trend={{ value: 8.5, isPositive: true }}
        />
      </div>

      {/* Loan Chart */}
      <LoanChart />

      {/* Active Loans */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Your Loans</h3>
              <p className="text-gray-600">Overview of all your loan accounts</p>
            </div>
          </div>
        </div>
        <div className="p-6">
          <Table columns={loanColumns} data={loanData} />
        </div>
      </div>

      {/* Payment Schedule */}

      {/* this feature is not yet implemented */}
      {/* <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Payment Schedule</h3>
              <p className="text-gray-600">Upcoming and recent loan payments</p>
            </div>
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              View full schedule
            </button>
          </div>
        </div>
        <div className="p-6">
          <Table columns={paymentColumns} data={upcomingPayments} />
        </div>
      </div> */}

      {/* Upcoming Payments Alert */}
      {pendingPayments.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
          <div className="flex items-start space-x-3">
            <Clock className="w-6 h-6 text-yellow-600 mt-0.5" />
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-yellow-900 mb-2">
                Upcoming Payments ({pendingPayments.length})
              </h3>
              <div className="space-y-2">
                {pendingPayments.slice(0, 3).map((payment) => (
                  <div key={payment.id} className="flex items-center justify-between bg-white rounded-lg p-3">
                    <div>
                      <p className="font-medium text-gray-900">Loan #{payment.id}</p>
                      <p className="text-sm text-gray-600">Due: {payment.approvalDate ? formatDateFromMonths(payment.duration, payment.approvalDate) : '-'}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">{formatCurrency(payment.amount)}</p>
                      <button className="text-sm text-blue-600 hover:text-blue-700">
                        Pay Now
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-2">Loan Calculator</h3>
              <p className="text-blue-100 text-sm mb-4">Calculate loan payments and interest</p>
              <button className="bg-white text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors">
                Open Calculator
              </button>
            </div>
            <Calculator className="w-12 h-12 text-blue-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-2">Early Payment</h3>
              <p className="text-green-100 text-sm mb-4">Pay off loans early to save on interest</p>
              <button className="bg-white text-green-600 px-4 py-2 rounded-lg hover:bg-green-50 transition-colors">
                Make Extra Payment
              </button>
            </div>
            <CheckCircle className="w-12 h-12 text-green-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-2">Payment History</h3>
              <p className="text-purple-100 text-sm mb-4">View detailed payment records</p>
              <button className="bg-white text-purple-600 px-4 py-2 rounded-lg hover:bg-purple-50 transition-colors">
                View History
              </button>
            </div>
            <FileText className="w-12 h-12 text-purple-200" />
          </div>
        </div>
      </div>

      {/* Payment Form Modal */}
      {showPaymentForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Make Loan Payment</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Loan
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">Choose a loan</option>
                  {activeLoans.map((loan) => (
                    <option key={loan.id} value={loan.id}>
                      Loan #{loan.id} - {loan.purpose} ({formatCurrency(loan.remainingBalance)} remaining)
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Amount
                </label>
                <input
                  type="number"
                  placeholder="Enter amount"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <p className="text-gray-600 text-sm">This feature will be implemented with backend integration.</p>
            </div>
            <div className="flex space-x-3 mt-6">
              <button 
                onClick={() => setShowPaymentForm(false)}
                className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
              <button className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
                Make Payment
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Collect Savings Temporarily */}
      
    </div>
  );
}