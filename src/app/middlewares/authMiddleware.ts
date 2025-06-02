import { Middleware, UnknownAction } from "@reduxjs/toolkit";
import { getCookie } from "../../helpers/cookieHelper.ts";
import { cookieConstants } from "../constants/cookieConstants.ts";

const authMiddleware: Middleware = (storeAPI) => (next) => (action) => {
  // TODO: verifier AnyAction qui est deprecated
  const typedAction = action as UnknownAction;

  if (typedAction.type === "auth/checkAuth") {
    const token = getCookie(cookieConstants.accessToken);
    // TODO: ajouter vérification si le token est expiré pour le renouveler
    if (token) {
      storeAPI.dispatch({ type: "auth/loginSuccess", payload: token });
    } else {
      storeAPI.dispatch({ type: "auth/redirectToLogin" });
      return;
    }
  }
  return next(action);
};

export default authMiddleware;
