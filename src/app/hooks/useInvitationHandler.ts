import { useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";

export function useInvitationHandler() {
  const navigate = useNavigate();
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated,
  );

  const storePendingInvitation = useCallback(
    (token: string, workspaceId: string) => {
      sessionStorage.setItem("pendingInvitation", token);
      sessionStorage.setItem("pendingWorkspaceId", workspaceId);
    },
    [],
  );

  const getPendingInvitation = useCallback(() => {
    const token = sessionStorage.getItem("pendingInvitation");
    const workspaceId = sessionStorage.getItem("pendingWorkspaceId");
    return token && workspaceId ? { token, workspaceId } : null;
  }, []);

  const hasPendingInvitation = useCallback(() => {
    return getPendingInvitation() !== null;
  }, [getPendingInvitation]);

  const clearPendingInvitation = useCallback(() => {
    sessionStorage.removeItem("pendingInvitation");
    sessionStorage.removeItem("pendingWorkspaceId");
  }, []);

  const processInvitation = useCallback(
    (token: string, workspaceId: string) => {
      if (isAuthenticated) {
        navigate(`/invitation/accept/${workspaceId}?token=${token}`);
      } else {
        storePendingInvitation(token, workspaceId);
        const currentPath = window.location.pathname + window.location.search;
        navigate(`/login?returnUrl=${encodeURIComponent(currentPath)}`, {
          state: {
            message:
              "Please sign in to accept this invitation to the workspace",
          },
        });
      }
    },
    [isAuthenticated, navigate, storePendingInvitation],
  );

  const processPendingInvitation = useCallback(() => {
    const pending = getPendingInvitation();
    if (pending && isAuthenticated) {
      clearPendingInvitation();
      navigate(
        `/invitation/accept/${pending.workspaceId}?token=${pending.token}`,
      );
      return true;
    }
    return false;
  }, [getPendingInvitation, isAuthenticated, clearPendingInvitation, navigate]);

  useEffect(() => {
    if (isAuthenticated) {
      const timer = setTimeout(() => {
        processPendingInvitation();
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, processPendingInvitation]);

  return {
    storePendingInvitation,
    getPendingInvitation,
    hasPendingInvitation,
    clearPendingInvitation,
    processInvitation,
    processPendingInvitation,
  };
}
