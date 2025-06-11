import { Message } from "../../api/messages/messages.api.ts";
import { useParams } from "react-router-dom";
import { useSignalR } from "../../context/SignalRContext.tsx";
import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import {
  addMessage,
  modifyMessage,
  removeMessage,
} from "../../store/slices/messageSlice.ts";
import MessageItem from "../shared/messageItem/MessageItem.tsx";
import { SignalREventConstants } from "../../constants/signalRConstants.ts";
import { useConversationMessages } from "../../hooks/useConversationMessage.ts";
import { Emoji } from "../../Models/Emoji.ts";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import { useUploadFileMutation } from "../../api/attachments/attachments.api.ts";
import { attachmentType } from "../../Models/Enums.ts";

function Conversation() {
  const { id, channelId } = useParams();
  const { messages, userId, loadMore } = useConversationMessages({
    id,
    channelId,
  });

  const { on, off, sendUserMessage, joinChannel, sendChannelMessage } =
    useSignalR();
  const dispatch = useDispatch();

  const [pickerIsEnabled, setPickerIsEnabled] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);
  const [messageInput, setMessageInput] = useState("");
  const [isAtBottom, setIsAtBottom] = useState(true);
  const previousMessagesLength = useRef(0);
  const [isSending, setIsSending] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState<
    { file: File; url: string }[]
  >([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  // REFERENCES
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollableRef = useRef<HTMLDivElement>(null);

  const [uploadFileRequest] = useUploadFileMutation();

  const getAttachmentType = (file: File): attachmentType => {
    const mime = file.type;

    if (mime.startsWith("image/")) return attachmentType.image;
    if (mime.startsWith("audio/")) return attachmentType.audio;
    if (mime.startsWith("video/")) return attachmentType.video;
    if (mime.startsWith("file/")) return attachmentType.file;
    if (mime.startsWith("link/")) return attachmentType.link;

    return attachmentType.file;
  };

  const sendMessage = async () => {
    if (!messageInput.trim() && attachedFiles.length === 0) return;

    setIsSending(true);
    try {
      const attachmentIds: string[] = [];
      if (attachedFiles.length > 0) {
        for (const { file } of attachedFiles) {
          const uploadedFile = await uploadFileRequest({
            type: getAttachmentType(file),
            file,
          }).unwrap();
          attachmentIds.push(uploadedFile.id);
        }
      }

      if (channelId) {
        await sendChannelMessage({
          content: messageInput || "",
          channelId: Number(channelId),
          parentId: undefined,
          attachments: attachmentIds,
        });
      } else {
        await sendUserMessage({
          content: messageInput || "",
          receiverId: Number(id),
          parentId: undefined,
          attachments: attachmentIds,
        });
      }

      setMessageInput("");
      attachedFiles.forEach(({ url }) => URL.revokeObjectURL(url));
      setAttachedFiles([]);
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setIsSending(false);
    }
  };

  const handleReceiveMessage = (...args: unknown[]) => {
    const message = args[0] as Message;
    dispatch(addMessage(message));
  };

  const handleMessageUpdated = (...args: unknown[]) => {
    const message = args[0] as Message;
    dispatch(modifyMessage(message));
  };

  const handleMessageDeleted = (...args: unknown[]) => {
    const messageId = args[0] as number;
    dispatch(removeMessage({ messageId: messageId, channelId: undefined }));
  };

  const handleFilesSelected = (files: FileList | null) => {
    if (!files) return;
    setAttachedFiles((prev) => [
      ...prev,
      ...Array.from(files).map((file) => ({
        file,
        url: URL.createObjectURL(file),
      })),
    ]);
  };

  const handleScroll = () => {
    const scrollElement = scrollableRef.current;
    if (!scrollElement) return;

    if (scrollElement.scrollTop === 0) {
      loadMore();
    }
    const isAtBottomNow =
      scrollElement.scrollHeight - scrollElement.scrollTop ===
      scrollElement.clientHeight;
    setIsAtBottom(isAtBottomNow);
  };

  const handleAddEmoji = (emoji: Emoji) => {
    setMessageInput((prev) => prev + emoji.native);
  };

  // SCROLLING EFFECTS
  useEffect(() => {
    if (messageInput && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "auto" });
    }
  }, [messageInput]);

  useEffect(() => {
    const el = scrollableRef.current;
    if (!el) return;
    const handleScroll = () => {
      const threshold = 50;
      setIsAtBottom(
        el.scrollHeight - el.scrollTop - el.clientHeight < threshold,
      );
    };

    el.addEventListener("scroll", handleScroll);
    return () => el.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const hasNewMessage = messages.length > previousMessagesLength.current;
    previousMessagesLength.current = messages.length;

    if (hasNewMessage && isAtBottom && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "auto" });
    }
  }, [messages, isAtBottom]);

  // SIGNALR EVENT EFFECT
  useEffect(() => {
    if (channelId) {
      joinChannel(Number(channelId));
    }
    on(SignalREventConstants.onMessageReceived, handleReceiveMessage);
    on(SignalREventConstants.onMessageUpdated, handleMessageUpdated);
    on(SignalREventConstants.onMessageDeleted, handleMessageDeleted);

    return () => {
      off(SignalREventConstants.onMessageReceived, handleReceiveMessage);
      off(SignalREventConstants.onMessageUpdated, handleMessageUpdated);
      off(SignalREventConstants.onMessageDeleted, handleMessageDeleted);
    };
  }, [channelId, on, off, sendUserMessage, joinChannel]);

  // TEXTAREA RESIZE EFFECT
  useEffect(() => {
    if (textAreaRef.current) {
      textAreaRef.current.style.height = "auto";
      textAreaRef.current.style.height =
        textAreaRef.current.scrollHeight + "px";
    }
  }, []);

  // PICKER EFFECT
  useEffect(() => {
    if (!pickerIsEnabled) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setPickerIsEnabled(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [pickerIsEnabled]);

  useEffect(() => {
    if (!pickerIsEnabled) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
        setPickerIsEnabled(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [pickerIsEnabled]);

  return (
    <>
      <div
        className="flex flex-col gap-4 h-full overflow-y-auto"
        ref={scrollableRef}
        onScroll={handleScroll}
      >
        <div className="flex flex-col items-start gap-4">
          {messages.map((message) => (
            <MessageItem
              key={message.id}
              message={message}
              currentUserId={userId!}
            />
          ))}
        </div>
        {!isAtBottom ? (
          <button
            onClick={() => {
              messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
            }}
            className="fixed py-1 px-2 bottom-40 right-6 bg-[#F3F3F3] rounded-full"
          >
            <i className="pi pi-arrow-down" />
          </button>
        ) : null}
        <div ref={messagesEndRef} className="h-0" />
      </div>
      {/* Message input */}
      <div className="flex flex-col mt-1 gap-2 w-full">
        <hr className="flex-1 border border-[#EBEBEB]" />
        <div className="relative">
          {pickerIsEnabled ? (
            <div
              ref={pickerRef}
              className="absolute right-0 bottom-full mb-2 z-10"
            >
              <Picker
                data={data}
                onEmojiSelect={(emoji: Emoji) => handleAddEmoji(emoji)}
              />
            </div>
          ) : null}
          <div
            className="flex flex-col gap-4 p-2 justify-end bg-[#F3F3F3] rounded-2xl"
            onDrop={(e) => {
              e.preventDefault();
              handleFilesSelected(e.dataTransfer.files);
            }}
            onDragOver={(e) => e.preventDefault()}
          >
            <input
              type="file"
              multiple
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={(e) => handleFilesSelected(e.target.files)}
            />
            {attachedFiles.length > 0 && (
              <div className="flex gap-2 mb-2 flex-wrap">
                {attachedFiles.map(({ file, url }, index) => {
                  const isImage = file.type.startsWith("image/");
                  const isText =
                    file.type === "text/plain" || file.name.endsWith(".rtf");

                  return (
                    <div
                      key={index}
                      className="relative w-24 h-24 border rounded p-1 bg-white shadow"
                    >
                      {isImage ? (
                        <>
                          <img
                            src={url}
                            className="object-cover w-full h-full rounded"
                            alt={file.name}
                          />
                        </>
                      ) : isText ? (
                        <div className="flex items-center justify-center w-full h-full">
                          <i className="pi pi-file text-3xl text-[var(--main-color-500)]" />
                        </div>
                      ) : (
                        <div className="flex items-center justify-center w-full h-full">
                          <i className="pi pi-file text-3xl text-black/50" />
                        </div>
                      )}
                      <p
                        className="text-sm flex-1 truncate mt-1"
                        title={file.name}
                      >
                        {file.name}
                      </p>
                      <button
                        className="absolute top-0 right-0 text-xs text-white bg-red-600 rounded-full w-5 h-5 flex items-center justify-center"
                        onClick={() => {
                          URL.revokeObjectURL(attachedFiles[index].url);
                          setAttachedFiles((prev) =>
                            prev.filter((_, i) => i !== index),
                          );
                        }}
                      >
                        ✕
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
            <textarea
              ref={textAreaRef}
              name="messageInput"
              id="messageInput"
              className="messageTextArea"
              placeholder="Message..."
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey && !isSending) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
            />
            <div className="flex justify-between w-full items-center">
              <div className="flex gap-4">
                <i
                  onClick={() => fileInputRef.current?.click()}
                  className="pi pi-plus-circle text-xl cursor-pointer"
                  style={{ color: "var(--main-color-500)" }}
                />
                <i
                  onClick={() => setPickerIsEnabled(true)}
                  className="pi pi-face-smile text-xl cursor-pointer"
                  style={{ color: "var(--main-color-500)" }}
                />
              </div>
              <button
                disabled={isSending}
                className="flex gap-2 px-2 py-1 items-center bg-[var(--main-color-500)] rounded-lg"
                onClick={() => sendMessage()}
              >
                <i className="pi pi-send text-white" />
                <p className="text-white">Send</p>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Conversation;
