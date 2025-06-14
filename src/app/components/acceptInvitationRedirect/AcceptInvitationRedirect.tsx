import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  useAcceptWorkspaceInvitationMutation,
  useGetFirstChannelMutation,
  useGetWorkspaceByIdQuery,
} from "../../api/workspaces/workspaces.api.ts";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { ErrorResponse } from "../../Models/Error.ts";
import { Button } from "primereact/button";
import { ProgressSpinner } from "primereact/progressspinner";
import { useInvitationHandler } from "../../hooks/useInvitationHandler";
import { getUnencodedCookie } from "../../../helpers/cookieHelper.ts";
import { cookieConstants } from "../../constants/cookieConstants.ts";
import { addWorkspace } from "../../store/slices/workspaceSlice.ts";

type Status = "loading" | "success" | "error" | "need-auth";

function AcceptInvitationRedirect() {
  const { workspaceId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const accessToken = getUnencodedCookie(cookieConstants.accessToken);

  const invitationProcessedRef = useRef(false);

  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated,
  );

  const { data: workspace } = useGetWorkspaceByIdQuery(Number(workspaceId), {
    skip: !isAuthenticated,
  });
  const [acceptInvitationRequest, { isLoading }] =
    useAcceptWorkspaceInvitationMutation();
  const [GetFirstChannel] = useGetFirstChannelMutation();

  const { clearPendingInvitation, storePendingInvitation } =
    useInvitationHandler();

  const [status, setStatus] = useState<Status>("loading");
  const [errorMessage, setErrorMessage] = useState("");

  const params = new URLSearchParams(location.search);
  const token = params.get("token");

  const navigateToWorkspace = useCallback(
    async (id: number) => {
      try {
        const channel = await GetFirstChannel(id).unwrap();
        navigate(`/workspace/${channel.workspaceId}/channel/${channel.id}`);
      } catch (error) {
        console.error("Error fetching first channel:", error);
        navigate(`/`);
      }
    },
    [GetFirstChannel, navigate],
  );

  const handleAcceptInvitation = useCallback(
    async (invitationToken: string) => {
      if (!workspaceId || isLoading) return;

      try {
        setStatus("loading");
        const response = await acceptInvitationRequest({
          workspaceId: Number(workspaceId),
          token: invitationToken,
        }).unwrap();

        dispatch(addWorkspace(response));

        setStatus("success");
        clearPendingInvitation();
        invitationProcessedRef.current = true;

        setTimeout(() => {
          navigateToWorkspace(response.id);
        }, 2000);
      } catch (e) {
        const error = e as ErrorResponse;
        invitationProcessedRef.current = false;

        if (error.data.status === 401) {
          setErrorMessage("The invitation link is invalid or has expired");
          setStatus("error");
          return;
        }
        setErrorMessage(error.data.detail);
        setStatus("error");
      }
    },
    [
      workspaceId,
      isLoading,
      acceptInvitationRequest,
      clearPendingInvitation,
      navigateToWorkspace,
    ],
  );

  useEffect(() => {
    if (accessToken && workspaceId) {
      navigateToWorkspace(Number(workspaceId));
    }
  }, [accessToken, workspaceId, navigateToWorkspace]);

  const handleLoginRedirect = useCallback(() => {
    if (token && workspaceId) {
      storePendingInvitation(token, workspaceId);
      const returnUrl = window.location.pathname + window.location.search;
      navigate(`/login?returnUrl=${encodeURIComponent(returnUrl)}`, {
        state: {
          message: "Please sign in to accept this invitation to the workspace",
        },
      });
    }
  }, [token, workspaceId, storePendingInvitation, navigate]);

  const handleRegisterRedirect = useCallback(() => {
    if (token && workspaceId) {
      storePendingInvitation(token, workspaceId);
      const returnUrl = window.location.pathname + window.location.search;
      navigate(`/register?returnUrl=${encodeURIComponent(returnUrl)}`, {
        state: {
          message:
            "Create an account to accept this invitation to the workspace",
        },
      });
    }
  }, [token, workspaceId, storePendingInvitation, navigate]);

  useEffect(() => {
    if (!token || !workspaceId) {
      setErrorMessage("Invitation token or workspace ID is missing");
      setStatus("error");
      return;
    }

    if (isAuthenticated) {
      handleAcceptInvitation(token);
    } else {
      setStatus("need-auth");
    }
  }, [token, workspaceId, isAuthenticated, handleAcceptInvitation]);

  useEffect(() => {
    if (
      isAuthenticated &&
      status === "need-auth" &&
      token &&
      !invitationProcessedRef.current
    ) {
      invitationProcessedRef.current = true;
      handleAcceptInvitation(token);
    }
  }, [isAuthenticated, status, token, handleAcceptInvitation]);

  if (!accessToken) {
    if (status === "loading") {
      return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
          <div className="text-center bg-white p-8 rounded-lg shadow-lg max-w-md mx-auto">
            <ProgressSpinner className="mb-4" />
            <p className="text-lg text-gray-600">
              {isAuthenticated
                ? "Accepting the invitation..."
                : "Processing your invitation..."}
            </p>
            {workspace && (
              <p className="text-sm text-gray-500 mt-2">
                Workspace: {workspace.name}
              </p>
            )}
          </div>
        </div>
      );
    }

    if (status === "need-auth") {
      return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
          <div className="max-w-md mx-auto text-center p-8 bg-white rounded-lg shadow-lg">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <i className="pi pi-users text-2xl text-[var(--main-color-500)]"></i>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Invitation to the workspace
            </h2>
            {workspace && (
              <p className="text-lg font-medium text-gray-800 mb-2">
                {workspace.name}
              </p>
            )}
            <p className="text-gray-600 mb-6">
              You must be signed in to accept this invitation to the workspace.
              Your invitation will be automatically accepted after signing in.
            </p>
            <div className="space-y-3">
              <Button
                label="Sign in"
                onClick={handleLoginRedirect}
                className="w-full bg-[var(--main-color-500)] text-white border-none"
              />
              <Button
                label="Sign up"
                onClick={handleRegisterRedirect}
                className="w-full"
                outlined
              />
            </div>
          </div>
        </div>
      );
    }

    if (status === "success") {
      return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
          <div className="text-center bg-white p-8 rounded-lg shadow-lg max-w-md mx-auto">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <i className="pi pi-check text-2xl text-green-600"></i>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Invitation accepted !
            </h2>
            {workspace && (
              <p className="text-lg font-medium text-gray-800 mb-2">
                Welcome to {workspace.name}
              </p>
            )}
            <p className="text-gray-600 mb-4">
              You have successfully joined the workspace.
            </p>
            <p className="text-sm text-gray-500">
              Redirecting to the workspace...
            </p>
          </div>
        </div>
      );
    }

    if (status === "error") {
      return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
          <div className="text-center bg-white p-8 rounded-lg shadow-lg max-w-md mx-auto">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <i className="pi pi-times text-2xl text-red-600"></i>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Error</h2>
            <p className="text-black/50 mb-6">{errorMessage}</p>
            <div className="space-y-3">
              <Button
                label="Back to home"
                onClick={() => navigate("/")}
                className="w-full bg-[var(--main-color-500)] text-white border-none"
              />
              {workspace && (
                <Button
                  label={`Go to workspace ${workspace.name}`}
                  onClick={() => navigateToWorkspace(workspace.id)}
                  className="w-full"
                  outlined
                />
              )}
            </div>
          </div>
        </div>
      );
    }
  }

  return null;
}

export default AcceptInvitationRedirect;
