import { Middleware, UnknownAction } from "@reduxjs/toolkit";
import {
  getRawCookie,
  getUnencodedCookie,
  setCookie,
} from "../../helpers/cookieHelper.ts";
import { cookieConstants } from "../constants/cookieConstants.ts";
import { AuthApi, LoginResponse } from "../api/auth/auth.api.ts";

const authMiddleware: Middleware =
  (storeAPI) => (next) => async (action: UnknownAction) => {
    if (action.type === "auth/checkAuth") {
      const token = getUnencodedCookie(cookieConstants.accessToken);
      const refreshToken = getRawCookie(cookieConstants.refreshToken);
      if (refreshToken) {
        if (!token) {
          const result = (await AuthApi.endpoints.refreshToken.initiate(
            refreshToken,
          )(storeAPI.dispatch, storeAPI.getState, undefined)) as {
            data?: LoginResponse;
          };
          if (result.data?.accessToken && result.data?.refreshToken) {
            const tokenExpires = new Date(Date.now() + 30 * 60 * 1000);
            const refreshTokenExpires = new Date(
              Date.now() + 7 * 24 * 60 * 60 * 1000,
            );
            setCookie(
              cookieConstants.accessToken,
              result.data.accessToken,
              { path: "/" },
              tokenExpires,
            );
            setCookie(
              cookieConstants.refreshToken,
              result.data.refreshToken,
              { path: "/" },
              refreshTokenExpires,
            );
            storeAPI.dispatch({
              type: "auth/loginSuccess",
              payload: result.data.accessToken,
            });
          } else {
            storeAPI.dispatch({ type: "auth/redirectToLogin" });
            setCookie(
              cookieConstants.accessToken,
              "",
              { path: "/" },
              new Date(0),
            );
            setCookie(
              cookieConstants.refreshToken,
              "",
              { path: "/" },
              new Date(0),
            );
          }
        } else {
          storeAPI.dispatch({ type: "auth/loginSuccess", payload: token });
        }
      } else {
        storeAPI.dispatch({ type: "auth/redirectToLogin" });
        setCookie(cookieConstants.accessToken, "", { path: "/" }, new Date(0));
        setCookie(cookieConstants.refreshToken, "", { path: "/" }, new Date(0));
      }
    }
    return next(action);
  };

export default authMiddleware;
