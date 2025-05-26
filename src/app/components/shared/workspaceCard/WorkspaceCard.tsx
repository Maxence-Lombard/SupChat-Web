import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useJoinWorkspaceMutation } from "../../../api/workspaces/workspaces.api.ts";
import { addWorkspace } from "../../../store/slices/workspaceSlice.ts";
import { visibility } from "../../../Models/Enums.ts";
import useProfilePicture from "../../../hooks/useProfilePicture.tsx";

interface Workspace {
  workspaceId: number;
  workspaceName: string;
  workspaceDescription: string;
  profilePictureId: string;
  joinButtonState: boolean;
  visibility: visibility;
  ownerId: number;
  imagePreview?: string;
}

function WorkspaceCard(workspace: Workspace) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [AddMemberInWorkspace] = useJoinWorkspaceMutation();

  const profilePicture = useProfilePicture(workspace.profilePictureId);

  const handleNavigation = () => {
    navigate(`/workspace/${workspace.workspaceId}/channel/1`);
  };

  const handleJoinWorkspace = async () => {
    if (!workspace.workspaceId) {
      console.error("Workspace ID is not defined");
      return;
    }
    try {
      await AddMemberInWorkspace(workspace.workspaceId).unwrap();

      const workspaceToAdd = {
        id: workspace.workspaceId,
        name: workspace.workspaceName,
        description: workspace.workspaceDescription,
        visibility: workspace.visibility,
        visibilityLocalized: workspace.visibility,
        image: "",
        profilePictureId: workspace.profilePictureId,
        ownerId: workspace.ownerId,
      };

      dispatch(addWorkspace(workspaceToAdd));
      handleNavigation();
    } catch (error) {
      console.log("Error creating channel:", error);
    }
  };

  return (
    <div className="flex flex-col gap-4 bg-white border border-[#ECECEC] rounded-2xl p-4 w-80 h-60">
      <div className="flex items-center gap-4">
        <img
          className="w-14 h-14 rounded"
          src={workspace.imagePreview || profilePicture}
          alt="profilePicture"
        />
        <div className="flex flex-col">
          <p className="font-semibold"> {workspace.workspaceName} </p>
          <p className="text-[#A0A0A0]"> 5 members </p>
          {/* TODO: change with the get membersByWorkspace route */}
        </div>
      </div>
      <p className="h-full">{workspace.workspaceDescription}</p>
      <button
        disabled={!workspace.joinButtonState}
        className="flex self-end gap-2 px-4 py-2 items-center bg-[#687BEC] rounded-lg"
        onClick={handleJoinWorkspace}
      >
        <p className="text-white"> Join us </p>
        <i className="pi pi-external-link text-white" />
      </button>
    </div>
  );
}

export default WorkspaceCard;
