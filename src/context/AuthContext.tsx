import React, { createContext, useContext, useEffect, useState } from 'react';
import { fetchAuthSession, getCurrentUser, signIn, signOut, signUp } from 'aws-amplify/auth';
import { User } from '../types';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  loginWithEmailPassword: (email: string, password: string) => Promise<void>;
  signUpWithEmailPassword: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const cognitoUser = await getCurrentUser();
      const session = await fetchAuthSession();
      const email = cognitoUser.signInDetails?.loginId || '';
      const userData: User = {
        id: cognitoUser.userId,
        email,
        name: email.split('@')[0],
        role: 'student',
        createdAt: new Date().toISOString(),
        preferences: {
          theme: 'light',
          notifications: {
            email: true,
            sms: false,
            push: true,
          },
        },
      };
      setUser(userData);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const loginWithEmailPassword = async (email: string, password: string) => {
    await signIn({ username: email, password });
    await checkUser();
    navigate('/tasks');
  };

  const signUpWithEmailPassword = async (email: string, password: string) => {
    await signUp({ username: email, password });
    navigate('/login');
  };

  const logout = async () => {
    await signOut();
    setUser(null);
    navigate('/login');
  };

  const value = {
    user,
    loading,
    loginWithEmailPassword,
    signUpWithEmailPassword,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
