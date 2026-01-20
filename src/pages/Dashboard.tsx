import React, { useState } from 'react';
import { 
  PiggyBank, 
  TrendingUp, 
  CreditCard, 
  Award,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Users,
  AlertCircle
} from 'lucide-react';
import DashboardCard from '../components/layout/DashboardCard';
import SavingsChart from '../components/charts/SavingsChart';
import LoanChart from '../components/charts/LoanChart';
import Table from '../components/layout/Table';
import Badge from '../components/layout/Badge';
import { useData } from '../context/DataContext';
import { formatCurrency, formatDate } from '../utils/formatters';
import { useAuth } from '../context/AuthContext';
import CollectSavings from '../components/CollectSavings';
export default function Dashboard():React.ReactElement {
  const { accountSummary, activity, isLoading } = useData();
    const [showColectionForm, setShowColectionForm] = useState(false);
  const{user}=useAuth()
  console.log('accountSummary:', user);
  
  const activityColumns = [
    {
      key: 'type',
      label: 'Type',
      render: (type: string) => {
        const badges = {
          deposit: { variant: 'success' as const, label: 'Deposit' },
          withdrawal: { variant: 'warning' as const, label: 'Withdrawal' },
          loan_request: { variant: 'info' as const, label: 'Loan Request' },
          loan_payment: { variant: 'default' as const, label: 'Loan Payment' },
          interest: { variant: 'success' as const, label: 'Interest' }
        };
        const badge = badges[type as keyof typeof badges] || { variant: 'default' as const, label: type };
        return <Badge variant={badge.variant}>{badge.label}</Badge>;
      }
    },
    { key: 'description', label: 'Description' },
    {
      key: 'amount',
      label: 'Amount',
      render: (amount: number) => (
        <div className={`flex items-center space-x-1 ${
          amount > 0 ? 'text-green-600' : 'text-red-600'
        }`}>
          {amount > 0 ? (
            <ArrowUpRight className="w-4 h-4" />
          ) : (
            <ArrowDownRight className="w-4 h-4" />
          )}
          <span className="font-medium">{formatCurrency(Math.abs(amount))}</span>
        </div>
      )
    },
    {
      key: 'date',
      label: 'Date',
      render: (date: string) => formatDate(date)
    },
    {
      key: 'status',
      label: 'Status',
      render: (status: string) => {
        const variants = {
          completed: 'success' as const,
          pending: 'warning' as const,
          failed: 'error' as const
        };
        return (
          <Badge variant={variants[status as keyof typeof variants] || 'default'}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
        );
      }
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Overview of your savings and loans</p>
        </div>
        {user?.role === 'ADMIN' &&
        <button  onClick={() => setShowColectionForm(true)} className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          <Plus className="w-4 h-4" />
          <span>Quick Action</span>
        </button>
        }
      </div>

      {showColectionForm && <CollectSavings setShowColectionForm={setShowColectionForm} />}
      {/* Metrics Cards */}
      {!isLoading &&
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {user?.role === 'ADMIN' ? (
           <>
              <DashboardCard
                title="Total Users"
                value={accountSummary?.totalUsers?.toString() ?? '0'}
                icon={Users}
                trend={{ value: 10, isPositive: true }}
              />
              <DashboardCard
                title="Total Ingoboka"
                value={formatCurrency(accountSummary?.totalIngoboka ?? 0)}
                icon={Users}
                trend={{ value: 10, isPositive: true }}
              />
              <DashboardCard
                title="Total Savings"
                value={formatCurrency(accountSummary?.totalSavings ?? 0)}
                icon={PiggyBank}
                trend={{ value: 12.5, isPositive: true }}
              />
              <DashboardCard
                title="Total Loans"
                value={formatCurrency(accountSummary?.totalLoans ?? 0)}
                icon={CreditCard}
                trend={{ value: -5.2, isPositive: false }}
              />
           </>
        ) : (
           <>
              <DashboardCard
                title="Total Savings"
                value={formatCurrency(accountSummary?.totalSavings ?? 0)}
                icon={PiggyBank}
                trend={{ value: 12.5, isPositive: true }}
              />
              <DashboardCard
                title="Active Loans"
                value={formatCurrency(accountSummary?.totalLoans ?? 0)}
                icon={CreditCard}
                trend={{ value: -5.2, isPositive: false }}
              />
              <DashboardCard
                title="Monthly Contribution"
                value={formatCurrency(accountSummary?.monthlyContribution ?? 0)}
                icon={TrendingUp}        />
              <DashboardCard
                title="Available Credit"
                value={formatCurrency(accountSummary?.availableCredit ?? 0)}
                icon={Award}
                trend={{ value: 2.3, isPositive: true }}
              />
               <DashboardCard
                title="Total Ingoboka"
                value={formatCurrency(accountSummary?.totalIngoboka ?? 0)}
                icon={Users}
                trend={{ value: 10, isPositive: true }}
              />
              <DashboardCard
                title="Total Ibihano"
                value={formatCurrency(accountSummary?.totalIbihano ?? 0)}
                icon={AlertCircle}
                trend={{ value: -5.2, isPositive: false }}
              />
           </>
        )}
      </div>
}

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SavingsChart />
        <LoanChart />
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
              <p className="text-gray-600">Your latest transactions and updates</p>
            </div>
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              View all
            </button>
          </div>
        </div>
        <div className="p-6">
          <Table 
            columns={activityColumns} 
            data={activity.slice(0, 5)} 
          />
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Interest Earned</p>
              <p className="text-2xl font-bold">{formatCurrency(accountSummary?.interestEarned ?? 0)}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-200" />
          </div>
          <p className="text-green-100 text-sm mt-2">This year</p>
        </div>

        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Available Credit</p>
              <p className="text-2xl font-bold">{formatCurrency(accountSummary?.totalSavings ??0)}</p>
            </div>
            <CreditCard className="w-8 h-8 text-blue-200" />
          </div>
          <p className="text-blue-100 text-sm mt-2">Ready to use</p>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Savings Goal</p>
              <p className="text-2xl font-bold">85%</p>
            </div>
            <Award className="w-8 h-8 text-purple-200" />
          </div>
          <p className="text-purple-100 text-sm mt-2">Annual target</p>
        </div>
      </div>
    </div>
  );
}