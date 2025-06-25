import React, { useState } from 'react';
import { 
  TrendingUp, 
  BarChart3, 
  PieChart, 
  Calendar,
  Download,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  Target,
  DollarSign
} from 'lucide-react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell } from 'recharts';
import DashboardCard from '../components/layout/DashboardCard';
import { useData } from '../context/DataContext';
import { formatCurrency, formatDate } from '../utils/formatters';

export default function Analytics() {
  const { savingsData, loansData, activityLogs, accountSummary } = useData();
  const [dateRange, setDateRange] = useState('12months');
  const [selectedMetric, setSelectedMetric] = useState('savings');

  // Enhanced analytics data
  const monthlyComparison = [
    { month: 'Jan', savings: 250000, loans: 0, netWorth: 250000 },
    { month: 'Feb', savings: 420000, loans: 0, netWorth: 420000 },
    { month: 'Mar', savings: 380000, loans: 0, netWorth: 380000 },
    { month: 'Apr', savings: 520000, loans: 500000, netWorth: 20000 },
    { month: 'May', savings: 680000, loans: 480000, netWorth: 200000 },
    { month: 'Jun', savings: 750000, loans: 460000, netWorth: 290000 },
    { month: 'Jul', savings: 920000, loans: 440000, netWorth: 480000 },
    { month: 'Aug', savings: 1100000, loans: 420000, netWorth: 680000 },
    { month: 'Sep', savings: 1250000, loans: 400000, netWorth: 850000 },
    { month: 'Oct', savings: 1420000, loans: 380000, netWorth: 1040000 },
    { month: 'Nov', savings: 1580000, loans: 360000, netWorth: 1220000 },
    { month: 'Dec', savings: 1750000, loans: 355200, netWorth: 1394800 }
  ];

  const categoryBreakdown = [
    { name: 'Emergency Fund', value: 35, amount: 612500, color: '#3B82F6' },
    { name: 'Investments', value: 25, amount: 437500, color: '#10B981' },
    { name: 'Education', value: 20, amount: 350000, color: '#F59E0B' },
    { name: 'Vacation', value: 12, amount: 210000, color: '#EF4444' },
    { name: 'Other', value: 8, amount: 140000, color: '#8B5CF6' }
  ];

  const performanceMetrics = [
    {
      title: 'Savings Growth Rate',
      value: '12.5%',
      change: '+2.3%',
      isPositive: true,
      description: 'Monthly average growth'
    },
    {
      title: 'Loan Repayment Rate',
      value: '98.2%',
      change: '+0.8%',
      isPositive: true,
      description: 'On-time payment percentage'
    },
    {
      title: 'Interest Earned',
      value: formatCurrency(87500),
      change: '+15.3%',
      isPositive: true,
      description: 'This year total'
    },
    {
      title: 'Net Worth Growth',
      value: formatCurrency(1394800),
      change: '+45.2%',
      isPositive: true,
      description: 'Year over year'
    }
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}: {formatCurrency(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-600">Comprehensive financial insights and trends</p>
        </div>
        <div className="flex space-x-3">
          <select 
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="3months">Last 3 Months</option>
            <option value="6months">Last 6 Months</option>
            <option value="12months">Last 12 Months</option>
            <option value="24months">Last 24 Months</option>
          </select>
          <button className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            <Download className="w-4 h-4" />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {performanceMetrics.map((metric, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-600">{metric.title}</h3>
              <div className={`flex items-center space-x-1 text-sm ${
                metric.isPositive ? 'text-green-600' : 'text-red-600'
              }`}>
                {metric.isPositive ? (
                  <ArrowUpRight className="w-4 h-4" />
                ) : (
                  <ArrowDownRight className="w-4 h-4" />
                )}
                <span>{metric.change}</span>
              </div>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 mb-1">{metric.value}</p>
              <p className="text-sm text-gray-500">{metric.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Financial Trends Chart */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Financial Trends</h3>
              <p className="text-gray-600">Track your savings, loans, and net worth over time</p>
            </div>
            <div className="flex space-x-2">
              <button 
                onClick={() => setSelectedMetric('savings')}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                  selectedMetric === 'savings' 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Savings
              </button>
              <button 
                onClick={() => setSelectedMetric('loans')}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                  selectedMetric === 'loans' 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Loans
              </button>
              <button 
                onClick={() => setSelectedMetric('networth')}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                  selectedMetric === 'networth' 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Net Worth
              </button>
            </div>
          </div>
        </div>
        
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={monthlyComparison}>
              <defs>
                <linearGradient id="savingsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1}/>
                </linearGradient>
                <linearGradient id="loansGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#EF4444" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#EF4444" stopOpacity={0.1}/>
                </linearGradient>
                <linearGradient id="networthGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
              <YAxis stroke="#6b7280" fontSize={12} tickFormatter={(value) => `${(value / 1000)}K`} />
              <Tooltip content={<CustomTooltip />} />
              
              {selectedMetric === 'savings' && (
                <Area
                  type="monotone"
                  dataKey="savings"
                  stroke="#3B82F6"
                  strokeWidth={2}
                  fill="url(#savingsGradient)"
                />
              )}
              {selectedMetric === 'loans' && (
                <Area
                  type="monotone"
                  dataKey="loans"
                  stroke="#EF4444"
                  strokeWidth={2}
                  fill="url(#loansGradient)"
                />
              )}
              {selectedMetric === 'networth' && (
                <Area
                  type="monotone"
                  dataKey="netWorth"
                  stroke="#10B981"
                  strokeWidth={2}
                  fill="url(#networthGradient)"
                />
              )}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Savings Category Breakdown */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Savings Allocation</h3>
            <p className="text-gray-600">How your savings are distributed across categories</p>
          </div>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPieChart>
                <Pie
                  data={categoryBreakdown}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: any, name: any, props: any) => [
                    `${value}% (${formatCurrency(props.payload.amount)})`,
                    name
                  ]}
                />
              </RechartsPieChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            {categoryBreakdown.map((category, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: category.color }}
                ></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{category.name}</p>
                  <p className="text-xs text-gray-500">{category.value}%</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Monthly Activity Comparison */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Monthly Activity</h3>
            <p className="text-gray-600">Compare deposits, withdrawals, and loan payments</p>
          </div>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyComparison.slice(-6)}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
                <YAxis stroke="#6b7280" fontSize={12} tickFormatter={(value) => `${(value / 1000)}K`} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="savings" fill="#3B82F6" name="Savings" radius={[4, 4, 0, 0]} />
                <Bar dataKey="loans" fill="#EF4444" name="Loans" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Financial Goals Progress */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Financial Goals Progress</h3>
          <p className="text-gray-600">Track your progress towards key financial milestones</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-blue-900">Emergency Fund</h4>
              <Target className="w-5 h-5 text-blue-600" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-blue-700">Progress</span>
                <span className="font-medium">87.5%</span>
              </div>
              <div className="w-full bg-blue-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '87.5%' }}></div>
              </div>
              <div className="flex justify-between text-sm text-blue-700">
                <span>{formatCurrency(1750000)}</span>
                <span>{formatCurrency(2000000)}</span>
              </div>
            </div>
          </div>

          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-green-900">Debt Reduction</h4>
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-green-700">Progress</span>
                <span className="font-medium">64.5%</span>
              </div>
              <div className="w-full bg-green-200 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: '64.5%' }}></div>
              </div>
              <div className="flex justify-between text-sm text-green-700">
                <span>{formatCurrency(355200)}</span>
                <span>{formatCurrency(1000000)}</span>
              </div>
            </div>
          </div>

          <div className="bg-purple-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-purple-900">Investment Goal</h4>
              <DollarSign className="w-5 h-5 text-purple-600" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-purple-700">Progress</span>
                <span className="font-medium">43.8%</span>
              </div>
              <div className="w-full bg-purple-200 rounded-full h-2">
                <div className="bg-purple-600 h-2 rounded-full" style={{ width: '43.8%' }}></div>
              </div>
              <div className="flex justify-between text-sm text-purple-700">
                <span>{formatCurrency(437500)}</span>
                <span>{formatCurrency(1000000)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Insights and Recommendations */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
        <h3 className="text-lg font-semibold text-blue-900 mb-4">AI-Powered Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-blue-800 mb-2">Key Insights</h4>
            <ul className="text-sm text-blue-700 space-y-2">
              <li>• Your savings growth rate is 15% above average</li>
              <li>• Consider increasing emergency fund to 6 months expenses</li>
              <li>• Loan repayment is on track - consider extra payments</li>
              <li>• Investment allocation could be optimized for better returns</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-blue-800 mb-2">Recommendations</h4>
            <ul className="text-sm text-blue-700 space-y-2">
              <li>• Increase monthly savings by 10% to reach goals faster</li>
              <li>• Consider refinancing high-interest loans</li>
              <li>• Diversify savings across different investment vehicles</li>
              <li>• Set up automatic transfers to maintain consistency</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}