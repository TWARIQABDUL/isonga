import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Check, CreditCard, FileText, Calculator } from 'lucide-react';
import { validateLoanAmount, validateLoanDuration } from '../../utils/validators';
import { formatCurrency, calculateMonthlyPayment } from '../../utils/formatters';
import { useData } from '../../context/DataContext';
import axios from 'axios';

interface LoanFormData {
  amount: number;
  purpose: string;
  duration: number;
  income: number;
  employment: string;
  termsAccepted: boolean;
}

const loanPurposes = [
  'Business Investment',
  'Education',
  'Home Improvement',
  'Medical Emergency',
  'Debt Consolidation',
  'Agriculture',
  'Other'
];

const steps = [
  { id: 1, name: 'Loan Details', icon: CreditCard },
  { id: 2, name: 'Personal Info', icon: FileText },
  { id: 3, name: 'Review', icon: Calculator }
];

export default function LoanRequestForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<LoanFormData>({
    amount: 1000,
    purpose: '',
    duration: 12,
    income: 0,
    employment: '',
    termsAccepted: false
  });
  const baseUrl = import.meta.env.VITE_API_URL;
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { accountSummary } = useData();

  const maxLoanAmount = accountSummary?.totalSavings;
  const interestRate = 5; // 5% annual interest rate

  const monthlyPayment = formData.amount > 0 && formData.duration > 0
    ? calculateMonthlyPayment(formData.amount, interestRate, formData.duration)
    : 0;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const { checked } = e.target as HTMLInputElement;

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'number' ? Number(value) : value
    }));

    // Clear errors when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateStep = (step: number) => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      const amountValidation = validateLoanAmount(formData.amount, maxLoanAmount ?? 0);
      if (!amountValidation.isValid) {
        newErrors.amount = amountValidation.message!;
      }

      if (!formData.purpose) {
        newErrors.purpose = 'Please select a loan purpose';
      }

      const durationValidation = validateLoanDuration(formData.duration);
      if (!durationValidation.isValid) {
        newErrors.duration = durationValidation.message!;
      }
    }

    if (step === 2) {
      if (!formData.income || formData.income <= 0) {
        newErrors.income = 'Monthly income is required';
      }

      if (!formData.employment) {
        newErrors.employment = 'Employment status is required';
      }
    }

    if (step === 3) {
      if (!formData.termsAccepted) {
        newErrors.termsAccepted = 'You must accept the terms and conditions';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 3));
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (validateStep(3)) {
      setIsSubmitting(true);

      // Simulate API call
      try {
        const submit = await axios.post(`${baseUrl}/loans`, {
          amount: formData.amount,
          purpose: formData.purpose,
          duration: formData.duration,
          interestRate: 5
        },
          {
            headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('user') || '{}')?.token}` }
          }
        )
        const resp = await submit.data;
        console.log("Loan request response:", resp);

      } catch (error) {
        console.log("Error submitting loan request:", error);
        alert(error.response?.data?.message || 'Failed to submit loan request. Please try again later.');
        setIsSubmitting(false);
        
      }

      // await new Promise(resolve => setTimeout(resolve, 2000));

      // setIsSubmitting(false);
      // alert('Loan request submitted successfully! You will receive a confirmation email shortly.');

      // Reset form
      setFormData({
        amount: 1000,
        purpose: '',
        duration: 12,
        income: 0,
        employment: '',
        termsAccepted: false
      });
      setCurrentStep(1);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className={`
                flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors
                ${currentStep > step.id
                  ? 'bg-green-500 border-green-500 text-white'
                  : currentStep === step.id
                    ? 'bg-blue-600 border-blue-600 text-white'
                    : 'bg-white border-gray-300 text-gray-500'
                }
              `}>
                {currentStep > step.id ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <step.icon className="w-5 h-5" />
                )}
              </div>
              <div className="ml-3">
                <p className={`text-sm font-medium ${currentStep >= step.id ? 'text-gray-900' : 'text-gray-500'
                  }`}>
                  {step.name}
                </p>
              </div>
              {index < steps.length - 1 && (
                <div className={`w-20 h-0.5 mx-4 ${currentStep > step.id ? 'bg-green-500' : 'bg-gray-300'
                  }`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Form Content */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        {currentStep === 1 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">Loan Details</h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Loan Amount (RWF)
              </label>
              <input
                type="range"
                name="amount"
                value={formData.amount}
                min="1000"
                max={maxLoanAmount}
                step="500"
                onChange={handleInputChange}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="flex justify-between text-sm text-gray-500 mt-1">
                <span>1000</span>
                <span className="font-medium text-blue-600">{formatCurrency(formData.amount)}</span>
                <span>{formatCurrency(maxLoanAmount ?? 0)}</span>
              </div>
              {errors.amount && <p className="mt-1 text-sm text-red-600">{errors.amount}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Purpose
              </label>
              <select
                name="purpose"
                value={formData.purpose}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.purpose ? 'border-red-300' : 'border-gray-300'
                  }`}
              >
                <option value="">Select loan purpose</option>
                {loanPurposes.map(purpose => (
                  <option key={purpose} value={purpose}>{purpose}</option>
                ))}
              </select>
              {errors.purpose && <p className="mt-1 text-sm text-red-600">{errors.purpose}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Duration (months)
              </label>
              <select
                name="duration"
                value={formData.duration}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.duration ? 'border-red-300' : 'border-gray-300'
                  }`}
              >
                {[1, 2, 3].map(months => (
                  <option key={months} value={months}>{months} months</option>
                ))}
              </select>
              {errors.duration && <p className="mt-1 text-sm text-red-600">{errors.duration}</p>}
            </div>

            {formData.amount > 0 && formData.duration > 0 && (
              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="font-medium text-blue-900 mb-2">Loan Summary</h3>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-blue-700">Monthly Payment:</span>
                    <span className="font-medium">{formatCurrency(monthlyPayment)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-700">Interest Rate:</span>
                    <span className="font-medium">{interestRate}% annually</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">Personal Information</h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Monthly Income (RWF)
              </label>
              <input
                type="number"
                name="income"
                value={formData.income}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.income ? 'border-red-300' : 'border-gray-300'
                  }`}
                placeholder="Enter your monthly income"
              />
              {errors.income && <p className="mt-1 text-sm text-red-600">{errors.income}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Employment Status
              </label>
              <select
                name="employment"
                value={formData.employment}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.employment ? 'border-red-300' : 'border-gray-300'
                  }`}
              >
                <option value="">Select employment status</option>
                <option value="employed">Employed</option>
                <option value="self-employed">Self-employed</option>
                <option value="business-owner">Business Owner</option>
                <option value="farmer">Farmer</option>
                <option value="other">Other</option>
              </select>
              {errors.employment && <p className="mt-1 text-sm text-red-600">{errors.employment}</p>}
            </div>

            {formData.income > 0 && monthlyPayment > 0 && (
              <div className="bg-yellow-50 rounded-lg p-4">
                <h3 className="font-medium text-yellow-900 mb-2">Affordability Check</h3>
                <div className="text-sm">
                  <div className="flex justify-between mb-1">
                    <span className="text-yellow-700">Monthly Income:</span>
                    <span className="font-medium">{formatCurrency(formData.income)}</span>
                  </div>
                  <div className="flex justify-between mb-1">
                    <span className="text-yellow-700">Monthly Payment:</span>
                    <span className="font-medium">{formatCurrency(monthlyPayment)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-yellow-700">Payment Ratio:</span>
                    <span className={`font-medium ${(monthlyPayment / formData.income) * 100 > 30 ? 'text-red-600' : 'text-green-600'
                      }`}>
                      {((monthlyPayment / formData.income) * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">Review & Submit</h2>

            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Loan Amount:</span>
                <span className="font-medium">{formatCurrency(formData.amount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Purpose:</span>
                <span className="font-medium">{formData.purpose}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Duration:</span>
                <span className="font-medium">{formData.duration} months</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Monthly Payment:</span>
                <span className="font-medium">{formatCurrency(monthlyPayment)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Interest Rate:</span>
                <span className="font-medium">{interestRate}% annually</span>
              </div>
            </div>

            <div className="border-t pt-4">
              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  name="termsAccepted"
                  checked={formData.termsAccepted}
                  onChange={handleInputChange}
                  className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <div className="text-sm">
                  <label className="text-gray-700">
                    I agree to the{' '}
                    <button type="button" className="text-blue-600 hover:text-blue-500">
                      terms and conditions
                    </button>{' '}
                    and understand the loan repayment terms.
                  </label>
                </div>
              </div>
              {errors.termsAccepted && <p className="mt-1 text-sm text-red-600">{errors.termsAccepted}</p>}
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8 pt-4 border-t">
          <button
            type="button"
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          {currentStep < 3 ? (
            <button
              type="button"
              onClick={handleNext}
              className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <span>Next</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex items-center space-x-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Submitting...</span>
                </>
              ) : (
                <span>Submit Application</span>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}