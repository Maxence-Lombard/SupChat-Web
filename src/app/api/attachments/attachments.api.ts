import { api } from "../api.ts";
import { attachmentType } from "../../Models/Enums.ts";

//DTO
export type AttachmentDto = {
  id: string;
  name: string;
  type: attachmentType;
  typeLocalized: string;
};

type UploadImageDto = {
  type: attachmentType;
  file: File;
};

export const AttachmentsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    uploadFile: builder.mutation<AttachmentDto, UploadImageDto>({
      query: (data) => {
        const formData = new FormData();
        formData.append("file", data.file);
        return {
          url: `/api/Attachment/upload?attachmentType=${data.type}`,
          method: "POST",
          body: formData,
        };
      },
    }),

    downloadFile: builder.mutation<Blob, string>({
      query: (fileUuid) => {
        return {
          url: `/api/Attachment/download/${fileUuid}`,
          method: "GET",
          responseHandler: (response) => response.blob(),
        };
      },
    }),

    deleteFile: builder.mutation<string, string>({
      query: (fileUuid) => {
        return {
          url: `/api/Attachment/delete/${fileUuid}`,
          method: "DELETE",
        };
      },
    }),
  }),
});

export const {
  useUploadFileMutation,
  useDownloadFileMutation,
  useDeleteFileMutation,
} = AttachmentsApi;
