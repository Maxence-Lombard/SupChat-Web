import { useParams } from "react-router-dom";
import { useGetWorkspaceByIdQuery } from "../../api/workspaces/workspaces.api.ts";
import { useEffect, useState } from "react";
import workspacePH from "../../../assets/placeholder/workspacePH.svg";
import { RootState } from "../../store/store.ts";
import { useSelector } from "react-redux";
import WorkspaceCard from "../shared/workspaceCard/WorkspaceCard.tsx";
import { InputText } from "primereact/inputtext";

function WorkspaceParameters() {
  const { workspaceId } = useParams();

  const [workspaceProfilePicture, setWorkspaceProfilePicture] =
    useState<string>(workspacePH);

  const profilePictureUrls = useSelector(
    (state: RootState) => state.profilePictures,
  );

  const { data: workspace } = useGetWorkspaceByIdQuery(Number(workspaceId));

  const [workspaceName, setWorkspaceName] = useState<string>("");
  const [workspaceDescription, setWorkspaceDescription] = useState<string>("");

  useEffect(() => {
    if (workspace) {
      setWorkspaceName(workspace.name);
      setWorkspaceDescription(
        "Join us to discus about the final project and help us improve it.",
      );
    }
    if (workspace && profilePictureUrls[workspace.profilePictureId]) {
      setWorkspaceProfilePicture(
        profilePictureUrls[workspace.profilePictureId],
      );
    }
  }, [workspace]);

  return (
    <>
      <div className="flex gap-10 bg-white w-full rounded-l-[40px] px-4 py-8">
        <div className="flex flex-col flex-1 gap-10">
          {/* Banner */}
          <div className="flex flex-col w-full p-6 rounded-2xl bg-[#6B8AFD]">
            <h1 className="font-semibold text-white text-xl">
              Workspace Parameters
            </h1>
            <p className="text-white/75">
              Choose how users can find and view your workspace.
            </p>
          </div>
          <div className="flex h-full bg-[#F9FAFC] rounded-3xl py-8 px-6 gap-4">
            <div className="flex gap-2">
              <div className="flex flex-col justify-between">
                <div className="flex flex-col gap-2">
                  <p className="w-max px-2 py-1 bg-[#6B8AFD]/10 text-[#6B8AFD] rounded-2xl cursor-pointer">
                    Workspace
                  </p>
                  <p className="cursor-pointer px-2 "> Roles </p>
                </div>
                <div className="flex gap-2 items-center text-red-500 cursor-pointer">
                  <p> Delete Workspace </p>
                  <i className="pi pi-trash"></i>
                </div>
              </div>
              {/* Separation line */}
              <div className="w-px h-full bg-black rounded-full"></div>
            </div>
            <div className="flex flex-col flex-1 justify-between">
              <div className="flex flex-col gap-8">
                <div className="flex justify-between">
                  <div className="flex flex-col gap-1">
                    <p> Image </p>
                    <p className="text-black/50">
                      Use an image of at least 56 × 56 pixels for better
                      quality.
                    </p>
                    <img
                      className="w-32 h-32 cursor-pointer rounded"
                      src={workspaceProfilePicture}
                      alt="workspaceProfilePicture"
                    />
                  </div>
                  {workspace && <WorkspaceCard workspace={workspace} />}
                </div>
                <div className="flex flex-col gap-1">
                  <label className="flex" htmlFor="name">
                    Name
                  </label>
                  <InputText
                    name="name"
                    id="name"
                    className="w-full border rounded border-black px-2 py-1"
                    placeholder="Name"
                    value={workspaceName}
                    onChange={(e) => setWorkspaceName(e.target.value ?? "")}
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="flex" htmlFor="workspaceDescription">
                    Description
                  </label>
                  <textarea
                    name="workspaceDescription"
                    id="workspaceDescription"
                    className="textArea"
                    placeholder="Description"
                    value={workspaceDescription}
                    onChange={(e) => setWorkspaceDescription(e.target.value)}
                  />
                </div>
              </div>
              {/* Buttons */}
              <div className="flex self-end gap-4">
                <button className="flex gap-2 px-2 py-1 items-center border border-[#687BEC] rounded-lg">
                  <i
                    className="pi pi-times"
                    style={{ color: "var(--primary-color)" }}
                  ></i>
                  <p className="text-[#687BEC]"> Cancel </p>
                </button>
                <button className="flex gap-2 px-2 py-1 items-center bg-[#687BEC] rounded-lg">
                  <i className="pi pi-save text-white"></i>
                  <p className="text-white"> Save </p>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default WorkspaceParameters;
