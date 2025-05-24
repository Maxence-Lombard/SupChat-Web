import { InputText } from "primereact/inputtext";
import { useState } from "react";
import ImageUploader from "../../imageUploader/ImageUploader.tsx";
import {
  CreateWorkspaceDto,
  useCreateWorkspaceMutation,
} from "../../../../api/workspaces/workspaces.api.ts";
import { attachmentType, visibility } from "../../../../Models/Enums.ts";
import { useDispatch } from "react-redux";
import { addWorkspace } from "../../../../store/slices/workspaceSlice.ts";
import { useUploadFileMutation } from "../../../../api/attachments/attachments.api.ts";

interface CreateWorkspacePopupProps {
  hide: () => void;
  onWorkspaceCreated: () => void;
}

function CreateWorkspacePopup({
  hide,
  onWorkspaceCreated,
}: CreateWorkspacePopupProps) {
  const dispatch = useDispatch();
  const [newWorkspaceName, setNewWorkspaceName] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [createWorkspaceRequest] = useCreateWorkspaceMutation();
  const [uploadProfilePictureRequest] = useUploadFileMutation();

  const handleCreateWorkspace = async () => {
    if (!newWorkspaceName || newWorkspaceName.trim() === "") {
      console.error("Le nom du workspace est manquant.");
      return;
    }
    if (!selectedFile) {
      console.error("Le fichier d'image est manquant.");
      return;
    }

    const newProfilePicture = {
      type: attachmentType.profilePicture,
      file: selectedFile,
    };

    try {
      const profilePicture =
        await uploadProfilePictureRequest(newProfilePicture).unwrap();

      const newWorkspace: CreateWorkspaceDto = {
        name: newWorkspaceName,
        profilePictureId: profilePicture.id,
        visibility: isPublic ? visibility.public : visibility.private,
      };

      const createdWorkspace =
        await createWorkspaceRequest(newWorkspace).unwrap();

      dispatch(addWorkspace(createdWorkspace));
      onWorkspaceCreated();
      hide();
    } catch (error) {
      console.error("Error creating workspace:", error);
    }
  };

  return (
    <div className="flex flex-col text-black px-8 py-6 border bg-white border-[#ECECEC] rounded-2xl">
      <div className="flex flex-col gap-4">
        <p className="font-semibold text-xl">Create a Workspace</p>
        <div className="flex flex-col gap-10">
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-1">
              <label htmlFor="createWorkspace">Name of the workspace</label>
              <InputText
                id="createWorkspace"
                className="w-full border rounded border-black px-2 py-1"
                placeholder="Name of the workspace"
                value={newWorkspaceName}
                onChange={(e) => setNewWorkspaceName(e.target.value ?? "")}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="addImage">Image of the workspace</label>
              <ImageUploader
                onImageSelected={(file) => setSelectedFile(file)}
              />
            </div>

            <div className="flex gap-8">
              <div className="flex flex-col gap-2">
                <p>Public workspace</p>
                <p className="text-black/50">
                  All the people can join this workspace
                </p>
              </div>
              <input
                type="checkbox"
                className="customSwitch"
                defaultChecked
                onChange={(e) => setIsPublic(e.target.checked)}
              />
            </div>
          </div>

          <div className="flex self-end gap-4">
            <button
              className="flex gap-2 px-2 py-1 items-center border border-[#687BEC] rounded-lg"
              onClick={() => hide()}
            >
              <i
                className="pi pi-times"
                style={{ color: "var(--primary-color)" }}
              ></i>
              <p className="text-[#687BEC]">Cancel</p>
            </button>
            <button
              className="flex gap-2 px-2 py-1 items-center bg-[#687BEC] rounded-lg"
              onClick={() => handleCreateWorkspace()}
            >
              <i className="pi pi-plus text-white"></i>
              <p className="text-white">Create the workspace</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateWorkspacePopup;
