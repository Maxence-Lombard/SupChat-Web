import ImageUploaderOnlySelect from "../shared/ImageUploaderOnlySelect/ImageUploaderOnlySelect.tsx";
import { useEffect, useState } from "react";
import { RootState } from "../../store/store.ts";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth.tsx";
import { attachmentType } from "../../Models/Enums.ts";
import { addProfilePicture } from "../../store/slices/profilePictureSlice.ts";
import {
  useUpdateUserInfosMutation,
  useUpdateUserProfilePictureMutation,
} from "../../api/user/user.api.ts";
import { useUploadFileMutation } from "../../api/attachments/attachments.api.ts";
import { ApplicationUser } from "../../Models/User.ts";
import { updateUser } from "../../store/slices/usersSlice.ts";
import { InputText } from "primereact/inputtext";

function MyProfile() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { logout } = useAuth();

  const user = useSelector(
    (state: RootState) => state.users.byId[state.users.currentUserId!],
  );
  const profilePictureUrls = useSelector(
    (state: RootState) => state.profilePictures,
  );
  const userProfilePicture = profilePictureUrls[user?.profilePictureId ?? ""];

  const [uploadProfilePictureRequest] = useUploadFileMutation();
  const [modifyUserProfilePicture] = useUpdateUserProfilePictureMutation();
  const [modifyUserinfos] = useUpdateUserInfosMutation();

  // USER INPUTS
  const [userFirstName, setUserFirstName] = useState<string>("");
  const [userLastName, setUserLastName] = useState<string>("");
  // ERROR MESSAGES
  const [inputErrorMessage, setInputErrorMessage] = useState<
    string | undefined
  >(undefined);
  const [selectedFile, setSelectedFile] = useState<File | undefined>(undefined);
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(undefined);
  const [imageErrorMessage, setImageErrorMessage] = useState<
    string | undefined
  >(undefined);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const resetUserInfos = () => {
    if (!user) return;
    setUserFirstName(user.firstName || "");
    setUserLastName(user.lastName || "");
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
      const modifiedUser: Partial<ApplicationUser> = {
        id: user?.id || 0,
        firstName: userFirstName,
        lastName: userLastName,
      };

      const newUserInfos = await modifyUserinfos(modifiedUser).unwrap();

      dispatch(updateUser(newUserInfos));
      resetUserInfos();
    } catch (error) {
      return error;
    }
  };

  useEffect(() => {
    if (user) {
      setUserFirstName(user.firstName || "");
      setUserLastName(user.lastName || "");
      setPreviewUrl(undefined);
    }
  }, [user]);

  return (
    <>
      <div className="flex gap-10 bg-white w-full rounded-l-[40px] px-4 py-8">
        <div className="flex flex-1 h-full bg-[#F9FAFC] rounded-3xl py-8 px-6 gap-4">
          <div className="flex gap-2">
            <div className="flex flex-col justify-between">
              <div className="flex flex-col gap-2">
                <p className="w-max px-2 py-1 bg-[#6B8AFD]/10 text-[#6B8AFD] rounded-2xl cursor-pointer">
                  My Profile
                </p>
                <p className="cursor-pointer px-2 "> Notifications </p>
                <p className="cursor-pointer px-2 "> Themes </p>
                <p className="cursor-pointer px-2 "> Security </p>
              </div>
              <div className="flex flex-col gap-2">
                <div
                  onClick={handleLogout}
                  className="flex gap-2 items-center cursor-pointer"
                  style={{ color: "var(--main-color-500)" }}
                >
                  <p> Log out </p>
                  <i className="pi pi-sign-out" />
                </div>
                <div className="flex gap-2 items-center text-red-500 cursor-pointer">
                  <p> Delete Account </p>
                  <i className="pi pi-trash"></i>
                </div>
              </div>
            </div>
            {/* Separation line */}
            <div className="w-px h-full bg-black rounded-full"></div>
          </div>
          <div className="flex flex-1 flex-col gap-10">
            <p className="font-semibold"> My Profile </p>
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
                      <p className="text-xs text-red-500">
                        {imageErrorMessage}
                      </p>
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
                    <label className="flex" htmlFor="firstname">
                      First Name
                    </label>
                    {inputErrorMessage ? (
                      <p className="text-xs text-red-500">
                        {inputErrorMessage}
                      </p>
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
                  <div className="flex flex-1 flex-col gap-1">
                    <label className="flex" htmlFor="lastName">
                      Last Name
                    </label>
                    <InputText
                      name="lastName"
                      id="lastName"
                      className="w-full border rounded border-black px-2 py-1"
                      placeholder="Last Name"
                      value={userLastName}
                      onChange={(e) => setUserLastName(e.target.value ?? "")}
                    />
                  </div>
                </div>
              </div>
              {/* Buttons */}
              <div className="flex flex-col gap-2">
                {/*{errorMessage ? (*/}
                {/*  <p className="text-xs text-red-500"> {inputErrorMessage}</p>*/}
                {/*) : null}*/}
                <div className="flex self-end gap-4">
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
        </div>
      </div>
    </>
  );
}

export default MyProfile;
