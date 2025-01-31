import React, { useState } from 'react';
import { AuthContext } from './AuthContext';
import { Admin, Tokens } from '../types';
import { apiRequest } from '../lib/apiHelper';

interface LoginResponse {
  tokens: Tokens;
  admin: Admin;
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [admin, setAdmin] = useState<Admin | null>(() => {
    const savedAdmin = localStorage.getItem('admin');
    return savedAdmin ? JSON.parse(savedAdmin) : null;
  });
  const [tokens, setTokens] = useState<Tokens | null>(() => localStorage.getItem('tokens') as unknown as Tokens);

  const logIn = async (emailAddress: string, password: string) => {
    try {
      const { data } = await apiRequest<LoginResponse>({
        url: '/api/admins/login',
        method: 'POST',
        data: { emailAddress, password },
        handleTokens: true,
      });

      localStorage.setItem('tokens', JSON.stringify(data.tokens));
      localStorage.setItem('admin', JSON.stringify(data.admin));
      setAdmin(data.admin);
      setTokens(data.tokens);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to log in');
    }
  };

  const register = async (emailAddress: string, password: string) => {
    try {
      await apiRequest<Response>({
        url: '/api/admins',
        method: 'POST',
        data: { emailAddress, password },
        handleTokens: true,
      });
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to register');
    }
  };

  const logOut = () => {
    localStorage.removeItem('tokens');
    localStorage.removeItem('admin');
    setAdmin(null);
    setTokens(null);
  };

  return (
    <AuthContext.Provider value={{ admin, tokens, logIn, register, logOut }}>
      {children}
    </AuthContext.Provider>
  );
};
