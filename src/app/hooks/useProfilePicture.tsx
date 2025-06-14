import { useEffect, useState } from "react";
import { useDownloadFileMutation } from "../api/attachments/attachments.api.ts";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store.ts";
import { addAttachment } from "../store/slices/attachmentSlice.ts";

const pendingDownloads: Record<string, Promise<void>> = {};

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
      return;
    }
    if (pendingDownloads[profilePictureId] !== undefined) {
      await pendingDownloads[profilePictureId];
      return;
    }
    pendingDownloads[profilePictureId] = (async () => {
      const blob = await GetProfilePicture(profilePictureId).unwrap();
      const url = URL.createObjectURL(blob);
      dispatch(addAttachment({ id: profilePictureId, url }));
    })();
    await pendingDownloads[profilePictureId];
    delete pendingDownloads[profilePictureId];
  };

  useEffect(() => {
    if (!profilePictureId) {
      setUserImage(undefined);
    } else if (profilePictureUrls[profilePictureId]) {
      setUserImage(profilePictureUrls[profilePictureId]);
    } else {
      setUserProfilePicture();
    }
  }, [profilePictureId, profilePictureUrls]);

  return userImage;
};

export default useProfilePicture;
