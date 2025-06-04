import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { selectAccessToken } from "../store/slices/authSlice.ts";

function TokenExpiryChecker() {
  const dispatch = useDispatch();
  const token = useSelector(selectAccessToken);

  useEffect(() => {
    if (!token) {
      dispatch({ type: "auth/redirectToLogin" });
      return;
    }

    const payload = JSON.parse(atob(token.split(".")[1]));
    const exp = payload.exp * 1000;
    const now = Date.now();
    // const delay = exp - now + 1000;
    console.log("Token expiry time:", exp - now + 1000);
    const delay = 11000;

    if (delay > 0) {
      const timeout = setTimeout(() => {
        dispatch({ type: "auth/checkAuth" });
      }, delay);
      return () => clearTimeout(timeout);
    }
  }, [token, dispatch]);

  return null;
}

export default TokenExpiryChecker;
