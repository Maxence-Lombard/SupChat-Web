import { ErrorResponse, useNavigate, useParams } from "react-router-dom";
import {
  useDeleteWorkspaceMutation,
  useGetFirstChannelMutation,
  useGetWorkspaceByIdQuery,
  useModifyWorkspaceMutation,
  useModifyWorkspaceProfilePictureMutation,
  WorkspaceDto,
} from "../../api/workspaces/workspaces.api.ts";
import { useEffect, useState } from "react";
import workspacePH from "../../../assets/placeholder/workspacePH.svg";
import { RootState } from "../../store/store.ts";
import { useDispatch, useSelector } from "react-redux";
import WorkspaceCard from "../shared/workspaceCard/WorkspaceCard.tsx";
import { InputText } from "primereact/inputtext";
import ImageUploaderOnlySelect from "../shared/ImageUploaderOnlySelect/ImageUploaderOnlySelect.tsx";
import { attachmentType } from "../../Models/Enums.ts";
import { useUploadFileMutation } from "../../api/attachments/attachments.api.ts";
import {
  modifyWorkspaceData,
  removeWorkspace,
} from "../../store/slices/workspaceSlice.ts";
import { addProfilePicture } from "../../store/slices/profilePictureSlice.ts";

function WorkspaceParameters() {
  const { workspaceId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { data: workspace } = useGetWorkspaceByIdQuery(Number(workspaceId));
  const [GetFirstChannel] = useGetFirstChannelMutation();
  const [uploadProfilePictureRequest] = useUploadFileMutation();
  const [modifyWorkspaceQuery] = useModifyWorkspaceMutation();
  const [modifyWorkspaceProfilePicture] =
    useModifyWorkspaceProfilePictureMutation();
  const [deleteWorkspace] = useDeleteWorkspaceMutation();

  const profilePictureUrls = useSelector(
    (state: RootState) => state.profilePictures,
  );
  const workspaceProfilePicture =
    workspace && profilePictureUrls[workspace.profilePictureId]
      ? profilePictureUrls[workspace.profilePictureId]
      : workspacePH;

  const [errorMessage, setErrorMessage] = useState<string | undefined>(
    undefined,
  );
  const [imageErrorMessage, setImageErrorMessage] = useState<
    string | undefined
  >(undefined);
  const [inputErrorMessage, setInputErrorMessage] = useState<
    string | undefined
  >(undefined);
  const [descriptionErrorMessage, setDescriptionInputErrorMessage] = useState<
    string | undefined
  >(undefined);
  const [workspaceName, setWorkspaceName] = useState<string>("");
  const [workspaceDescription, setWorkspaceDescription] = useState<string>("");
  const [maxWorkspaceDescription, setMaxWorkspaceDescription] =
    useState<string>(500);
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(undefined);
  const [workspaceProfilePictureId, setWorkspaceProfilePictureId] =
    useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const resetWorkspaceInfos = () => {
    if (!workspace) return;
    setWorkspaceName(workspace.name);
    setWorkspaceDescription(workspace.description);
    setWorkspaceProfilePictureId(workspace.profilePictureId || "");
    setPreviewUrl(undefined);
    setSelectedFile(null);

    //Reset error messages
    setErrorMessage(undefined);
    setImageErrorMessage(undefined);
    setInputErrorMessage(undefined);
    setDescriptionInputErrorMessage(undefined);
  };

  const navigateToWorkspace = async (id: number) => {
    try {
      const channel = await GetFirstChannel(id).unwrap();
      navigate(`/workspace/${channel.workspaceId}/channel/${channel.id}`);
    } catch (error) {
      return error;
    }
  };

  const modifyWorkspace = async () => {
    if (!workspaceName || workspaceName.trim() === "") {
      setInputErrorMessage("You must provide a name for the workspace.");
      return;
    }

    if (workspaceName.length > 50) {
      setInputErrorMessage(
        "The workspace name must be less than 50 characters.",
      );
      return;
    }

    if (workspaceDescription.length > 500) {
      setDescriptionInputErrorMessage(
        "The workspace description must be less than 500 characters.",
      );
      return;
    }
    setInputErrorMessage(undefined);

    try {
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
          await modifyWorkspaceProfilePicture({
            workspaceId: workspace.id,
            attachmentUuid: profilePicture.id,
          }).unwrap();
          setWorkspaceProfilePictureId(profilePicture.id);
          const blobUrl = URL.createObjectURL(selectedFile);
          dispatch(
            addProfilePicture({
              id: profilePicture.id,
              url: blobUrl,
            }),
          );
        } else {
          setImageErrorMessage("The image must be a PNG, JPG, JPEG, or WEBP.");
          return;
        }
      }
      const modifiedWorkspace: Partial<WorkspaceDto> = {
        id: workspace.id,
        name: workspaceName,
        description: workspaceDescription,
      };

      const newWorkspaceInfos =
        await modifyWorkspaceQuery(modifiedWorkspace).unwrap();

      dispatch(modifyWorkspaceData(newWorkspaceInfos));
      await navigateToWorkspace(workspace.id);
      resetWorkspaceInfos();
    } catch (error) {
      return error;
    }
  };

  const handleDeleteWorkspace = async (workspaceId: number) => {
    if (!workspaceId) return;
    try {
      deleteWorkspace(workspaceId).unwrap();
      dispatch(removeWorkspace(workspaceId));
      navigate("/");
    } catch (e) {
      const error = e as ErrorResponse;
      setErrorMessage(error.data.detail);
    }
  };

  useEffect(() => {
    if (workspace) {
      setWorkspaceName(workspace.name);
      setWorkspaceDescription(workspace.description);
      setWorkspaceProfilePictureId(workspace.profilePictureId || "");
      setPreviewUrl(undefined);
    }
  }, [workspace, profilePictureUrls]);

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
                <div
                  className="flex gap-2 items-center text-red-500 cursor-pointer"
                  onClick={() => {
                    handleDeleteWorkspace(Number(workspaceId));
                  }}
                >
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
                      Use an image of at least 256 × 256 pixels for better
                      quality.
                    </p>
                    {imageErrorMessage ? (
                      <p className="text-xs text-red-500">
                        {imageErrorMessage}
                      </p>
                    ) : null}
                    <ImageUploaderOnlySelect
                      onImageSelected={(file) => setSelectedFile(file)}
                      imageUrl={previewUrl ?? workspaceProfilePicture}
                      onPreviewUrlChange={(url) => {
                        setPreviewUrl(url);
                      }}
                    />
                  </div>
                  {workspace ? (
                    <WorkspaceCard
                      workspaceId={workspace.id}
                      workspaceName={workspaceName}
                      workspaceDescription={workspaceDescription}
                      visibility={workspace.visibility}
                      profilePictureId={workspaceProfilePictureId}
                      ownerId={workspace.ownerId}
                      imagePreview={previewUrl}
                      joinButtonState={false}
                    />
                  ) : null}
                </div>
                <div className="flex flex-col gap-1">
                  <label className="flex" htmlFor="name">
                    Name
                  </label>
                  {inputErrorMessage ? (
                    <p className="text-xs text-red-500"> {inputErrorMessage}</p>
                  ) : null}
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
                  <div className="flex gap-1 items-center">
                    <label className="flex" htmlFor="workspaceDescription">
                      Description
                    </label>
                    <p className="text-xs text-black/50">
                      (
                      {(workspaceDescription?.length || 0) +
                        "/" +
                        maxWorkspaceDescription}
                      )
                    </p>
                  </div>
                  {descriptionErrorMessage ? (
                    <p className="text-xs text-red-500">
                      {descriptionErrorMessage}
                    </p>
                  ) : null}
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
              <div className="flex flex-col gap-2">
                {errorMessage ? (
                  <p className="text-xs text-red-500"> {inputErrorMessage}</p>
                ) : null}
                <div className="flex self-end gap-4">
                  <button
                    className="flex gap-2 px-2 py-1 items-center border border-[#687BEC] rounded-lg"
                    onClick={resetWorkspaceInfos}
                  >
                    <i
                      className="pi pi-times"
                      style={{ color: "var(--primary-color)" }}
                    ></i>
                    <p className="text-[#687BEC]"> Cancel </p>
                  </button>
                  <button
                    className="flex gap-2 px-2 py-1 items-center bg-[#687BEC] rounded-lg"
                    onClick={() => modifyWorkspace()}
                  >
                    <i className="pi pi-save text-white"></i>
                    <p className="text-white"> Save </p>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default WorkspaceParameters;
