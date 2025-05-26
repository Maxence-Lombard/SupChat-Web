import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import workspacePH from "../../../../assets/placeholder/workspacePH.svg";
import {
  GetWorkspaceResponse,
  useJoinWorkspaceMutation,
} from "../../../api/workspaces/workspaces.api.ts";
import { addWorkspace } from "../../../store/slices/workspaceSlice.ts";

interface Workspace {
  workspace: GetWorkspaceResponse;
}

function WorkspaceCard({ workspace }: Workspace) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [AddMemberInWorkspace] = useJoinWorkspaceMutation();

  const handleNavigation = () => {
    navigate(`/workspace/${workspace.id}/channel/1`);
  };

  const handleJoinWorkspace = async () => {
    if (!workspace.id) {
      console.error("Workspace ID is not defined");
      return;
    }
    try {
      await AddMemberInWorkspace(workspace.id).unwrap();
      dispatch(addWorkspace(workspace));
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
          src={workspacePH}
          alt="workspacePH"
        />
        <div className="flex flex-col">
          <p className="font-semibold"> {workspace.name} </p>
          <p className="text-[#A0A0A0]"> 5 members </p>
          {/* TODO: change with the get membersByWorkspace route */}
        </div>
      </div>
      {/* TODO: change with description */}
      <p className="h-full">{workspace.description}</p>
      <button
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
