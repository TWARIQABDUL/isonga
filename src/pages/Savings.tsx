import React, { useState } from 'react';
import { 
  PiggyBank, 
  Plus, 
  TrendingUp, 
  Target,
  Calendar,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Edit,
  Trash2
} from 'lucide-react';
import DashboardCard from '../components/layout/DashboardCard';
import SavingsChart from '../components/charts/SavingsChart';
import Table from '../components/layout/Table';
import Badge from '../components/layout/Badge';
import { useData } from '../context/DataContext';
import { formatCurrency, formatDate } from '../utils/formatters';

interface SavingsGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  status: 'active' | 'completed' | 'paused';
}

interface SavingsTransaction {
  id: string;
  type: 'deposit' | 'withdrawal';
  amount: number;
  description: string;
  date: string;
  goalId?: string;
}

export default function Savings() {
  const { accountSummary, savingsData } = useData();
  const [showNewGoalForm, setShowNewGoalForm] = useState(false);
  const [showTransactionForm, setShowTransactionForm] = useState(false);

  // Mock data for savings goals
  const savingsGoals: SavingsGoal[] = [
    {
      id: '1',
      name: 'Emergency Fund',
      targetAmount: 2000000,
      currentAmount: 1750000,
      deadline: '2024-12-31',
      status: 'active'
    },
    {
      id: '2',
      name: 'New Car',
      targetAmount: 8000000,
      currentAmount: 3200000,
      deadline: '2025-06-30',
      status: 'active'
    },
    {
      id: '3',
      name: 'Vacation Fund',
      targetAmount: 1500000,
      currentAmount: 1500000,
      deadline: '2024-08-15',
      status: 'completed'
    }
  ];

  // Mock transactions
  const recentTransactions: SavingsTransaction[] = [
    {
      id: '1',
      type: 'deposit',
      amount: 150000,
      description: 'Monthly savings contribution',
      date: '2024-12-01'
    },
    {
      id: '2',
      type: 'deposit',
      amount: 75000,
      description: 'Bonus allocation to emergency fund',
      date: '2024-11-28'
    },
    {
      id: '3',
      type: 'withdrawal',
      amount: -50000,
      description: 'Emergency medical expense',
      date: '2024-11-25'
    },
    {
      id: '4',
      type: 'deposit',
      amount: 200000,
      description: 'Car fund contribution',
      date: '2024-11-20'
    }
  ];

  const transactionColumns = [
    {
      key: 'type',
      label: 'Type',
      render: (type: string) => (
        <div className={`flex items-center space-x-2 ${
          type === 'deposit' ? 'text-green-600' : 'text-red-600'
        }`}>
          {type === 'deposit' ? (
            <ArrowUpRight className="w-4 h-4" />
          ) : (
            <ArrowDownRight className="w-4 h-4" />
          )}
          <Badge variant={type === 'deposit' ? 'success' : 'warning'}>
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </Badge>
        </div>
      )
    },
    { key: 'description', label: 'Description' },
    {
      key: 'amount',
      label: 'Amount',
      render: (amount: number) => (
        <span className={`font-medium ${
          amount > 0 ? 'text-green-600' : 'text-red-600'
        }`}>
          {formatCurrency(Math.abs(amount))}
        </span>
      )
    },
    {
      key: 'date',
      label: 'Date',
      render: (date: string) => formatDate(date)
    }
  ];

  const calculateProgress = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Savings</h1>
          <p className="text-gray-600">Manage your savings goals and track progress</p>
        </div>
        <div className="flex space-x-3">
          <button 
            onClick={() => setShowTransactionForm(true)}
            className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Transaction</span>
          </button>
          <button 
            onClick={() => setShowNewGoalForm(true)}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Target className="w-4 h-4" />
            <span>New Goal</span>
          </button>
        </div>
      </div>

      {/* Savings Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard
          title="Total Savings"
          value={formatCurrency(accountSummary?.totalSavings || 0)}
          icon={PiggyBank}
          trend={{ value: 12.5, isPositive: true }}
        />
        <DashboardCard
          title="Monthly Contribution"
          value={formatCurrency(accountSummary?.monthlyContribution || 0)}
          icon={TrendingUp}
          trend={{ value: 8.1, isPositive: true }}
        />
        <DashboardCard
          title="Interest Earned"
          value={formatCurrency(accountSummary?.interestEarned || 0)}
          icon={DollarSign}
          trend={{ value: 15.3, isPositive: true }}
        />
        <DashboardCard
          title="Active Goals"
          value={savingsGoals.filter(goal => goal.status === 'active').length}
          icon={Target}
        />
      </div>

      {/* Savings Chart */}
      <SavingsChart />

      {/* Savings Goals */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Savings Goals</h3>
              <p className="text-gray-600">Track progress towards your financial objectives</p>
            </div>
          </div>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savingsGoals.map((goal) => {
              const progress = calculateProgress(goal.currentAmount, goal.targetAmount);
              const isCompleted = goal.status === 'completed';
              
              return (
                <div key={goal.id} className="bg-gray-50 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold text-gray-900">{goal.name}</h4>
                    <div className="flex space-x-2">
                      <button className="p-1 text-gray-400 hover:text-blue-600">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-1 text-gray-400 hover:text-red-600">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Progress</span>
                      <span className="font-medium">{progress.toFixed(1)}%</span>
                    </div>
                    
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${
                          isCompleted ? 'bg-green-500' : 'bg-blue-600'
                        }`}
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">
                        {formatCurrency(goal.currentAmount)}
                      </span>
                      <span className="text-gray-600">
                        {formatCurrency(goal.targetAmount)}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                      <div className="flex items-center space-x-1 text-sm text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(goal.deadline)}</span>
                      </div>
                      <Badge 
                        variant={
                          goal.status === 'completed' ? 'success' : 
                          goal.status === 'active' ? 'info' : 'warning'
                        }
                        size="sm"
                      >
                        {goal.status.charAt(0).toUpperCase() + goal.status.slice(1)}
                      </Badge>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Recent Transactions</h3>
              <p className="text-gray-600">Your latest savings activities</p>
            </div>
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              View all
            </button>
          </div>
        </div>
        <div className="p-6">
          <Table columns={transactionColumns} data={recentTransactions} />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-2">Quick Deposit</h3>
              <p className="text-blue-100 text-sm mb-4">Add money to your savings account</p>
              <button className="bg-white text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors">
                Make Deposit
              </button>
            </div>
            <PiggyBank className="w-12 h-12 text-blue-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-2">Auto-Save Setup</h3>
              <p className="text-green-100 text-sm mb-4">Set up automatic monthly transfers</p>
              <button className="bg-white text-green-600 px-4 py-2 rounded-lg hover:bg-green-50 transition-colors">
                Setup Auto-Save
              </button>
            </div>
            <TrendingUp className="w-12 h-12 text-green-200" />
          </div>
        </div>
      </div>

      {/* Modal Forms would go here */}
      {showNewGoalForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Create New Savings Goal</h3>
            <p className="text-gray-600 mb-4">This feature will be implemented with backend integration.</p>
            <button 
              onClick={() => setShowNewGoalForm(false)}
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {showTransactionForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Add Transaction</h3>
            <p className="text-gray-600 mb-4">This feature will be implemented with backend integration.</p>
            <button 
              onClick={() => setShowTransactionForm(false)}
              className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}