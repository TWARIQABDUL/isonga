import  { createContext, useContext, useState, useEffect, ReactNode } from 'react';
// import { useNavigate } from "react-router-dom";

interface User {
  id: string;
  name: string;
  email: string;
  joinedDate: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const mockUser: User = {
  id: '1',
  name: 'Twariki Abdalazizi',
  email: 'twariqabdalazizi@gmail.com',
  joinedDate: '2023-01-15',
  avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop'
};
interface CheckEmailValidation {
  isValid: boolean;
}
const checkEmail = (email:String):CheckEmailValidation=>{
  return {
    isValid: email === mockUser.email
  };
}
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // const navigate = useNavigate();
  useEffect(() => {
    // Check for stored auth state
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock authentication - accept any email/password for demo
    if (checkEmail(email) && password==='123456') {
      setUser(mockUser);

      localStorage.setItem('user', JSON.stringify(mockUser));
      setIsLoading(false);
      console.log("succesful login");
      // navigate("/")
      return true;
    }
    
    setIsLoading(false);
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      login,
      logout,
      isLoading
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}