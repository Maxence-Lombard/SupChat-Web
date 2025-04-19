// useCookieStorage.ts
import { useCookies } from 'react-cookie';

export const useCookieStorage = (key: string, defaultValue: string) => {
    const [cookies, setCookie, removeCookie] = useCookies([key]);

    const value = cookies[key] ?? defaultValue;

    const setValue = (newValue: string, options: Record<string, never> = {}) => {
        setCookie(key, newValue, {
            path: '/',
            sameSite: 'strict',
            ...options,
        });
    };

    const clear = () => {
        removeCookie(key, { path: '/' });
    };

    return [value, setValue, clear] as const;
};
