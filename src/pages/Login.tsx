import React from 'react';
import { PiggyBank } from 'lucide-react';
import LoginForm from '../components/forms/LoginForm';

export default function Login() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-4">
            <PiggyBank className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Isonga Savings</h1>
          <p className="text-gray-600">Professional Savings & Loan Management</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Welcome back</h2>
            <p className="text-gray-600">Please sign in to your account</p>
          </div>

          <LoginForm />

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <button className="text-blue-600 hover:text-blue-500 font-medium">
                Contact us to get started
              </button>
            </p>
          </div>
        </div>

        {/* Demo Credentials */}
        <div className="mt-6 bg-blue-50 rounded-lg p-4">
          <h3 className="text-sm font-medium text-blue-900 mb-2">Demo Credentials</h3>
          <div className="text-sm text-blue-800">
            <p>Email: any valid email</p>
            <p>Password: any password (6+ characters)</p>
          </div>
        </div>
      </div>
    </div>
  );
}