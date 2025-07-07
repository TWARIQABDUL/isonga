import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {jwtDecode} from 'jwt-decode';

interface User {
  email: string;
  role: string;
  fullName: string;
  token: string;
}

interface DecodedToken {
  exp: number;
  [key: string]: any;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ✅ Helper to validate token
const isTokenValid = (token: string): boolean => {
  try {
    const decoded: DecodedToken = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    return decoded.exp > currentTime;
  } catch (error) {
    console.error('Invalid token:', error);
    return false;
  }
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const userObj: User = JSON.parse(storedUser);
      if (isTokenValid(userObj.token)) {
        setUser(userObj);
      } else {
        console.warn("Token expired or invalid, logging out.");
        localStorage.removeItem('user');
        setUser(null);
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        console.error("Login failed:", response.status);
        setIsLoading(false);
        return false;
      }

      const data = await response.json();

      const loggedInUser: User = {
        email: data.email,
        role: data.role,
        fullName: data.fullName,
        token: data.token
      };

      if (isTokenValid(loggedInUser.token)) {
        setUser(loggedInUser);
        localStorage.setItem('user', JSON.stringify(loggedInUser));
        console.log("Successful login");
        setIsLoading(false);
        return true;
      } else {
        console.error("Received invalid or expired token during login.");
        setIsLoading(false);
        return false;
      }
    } catch (error) {
      console.error("Login error:", error);
      setIsLoading(false);
      return false;
    }
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
