import { useEffect, useState } from "react";
import { useDownloadFileMutation } from "../api/attachments/attachments.api.ts";
import userPlaceHolder from "../../assets/placeholder/user1.svg";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store.ts";
import { addProfilePicture } from "../store/slices/profilePictureSlice.ts";

const useProfilePicture = (profilePictureId: string) => {
  const dispatch = useDispatch();
  const [userImage, setUserImage] = useState<string>(userPlaceHolder);
  const [GetProfilePicture] = useDownloadFileMutation();
  const profilePictureUrls = useSelector(
    (state: RootState) => state.profilePictures,
  );

  const setUserProfilePicture = async () => {
    if (!profilePictureId) return;
    if (profilePictureUrls[profilePictureId]) {
      setUserImage(profilePictureUrls[profilePictureId]);
      return;
    }
    const blob = await GetProfilePicture(profilePictureId).unwrap();
    const url = URL.createObjectURL(blob);
    dispatch(addProfilePicture({ id: profilePictureId, url }));
    setUserImage(url);
  };

  useEffect(() => {
    if (profilePictureId) {
      setUserProfilePicture();
    }
  }, [profilePictureId]);

  return userImage;
};

export default useProfilePicture;
