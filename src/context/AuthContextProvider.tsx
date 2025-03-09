import React, { useState } from 'react';
import { AuthContext } from './AuthContext';
import { Admin, Tokens } from '../types';
import { apiRequest } from '../lib/apiHelper';
import Cookies from 'js-cookie';

interface LoginResponse {
  authTokens: Tokens;
  admin: Admin;
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [admin, setAdmin] = useState<Admin | null>(() => {
    const savedAdmin = Cookies.get('admin');
    return savedAdmin ? JSON.parse(savedAdmin) : null;
  });
  const [tokens, setTokens] = useState<Tokens | null>(() => Cookies.get('tokens') as unknown as Tokens);

  const logIn = async (emailAddress: string, password: string) => {
    try {
      const { data } = await apiRequest<LoginResponse>({
        url: '/api/admins/login',
        method: 'POST',
        data: { emailAddress, password },
        handleTokens: true,
      });
      const epochTime = data.authTokens.access.expires;
      
      Cookies.set('tokens', JSON.stringify(data.authTokens), { expires: new Date(epochTime * 1000) });
      Cookies.set('admin', JSON.stringify(data.admin), { expires: new Date(epochTime * 1000) });
      setAdmin(data.admin);
      setTokens(data.authTokens);
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
    Cookies.remove('tokens');
    Cookies.remove('admin');
    setAdmin(null);
    setTokens(null);
  };

  return (
    <AuthContext.Provider value={{ admin, tokens, logIn, register, logOut }}>
      {children}
    </AuthContext.Provider>
  );
};
