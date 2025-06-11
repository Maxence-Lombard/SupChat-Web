import ImageUploaderOnlySelect from "../shared/ImageUploaderOnlySelect/ImageUploaderOnlySelect.tsx";
import { useEffect, useState } from "react";
import { RootState } from "../../store/store.ts";
import { useDispatch, useSelector } from "react-redux";
import { attachmentType } from "../../Models/Enums.ts";
import { addAttachment } from "../../store/slices/attachmentSlice.ts";
import {
  useUpdateUserInfosMutation,
  useUpdateUserProfilePictureMutation,
} from "../../api/user/user.api.ts";
import { useUploadFileMutation } from "../../api/attachments/attachments.api.ts";
import { ApplicationUser } from "../../Models/User.ts";
import { updateUser } from "../../store/slices/usersSlice.ts";
import { InputText } from "primereact/inputtext";
import UserParametersLayout from "../../layouts/UserParametersLayout.tsx";
import { ErrorResponse } from "../../Models/Error.ts";

function MyProfile() {
  const dispatch = useDispatch();

  const user = useSelector(
    (state: RootState) => state.users.byId[state.users.currentUserId!],
  );
  const profilePictureUrls = useSelector(
    (state: RootState) => state.attachments,
  );
  const userProfilePicture = profilePictureUrls[user?.profilePictureId ?? ""];

  const [uploadProfilePictureRequest] = useUploadFileMutation();
  const [modifyUserProfilePicture] = useUpdateUserProfilePictureMutation();
  const [modifyUserinfos] = useUpdateUserInfosMutation();

  // USER INPUTS
  const [userFirstName, setUserFirstName] = useState<string>("");
  const [userUserName, setUserUserName] = useState<string>("");
  // ERROR MESSAGES
  const [inputErrorMessage, setInputErrorMessage] = useState<
    string | undefined
  >(undefined);
  const [errorMessage, setErrorMessage] = useState<string | undefined>(
    undefined,
  );
  const [successMessage, setSuccessMessage] = useState<string | undefined>(
    undefined,
  );
  const [selectedFile, setSelectedFile] = useState<File | undefined>(undefined);
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(undefined);
  const [imageErrorMessage, setImageErrorMessage] = useState<
    string | undefined
  >(undefined);

  const resetUserInfos = () => {
    if (!user) return;
    setUserFirstName(user.firstName || "");
    setUserUserName(user.username || "");
    setPreviewUrl(undefined);
    setSelectedFile(undefined);

    //Reset error messages
    // setErrorMessage(undefined);
    setImageErrorMessage(undefined);
  };

  const modifyUser = async () => {
    if (!userFirstName || userFirstName.trim() === "") {
      setInputErrorMessage("You must provide a first name for your profile.");
      return;
    }

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
          await modifyUserProfilePicture({
            userId: user?.id || 0,
            attachmentUuid: profilePicture.id,
          }).unwrap();
          const blobUrl = URL.createObjectURL(selectedFile);
          dispatch(
            addAttachment({
              id: profilePicture.id,
              url: blobUrl,
            }),
          );
          setSuccessMessage("Profile picture updated successfully!");
        } else {
          setImageErrorMessage("The image must be a PNG, JPG, JPEG, or WEBP.");
          return;
        }
      }
      const modifiedUser: Partial<ApplicationUser> = {
        id: user?.id || 0,
        firstName: userFirstName,
        username: userUserName,
      };

      const newUserInfos = await modifyUserinfos(modifiedUser).unwrap();

      dispatch(updateUser(newUserInfos));
      setSuccessMessage("Profile information's updated successfully.");
      resetUserInfos();
    } catch (e) {
      const error = e as ErrorResponse;
      setErrorMessage(error.data.detail);
      return error;
    }
  };

  useEffect(() => {
    if (user) {
      setUserFirstName(user.firstName || "");
      setUserUserName(user.username || "");
      setPreviewUrl(undefined);
    }
  }, [user]);

  return (
    <>
      <UserParametersLayout>
        <div className="flex flex-1 flex-col gap-10">
          <p className="font-semibold text-xl"> My Profile </p>
          <div className="flex flex-col flex-1 justify-between">
            <div className="flex flex-col gap-8">
              <div className="flex justify-between">
                <div className="flex flex-col gap-1">
                  <p> Change your profile picture </p>
                  <p className="text-black/50">
                    Use an image of at least 256 × 256 pixels for better
                    quality.
                  </p>
                  {imageErrorMessage ? (
                    <p className="text-xs text-red-500">{imageErrorMessage}</p>
                  ) : null}
                  <ImageUploaderOnlySelect
                    onImageSelected={(file) => setSelectedFile(file)}
                    imageUrl={previewUrl ?? userProfilePicture}
                    onPreviewUrlChange={(url) => {
                      setPreviewUrl(url);
                    }}
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <div className="flex flex-1 flex-col gap-1">
                  <label className="flex" htmlFor="username">
                    Username
                  </label>
                  <InputText
                    name="username"
                    id="username"
                    className="w-full border rounded border-black px-2 py-1"
                    placeholder="Username"
                    value={userUserName}
                    onChange={(e) => setUserUserName(e.target.value ?? "")}
                  />
                </div>
                <div className="flex flex-1 flex-col gap-1">
                  <label className="flex" htmlFor="firstname">
                    First Name
                  </label>
                  {inputErrorMessage ? (
                    <p className="text-xs text-red-500">{inputErrorMessage}</p>
                  ) : null}
                  <InputText
                    name="firstname"
                    id="firstname"
                    className="w-full border rounded border-black px-2 py-1"
                    placeholder="First Name"
                    value={userFirstName}
                    onChange={(e) => setUserFirstName(e.target.value ?? "")}
                  />
                </div>
              </div>
            </div>
            {/* Buttons */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center self-end gap-4">
                {errorMessage ? (
                  <p className="text-xs text-left text-red-500">
                    {" "}
                    {errorMessage}
                  </p>
                ) : null}
                {successMessage ? (
                  <p className="text-xs text-left text-green-600">
                    {successMessage}
                  </p>
                ) : null}
                <button
                  className="flex gap-2 px-2 py-1 items-center border border-[#687BEC] rounded-lg"
                  onClick={resetUserInfos}
                >
                  <i
                    className="pi pi-times"
                    style={{ color: "var(--main-color-500)" }}
                  ></i>
                  <p className="text-[#687BEC]"> Cancel </p>
                </button>
                <button
                  className="flex gap-2 px-2 py-1 items-center bg-[#687BEC] rounded-lg"
                  onClick={modifyUser}
                >
                  <i className="pi pi-save text-white"></i>
                  <p className="text-white"> Save </p>
                </button>
              </div>
            </div>
          </div>
        </div>
      </UserParametersLayout>
    </>
  );
}

export default MyProfile;
