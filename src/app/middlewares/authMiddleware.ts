import { Middleware } from '@reduxjs/toolkit';

const authMiddleware: Middleware = (storeAPI) => (next) => (action) => {
    const getCookie = (name: string): string | null => {
        const matches = document.cookie.match(new RegExp(
            `(?:^|; )${name.replace(/([.$?*|{}()[\]\\/+^])/g, '\\$1')}=([^;]*)`
        ));
        return matches ? decodeURIComponent(matches[1]) : null;
    };

    if (action.type === 'auth/checkAuth') {
        const token = getCookie('ACCESS_TOKEN');
        // TODO: ajouter vérification si le token est expiré pour le renouveler
        if (token) {
            storeAPI.dispatch({ type: 'auth/loginSuccess', payload: token });
        } else {
            storeAPI.dispatch({ type: 'auth/redirectToLogin' });
            return;
        }
    }
    return next(action);
};

export default authMiddleware;