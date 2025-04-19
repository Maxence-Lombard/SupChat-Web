import { Middleware } from '@reduxjs/toolkit';

const authMiddleware: Middleware = (storeAPI) => (next) => (action) => {
    const getCookie = (name: string): string | null => {
        const matches = document.cookie.match(new RegExp(
            `(?:^|; )${name.replace(/([.$?*|{}()[\]\\/+^])/g, '\\$1')}=([^;]*)`
        ));
        return matches ? decodeURIComponent(matches[1]) : null;
    };

    const token = getCookie('ACCESS_TOKEN');
    //TODO: ajouter verif si le token est expiré pr le renouveler

    if (token) {
        storeAPI.dispatch({ type: 'auth/setToken', payload: token });
    }

    return next(action);
};

export default authMiddleware;