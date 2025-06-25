import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { useData } from '../../context/DataContext';
import { formatCurrency } from '../../utils/formatters';

export default function SavingsChart() {
  const { savingsData } = useData();

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900">{label}</p>
          <p className="text-blue-600">
            Actual: {formatCurrency(payload[0].value)}
          </p>
          <p className="text-gray-500">
            Target: {formatCurrency(payload[1].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Savings Progress</h3>
        <p className="text-gray-600">Track your savings growth over time</p>
      </div>
      
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={savingsData}>
            <defs>
              <linearGradient id="savingsGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis 
              dataKey="month" 
              stroke="#6b7280"
              fontSize={12}
            />
            <YAxis 
              stroke="#6b7280"
              fontSize={12}
              tickFormatter={(value) => `${(value / 1000)}K`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="amount"
              stroke="#3B82F6"
              strokeWidth={2}
              fill="url(#savingsGradient)"
            />
            <Line 
              type="monotone" 
              dataKey="target" 
              stroke="#94a3b8" 
              strokeDasharray="5 5"
              strokeWidth={2}
              dot={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 flex items-center justify-center space-x-6 text-sm">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
          <span className="text-gray-600">Actual Savings</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-1 bg-gray-400 rounded-full"></div>
          <span className="text-gray-600">Target Savings</span>
        </div>
      </div>
    </div>
  );
}