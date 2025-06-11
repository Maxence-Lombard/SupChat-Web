import { useEffect, useState } from "react";
import { useDownloadFileMutation } from "../api/attachments/attachments.api.ts";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store.ts";
import { addAttachment } from "../store/slices/attachmentSlice.ts";

const useProfilePicture = (profilePictureId: string | undefined) => {
  const dispatch = useDispatch();
  const [userImage, setUserImage] = useState<string | undefined>(undefined);
  const [GetProfilePicture] = useDownloadFileMutation();
  const profilePictureUrls = useSelector(
    (state: RootState) => state.attachments,
  );

  const setUserProfilePicture = async () => {
    if (!profilePictureId) return;
    if (profilePictureUrls[profilePictureId]) {
      setUserImage(profilePictureUrls[profilePictureId]);
      return;
    }
    const blob = await GetProfilePicture(profilePictureId).unwrap();
    const url = URL.createObjectURL(blob);
    dispatch(addAttachment({ id: profilePictureId, url }));
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
