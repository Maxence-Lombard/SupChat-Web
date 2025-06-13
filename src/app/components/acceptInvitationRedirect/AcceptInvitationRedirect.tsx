import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import {
  GetWorkspaceResponse,
  useAcceptWorkspaceInvitationMutation,
  useGetFirstChannelMutation,
  useGetWorkspaceByIdQuery,
} from "../../api/workspaces/workspaces.api.ts";
import { useDispatch } from "react-redux";
import { addWorkspace } from "../../store/slices/workspaceSlice.ts";

function AcceptInvitationRedirect() {
  const { workspaceId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { data: workspace } = useGetWorkspaceByIdQuery(Number(workspaceId));
  const [acceptInvitationRequest, { isLoading }] =
    useAcceptWorkspaceInvitationMutation();
  const [GetFirstChannel] = useGetFirstChannelMutation();

  const [invitationAccepted, setInvitationAccepted] = useState(false);
  const [acceptedWorkspace, setAcceptedWorkspace] = useState<
    GetWorkspaceResponse | undefined
  >(undefined);

  const hasDispatched = useRef(false);

  const navigateToWorkspace = async (id: number) => {
    try {
      const channel = await GetFirstChannel(id).unwrap();
      navigate(`/workspace/${channel.workspaceId}/channel/${channel.id}`);
    } catch (error) {
      console.error("Error fetching first channel:", error);
    }
  };

  useEffect(() => {
    if (invitationAccepted || isLoading) return;
    const params = new URLSearchParams(location.search);
    const token = params.get("token");
    if (token && workspaceId) {
      handleAcceptInvitation(token);
    }
  }, [workspaceId, location.search, invitationAccepted, isLoading]);

  const handleAcceptInvitation = async (token: string) => {
    if (!workspaceId || isLoading) return;
    try {
      const response = await acceptInvitationRequest({
        workspaceId: Number(workspaceId),
        token,
      }).unwrap();
      setInvitationAccepted(true);
      setAcceptedWorkspace(response);
    } catch (error) {
      console.error("Error accepting invitation:", error);
      navigate("/");
      return error;
    }
  };

  useEffect(() => {
    if (acceptedWorkspace && !hasDispatched.current) {
      dispatch(
        addWorkspace({
          id: acceptedWorkspace.id,
          name: acceptedWorkspace.name,
          description: acceptedWorkspace.description,
          visibility: acceptedWorkspace.visibility,
          visibilityLocalized: acceptedWorkspace.visibility,
          profilePictureId: acceptedWorkspace.profilePictureId,
          ownerId: acceptedWorkspace.ownerId,
        }),
      );
      hasDispatched.current = true;
    }
  }, [acceptedWorkspace, dispatch]);

  useEffect(() => {
    if (invitationAccepted && workspace) {
      navigateToWorkspace(workspace.id);
    }
  }, [invitationAccepted, workspace]);

  return <div> Redirecting ...</div>;
}

export default AcceptInvitationRedirect;
