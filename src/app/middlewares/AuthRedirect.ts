import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState } from "../store/store.ts";
import { useAuth } from "../hooks/useAuth.tsx";

export default function AuthRedirect() {
  const shouldRedirect = useSelector(
    (state: RootState) => state.auth.shouldRedirect,
  );
  const navigate = useNavigate();
  const { logout } = useAuth();

  useEffect(() => {
    if (shouldRedirect) {
      logout();
      navigate("/login");
    }
  }, [shouldRedirect, navigate]);

  return null;
}
