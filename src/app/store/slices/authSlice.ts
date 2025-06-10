import { createSlice } from "@reduxjs/toolkit";
import { getUnencodedCookie } from "../../../helpers/cookieHelper.ts";
import { cookieConstants } from "../../constants/cookieConstants.ts";

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
      state.accessToken = getUnencodedCookie(cookieConstants.accessToken);
      state.isAuthenticated = true;
      state.shouldRedirect = false;
    },
    redirectToLogin(state) {
      state.accessToken = null;
      state.isAuthenticated = false;
      state.shouldRedirect = true;
    },
    logoutSuccess: (state) => {
      state.accessToken = null;
      state.isAuthenticated = false;
      state.shouldRedirect = false;
    },
  },
});

export const selectAccessToken = (state: { auth: AuthState }) =>
  state.auth.accessToken;
export const selectIsAuthenticated = (state: { auth: AuthState }) =>
  state.auth.isAuthenticated;

export const { loginSuccess, logoutSuccess, redirectToLogin } =
  authSlice.actions;

export default authSlice.reducer;
