interface ValidationResult {
  isValid: boolean;
  message?: string;
}

export const validateEmail = (email: string): ValidationResult => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!email) {
    return { isValid: false, message: 'Email is required' };
  }
  
  if (!emailRegex.test(email)) {
    return { isValid: false, message: 'Please enter a valid email address' };
  }
  
  return { isValid: true };
};

export const validatePassword = (password: string): ValidationResult => {
  if (!password) {
    return { isValid: false, message: 'Password is required' };
  }
  
  if (password.length < 6) {
    return { isValid: false, message: 'Password must be at least 6 characters long' };
  }
  
  return { isValid: true };
};

export const validateLoanAmount = (amount: number, maxAmount: number): ValidationResult => {
  if (!amount || amount <= 0) {
    return { isValid: false, message: 'Loan amount is required and must be greater than 0' };
  }
  
  if (amount > maxAmount) {
    return { isValid: false, message: `Loan amount cannot exceed ${maxAmount.toLocaleString()} RWF` };
  }
  
  return { isValid: true };
};

export const validateLoanDuration = (duration: number): ValidationResult => {
  if (!duration || duration < 1) {
    return { isValid: false, message: 'Duration must be at least 1 month' };
  }
  
  if (duration > 60) {
    return { isValid: false, message: 'Duration cannot exceed 60 months' };
  }
  
  return { isValid: true };
};