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
import { ErrorResponse } from "../../../../Models/Error.ts";

interface CreateWorkspacePopupProps {
  hide: () => void;
  onWorkspaceCreated: () => void;
}

function CreateWorkspacePopup({
  hide,
  onWorkspaceCreated,
}: CreateWorkspacePopupProps) {
  const dispatch = useDispatch();
  const [errorMessage, setErrorMessage] = useState<string | undefined>(
    undefined,
  );
  const [inputErrorMessage, setInputErrorMessage] = useState<
    string | undefined
  >(undefined);
  const [imageErrorMessage, setImageErrorMessage] = useState<
    string | undefined
  >(undefined);
  const [newWorkspaceName, setNewWorkspaceName] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [createWorkspaceRequest] = useCreateWorkspaceMutation();
  const [uploadProfilePictureRequest] = useUploadFileMutation();

  const handleCreateWorkspace = async () => {
    setErrorMessage(undefined);
    if (!newWorkspaceName || newWorkspaceName.trim() === "") {
      setInputErrorMessage("You must provide a name for the workspace.");
      return;
    }

    if (newWorkspaceName.length > 50) {
      setInputErrorMessage(
        "The workspace name must be less than 50 characters.",
      );
      return;
    }
    setInputErrorMessage(undefined);

    try {
      let profilePictureId: string | undefined = undefined;
      if (selectedFile) {
        if (
          selectedFile.type === "image/png" ||
          selectedFile.type === "image/jpg" ||
          selectedFile.type === "image/jpeg" ||
          selectedFile.type === "image/webp"
        ) {
          const newProfilePicture = {
            type: attachmentType.profilePicture,
            file: selectedFile,
          };
          const profilePicture =
            await uploadProfilePictureRequest(newProfilePicture).unwrap();
          profilePictureId = profilePicture.id;
          setImageErrorMessage(undefined);
        } else {
          setImageErrorMessage("The image must be a PNG, JPG, JPEG, or WEBP.");
          return;
        }
      }

      const newWorkspace: CreateWorkspaceDto = {
        name: newWorkspaceName,
        visibility: isPublic ? visibility.public : visibility.private,
      };
      if (profilePictureId) {
        newWorkspace.profilePictureId = profilePictureId;
      }

      const createdWorkspace =
        await createWorkspaceRequest(newWorkspace).unwrap();

      dispatch(addWorkspace(createdWorkspace));
      onWorkspaceCreated();
      hide();
    } catch (e) {
      const error = e as ErrorResponse;
      console.error(error);
      setErrorMessage(error.data.detail);
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
              {inputErrorMessage ? (
                <p className="text-xs text-red-500"> {inputErrorMessage}</p>
              ) : null}
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
              {imageErrorMessage ? (
                <p className="text-xs text-red-500"> {imageErrorMessage}</p>
              ) : null}
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
          <div className="flex flex-col gap-2">
            {errorMessage ? (
              <p className="text-xs text-red-500 self-end"> {errorMessage}</p>
            ) : null}
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
    </div>
  );
}

export default CreateWorkspacePopup;
