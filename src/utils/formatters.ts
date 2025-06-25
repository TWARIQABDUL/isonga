export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('rw-RW', {
    style: 'currency',
    currency: 'RWF',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(date);
};

export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat().format(num);
};

export const calculateLoanInterest = (principal: number, rate: number, months: number): number => {
  const monthlyRate = rate / 100 / 12;
  return principal * monthlyRate * months;
};

export const calculateMonthlyPayment = (principal: number, rate: number, months: number): number => {
  const monthlyRate = rate / 100 / 12;
  return (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) / 
         (Math.pow(1 + monthlyRate, months) - 1);
};