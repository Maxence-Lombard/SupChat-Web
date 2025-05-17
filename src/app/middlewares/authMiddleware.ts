import { Middleware } from "@reduxjs/toolkit";
import { getCookie } from "../../helpers/cookieHelper.ts";

const authMiddleware: Middleware = (storeAPI) => (next) => (action) => {
  if (action.type === "auth/checkAuth") {
    const token = getCookie("ACCESS_TOKEN");
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
