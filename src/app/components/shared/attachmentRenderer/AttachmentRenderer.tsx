import { useFileUrls } from "../../../hooks/useFileRender.tsx";
import { MessageAttachments } from "../../../api/messages/messages.api.ts";

export function AttachmentRenderer({
  attachments,
}: {
  attachments: MessageAttachments[];
}) {
  const attachmentDtos = attachments.map((a) => a.attachment);
  const fileUrls = useFileUrls(attachmentDtos);

  if (!attachments || attachments.length === 0) return null;

  return (
    <div className="flex flex-col gap-2 mt-2">
      {attachments.map((file) => {
        const { attachment } = file;
        const blobUrl = fileUrls[attachment.id];
        const isImage = attachment.typeLocalized === "Image";
        if (!blobUrl) {
          return (
            <p key={file.id} className="text-sm italic text-gray-400">
              Loading {attachment.name}...
            </p>
          );
        }

        return (
          <div key={file.id} className="max-w-xs">
            {isImage ? (
              <img
                src={blobUrl}
                alt={attachment.name}
                className="rounded-lg max-h-60 object-contain"
              />
            ) : (
              <div className="flex gap-2 items-center rounded-lg border border-[#ECECEC] p-2 text-[var(--main-color-500)]">
                <i className="pi pi-file text-4xl" />
                <a
                  href={blobUrl}
                  download={attachment.name}
                  className="hover:underline flex items-center gap-2"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {attachment.name}
                </a>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
