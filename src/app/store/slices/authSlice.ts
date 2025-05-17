import { createSlice } from "@reduxjs/toolkit";
import { getCookie } from "../../../helpers/cookieHelper.ts";

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
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (state) => {
      state.accessToken = getCookie("ACCESS_TOKEN");
      state.isAuthenticated = true;
    },
    redirectToLogin(state) {
      state.shouldRedirect = false;
    },
    logout: (state) => {
      state.accessToken = null;
      state.isAuthenticated = false;
    },
  },
});

export const selectAccessToken = (state: { auth: AuthState }) =>
  state.auth.accessToken;
export const selectIsAuthenticated = (state: { auth: AuthState }) =>
  state.auth.isAuthenticated;

export const { loginSuccess, logout, redirectToLogin } = authSlice.actions;

export default authSlice.reducer;
