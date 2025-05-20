import * as React from "react";
import { createContext, useContext, useMemo } from "react";
import { useCookieStorage } from "./useCookieStorage.tsx";
import { useCookies } from "react-cookie";
import {
  LoginDto,
  LoginResponse,
  useLoginMutation,
} from "../api/auth/auth.api.ts";
import { useDispatch } from "react-redux";
import { logoutSuccess } from "../store/slices/authSlice.ts";
import { cookieConstants } from "../constants/cookieConstants.ts";

interface AuthContextType {
  token: string | null;
  login: (data: LoginDto) => Promise<LoginResponse>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useCookieStorage("token", "");
  const [cookies, setCookie] = useCookies([
    cookieConstants.accessToken,
    cookieConstants.refreshToken,
  ]);
  const [loginRequest] = useLoginMutation();
  const dispatch = useDispatch();

  const login = async (credentials: LoginDto) => {
    const response = await loginRequest(credentials);

    if (response.data?.accessToken) {
      //TODO : ajouter date expiration
      setCookie(cookieConstants.accessToken, response.data.accessToken);
      setCookie(cookieConstants.refreshToken, response.data.refreshToken);
      return response.data;
    } else {
      throw new Error("Invalid login response");
    }
  };

  const logout = () => {
    setToken("");
    dispatch(logoutSuccess());
    setCookie(cookieConstants.accessToken, "", { path: "/", maxAge: -1 });
    setCookie(cookieConstants.refreshToken, "", { path: "/", maxAge: -1 });
  };

  const value = useMemo(
    () => ({
      token,
      isAuthenticated: !!token,
      login,
      logout,
    }),
    [token],
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
