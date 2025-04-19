import { createContext, useContext, useMemo } from "react";
import { useCookieStorage } from "./useCookieStorage.tsx";
import {useCookies} from "react-cookie";
import {LoginDto, LoginResponse, useLoginMutation} from "../api/auth/auth.api.ts";
import * as React from "react";

interface AuthContextType {
    token: string | null;
    login: (data: LoginDto) => Promise<LoginResponse>;
    logout: () => void;
}
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: {children: React.ReactNode}) => {
    const [token, setToken] = useCookieStorage("token", '');
    const [cookies, setCookie] = useCookies(['ACCESS_TOKEN', 'REFRESH_TOKEN']);
    const [loginRequest] = useLoginMutation();

    const login = async (credentials: LoginDto) => {
        const response = await loginRequest(credentials);

        if (response.data?.accessToken) {
            setCookie('ACCESS_TOKEN', response.data.accessToken);
            setCookie('REFRESH_TOKEN', response.data.refreshToken);
            return response.data;
        } else {
            throw new Error("Invalid login response");
        }
    };

    const logout = () => {
        setToken('');
        setCookie('ACCESS_TOKEN', '', { path: '/', maxAge: -1 });
        setCookie('REFRESH_TOKEN', '', { path: '/', maxAge: -1 });
    };

    const value = useMemo(
        () => ({
            token,
            isAuthenticated: !!token,
            login,
            logout,
        }),
        [token]
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