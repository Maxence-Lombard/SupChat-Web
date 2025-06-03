import { useParams } from "react-router-dom";
import {
  Message,
  useGetMessagesByChannelIdQuery,
} from "../../api/messages/messages.api.ts";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store.ts";
import { useSignalR } from "../../context/SignalRContext.tsx";
import { useEffect, useRef, useState } from "react";
import { addMessage } from "../../store/slices/messageSlice.ts";
import MessageItem from "../shared/messageItem/MessageItem.tsx";

function Channel() {
  const { channelId } = useParams();
  const { on, off, joinChannel, sendChannelMessage } = useSignalR();
  const [messageInput, setMessageInput] = useState("");
  const dispatch = useDispatch();
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const currentUserId = useSelector(
    (state: RootState) => state.users.byId[state.users.currentUserId!]?.id,
  );

  const { data: oldMessages } = useGetMessagesByChannelIdQuery(
    Number(channelId),
  );
  const messages = useSelector((state: RootState) =>
    (state.messages.channelMessages[Number(channelId)] || [])
      .slice()
      .sort((a, b) => a.id - b.id),
  );

  const handleReceiveMessage = (...args: unknown[]) => {
    const message = args[0] as Message;
    console.log("Received message:", message);
    dispatch(addMessage(message));
  };

  useEffect(() => {
    if (channelId) {
      joinChannel(Number(channelId));
    }
    if (oldMessages) {
      oldMessages.forEach((message) => {
        dispatch(addMessage(message));
      });
    }
    if (textAreaRef.current) {
      textAreaRef.current.style.height = "auto";
      textAreaRef.current.style.height =
        textAreaRef.current.scrollHeight + "px";
    }
    on("ReceiveMessage", handleReceiveMessage);

    return () => {
      off("ReceiveMessage", handleReceiveMessage);
    };
  }, [
    messages,
    channelId,
    oldMessages,
    messageInput,
    joinChannel,
    sendChannelMessage,
    on,
    off,
  ]);

  return (
    <>
      <div className="flex flex-col gap-4 h-full overflow-y-auto">
        <div className="flex flex-col items-start gap-4">
          <div className="flex flex-col gap-1 w-full">
            <div className="flex justify-between w-full">
              <p className="font-semibold text-[#6B8AFD]"> Today </p>
              <p className="font-semibold text-[#6B8AFD]"> NEW </p>
            </div>
            <hr className="flex-1 border border-[#6B8AFD]" />
          </div>
          {messages.map((message) => (
            <MessageItem
              key={message.id}
              message={message}
              currentUserId={currentUserId!}
            />
          ))}
        </div>
        <div className="flex flex-col mt-1 gap-2 w-full">
          <hr className="flex-1 border border-[#EBEBEB]" />
          <div className="flex flex-col gap-4 p-2 justify-end bg-[#F3F3F3] rounded-2xl">
            <textarea
              ref={textAreaRef}
              name="messageInput"
              id="messageInput"
              className="messageTextArea"
              placeholder="Message..."
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
            />
            <div className="flex justify-between w-full items-center">
              <div className="flex gap-4">
                <i
                  className="pi pi-plus-circle text-xl cursor-pointer"
                  style={{ color: "var(--primary-color)" }}
                />
                <i
                  className="pi pi-face-smile text-xl cursor-pointer"
                  style={{ color: "var(--primary-color)" }}
                />
                <i
                  className="pi pi-at text-xl cursor-pointer"
                  style={{ color: "var(--primary-color)" }}
                />
              </div>
              <div className="flex gap-2 items-center">
                <button className="flex gap-2 px-2 py-1 items-center bg-[#687BEC] rounded-lg">
                  <i className="pi pi-times-circle text-white" />
                  <p className="text-white">Discard</p>
                </button>
                <button
                  className="flex gap-2 px-2 py-1 items-center bg-[#687BEC] rounded-lg"
                  onClick={() => {
                    if (messageInput.trim()) {
                      sendChannelMessage({
                        content: messageInput,
                        channelId: Number(channelId),
                      });
                      setMessageInput("");
                    }
                  }}
                >
                  <i className="pi pi-send text-white" />
                  <p className="text-white">Send</p>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Channel;
