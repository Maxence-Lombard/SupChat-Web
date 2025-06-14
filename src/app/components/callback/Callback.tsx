import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getUnencodedCookie } from "../../../helpers/cookieHelper.ts";
import { loginSuccess } from "../../store/slices/authSlice.ts";
import { useDispatch } from "react-redux";
import { cookieConstants } from "../../constants/cookieConstants.ts";
import { useInvitationHandler } from "../../hooks/useInvitationHandler.ts";

function Callback() {
  const [error, setError] = useState("");
  const [isProcessing, setIsProcessing] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { processPendingInvitation } = useInvitationHandler();

  const handleCallback = async () => {
    try {
      const token = getUnencodedCookie(cookieConstants.accessToken);
      if (!token) {
        setError("Authentication failed. Please try again.");
        setIsProcessing(false);
        return;
      }

      dispatch(loginSuccess());

      const pendingInvitation = searchParams.get("pendingInvitation");
      const pendingWorkspaceId = searchParams.get("pendingWorkspaceId");

      if (pendingInvitation && pendingWorkspaceId) {
        navigate(
          `/workspace/${pendingWorkspaceId}/invitation/accept?token=${pendingInvitation}`,
        );
        return;
      }

      const hasProcessedInvitation = processPendingInvitation();
      if (hasProcessedInvitation) {
        return;
      }

      const returnUrl = searchParams.get("returnUrl");
      if (returnUrl) {
        navigate(returnUrl, { replace: true });
        return;
      }

      navigate("/");
    } catch (err) {
      console.error("Callback error:", err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    handleCallback();
  }, []);

  if (isProcessing) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center bg-white p-8 rounded-lg shadow-lg">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--main-color-500)] mx-auto mb-4"></div>
          <p className="text-lg text-black/50">Completing your login...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center bg-white p-8 rounded-lg shadow-lg max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <i className="pi pi-times text-2xl text-red-600"></i>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Login Error</h2>
          <p className="text-black/50 mb-6">{error}</p>
          <button
            onClick={() => navigate("/login")}
            className="w-full bg-[var(--main-color-500)] text-white py-2 px-4 rounded"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return null;
}

export default Callback;
