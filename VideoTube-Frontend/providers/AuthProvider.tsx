import React, { createContext, useState, useEffect, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  login as apiLogin,
  register as apiRegister,
} from "../services/auth/api";

interface AuthContextType {
  userToken: string | null;
  setUserToken: (token: string | null) => void;
  logout: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  register: (
    name: string,
    email: string,
    password: string,
    confirmPassword: string
  ) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
  userToken: null,
  setUserToken: () => {},
  logout: async () => {},
  login: async () => {},
  register: async () => {},
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [userToken, setUserToken] = useState<string | null>(null);

  const loadToken = async () => {
    const token = await AsyncStorage.getItem("token");
    if (token) setUserToken(token);
  };

  useEffect(() => {
    loadToken();
  }, []);

  const logout = async () => {
    await AsyncStorage.removeItem("token");
    setUserToken(null);
  };

  const login = async (email: string, password: string) => {
    const res = await apiLogin(email, password);
    if (res.success && res.token) {
      setUserToken(res.token);
    } else {
      throw new Error(res.message);
    }
  };

  const register = async (
    name: string,
    email: string,
    password: string,
    confirmPassword: string
  ) => {
    const res = await apiRegister(name, email, password, confirmPassword);
    if (res.success && res.token) {
      setUserToken(res.token);
    } else {
      throw new Error(res.message);
    }
  };

  return (
    <AuthContext.Provider
      value={{ userToken, setUserToken, logout, login, register }}
    >
      {children}
    </AuthContext.Provider>
  );
};
