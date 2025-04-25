import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
    accessToken: string | null;
    isAuthenticated: boolean;
    shouldRedirect: boolean;
}

const initialState: AuthState = {
    accessToken: null,
    isAuthenticated: false,
    shouldRedirect: false,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        loginSuccess: (state, action: PayloadAction<string>) => {
            state.accessToken = action.payload;
            state.isAuthenticated = true;
        },
        redirectToLogin(state) {
            state.shouldRedirect = true;
        },
        logout: (state) => {
            state.accessToken = null;
            state.isAuthenticated = false;
        },
    },
});

export const selectAccessToken = (state: { auth: AuthState }) => state.auth.accessToken;
export const selectIsAuthenticated = (state: { auth: AuthState }) => state.auth.isAuthenticated;


export const {
    loginSuccess,
    logout,
    redirectToLogin,
} = authSlice.actions;

export default authSlice.reducer;
