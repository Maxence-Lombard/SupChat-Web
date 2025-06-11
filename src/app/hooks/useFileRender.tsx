import { useEffect } from "react";
import {
  AttachmentDto,
  useDownloadFileMutation,
} from "../api/attachments/attachments.api.ts";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store.ts";
import { addAttachment } from "../store/slices/attachmentSlice.ts";

export function useFileUrls(attachments: AttachmentDto[]) {
  const dispatch = useDispatch();
  const fileUrls = useSelector((state: RootState) => state.attachments);
  const [downloadFile] = useDownloadFileMutation();

  useEffect(() => {
    const fetchAll = async () => {
      const missingFiles = attachments.filter((file) => !fileUrls[file.id]);
      for (const file of missingFiles) {
        try {
          const blob = await downloadFile(file.id).unwrap();
          const blobUrl = URL.createObjectURL(blob);
          dispatch(addAttachment({ id: file.id, url: blobUrl }));
        } catch (error) {
          console.error("Download error for file", file.name, error);
        }
      }
    };

    if (attachments.length > 0) fetchAll();
  }, [attachments, fileUrls]);

  return fileUrls;
}
