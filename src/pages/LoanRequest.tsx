import React from 'react';
import { FileText, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import LoanRequestForm from '../components/forms/LoanRequestForm';
import Table from '../components/layout/Table';
import Badge from '../components/layout/Badge';
import { useData } from '../context/DataContext';
import { formatCurrency, formatDate } from '../utils/formatters';

export default function LoanRequest() {
  const { loanData = [] } = useData();

  const loanColumns = [
    { key: 'id', label: 'ID' },
    {
      key: 'amount',
      label: 'Amount',
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
      key: 'requestDate',
      label: 'Request Date',
      render: (date: string) => formatDate(date)
    },
    {
      key: 'monthlyPayment',
      label: 'Monthly Payment',
      render: (payment: number) => formatCurrency(payment)
    }
  ];

  const statusIcons = {
    pending: Clock,
    approved: CheckCircle,
    rejected: AlertCircle,
    active: FileText,
    completed: CheckCircle
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Loan Request</h1>
        <p className="text-gray-600">Apply for a new loan or track existing applications</p>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {Object.entries(
          loanData.reduce((acc, loan) => {
            acc[loan.status] = (acc[loan.status] || 0) + 1;
            return acc;
          }, {} as Record<string, number>)
        ).map(([status, count]) => {
          const Icon = statusIcons[status as keyof typeof statusIcons] || FileText;
          return (
            <div key={status} className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <Icon className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">{status.charAt(0).toUpperCase() + status.slice(1)}</p>
                  <p className="text-xl font-semibold text-gray-900">{count}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* New Loan Request Form */}
      <div>
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">New Loan Application</h2>
          <p className="text-gray-600">Fill out the form below to request a new loan</p>
        </div>
        <LoanRequestForm />
      </div>

      {/* Existing Loans */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Your Loan Applications</h3>
          <p className="text-gray-600">Track the status of your loan requests</p>
        </div>
        <div className="p-6">
          <Table columns={loanColumns} data={loanData} />
        </div>
      </div>

      {/* Loan Guidelines */}
      <div className="bg-blue-50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-4">Loan Guidelines</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-blue-800 mb-2">Eligibility Requirements</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Active savings account for at least 6 months</li>
              <li>• Regular monthly contributions</li>
              <li>• Valid employment or income proof</li>
              <li>• Good credit history</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-blue-800 mb-2">Loan Limits</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Minimumd: 50,000 RWF</li>
              <li>• Maximum: Based on savings & credit score</li>
              <li>• Duration: 6 to 60 months</li>
              <li>• Interest rate: 10-15% annually</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}