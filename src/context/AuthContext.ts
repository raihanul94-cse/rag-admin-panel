import { createContext, useContext } from 'react';
import { Admin, Tokens } from '../types';

interface AuthContextType {
  admin: Admin | null;
  tokens: Tokens | null;
  logIn: (emailAddress: string, password: string) => Promise<void>;
  register: (emailAddress: string, password: string) => Promise<void>;
  logOut: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  admin: null,
  tokens: null,
  logIn: async () => {},
  register: async () => {},
  logOut: () => {},
});

export const useAuth = () => useContext(AuthContext);