import userIcon from "../../../assets/placeholder/user4.svg";
import user2 from "../../../assets/placeholder/user3.svg";
import { useParams } from "react-router-dom";
import { useGetMessagesByChannelIdQuery } from "../../api/messages/messages.api.ts";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store.ts";
import { useDateFormatter } from "../../hooks/useDateFormatter.tsx";
import useSignalR from "../../hooks/useSignalR.tsx";
import { useEffect, useRef, useState } from "react";
import { addMessage } from "../../store/slices/messageSlice.ts";

function Channel() {
  const { channelId } = useParams();
  const { formatDate } = useDateFormatter();
  const { joinChannel, sendChannelMessage } = useSignalR();
  const [messageInput, setMessageInput] = useState("");
  const dispatch = useDispatch();
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const userId = useSelector(
    (state: RootState) => state.user.applicationUser.id,
  );

  const { data: oldMessages } = useGetMessagesByChannelIdQuery(
    Number(channelId),
  );
  const messages = useSelector((state: RootState) =>
    (state.messages.channelMessages[Number(channelId)] || [])
      .slice()
      .sort((a, b) => a.id - b.id),
  );

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
  }, [channelId, joinChannel, oldMessages, dispatch, messageInput]);

  return (
    <>
      <div className="flex flex-col gap-4 h-full overflow-y-auto">
        <div className="flex flex-col gap-1 w-full">
          <p className="font-semibold"> November 15 2024 CHANNEL </p>
          <hr className="flex-1 border border-black" />
        </div>
        <div className="flex flex-col items-start gap-4">
          <div className="flex items-end gap-3">
            <img src={userIcon} alt="userIcon" />
            <div className="flex flex-col gap-1 items-end">
              <p className="text-black/50"> 15h32 </p>
              <div className="flex bg-[#EBEBEB] rounded-lg px-2 max-w-xl">
                <p className="text-black">
                  {" "}
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Ut enim ad minim veniam, quis{" "}
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-end gap-3">
            <img src={userIcon} alt="userIcon" />
            <div className="flex flex-col gap-1 items-end">
              <p className="text-black/50"> 15h32 </p>
              <div className="flex bg-[#EBEBEB] rounded-lg px-2 max-w-xl">
                <p className="text-black">
                  {" "}
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Ut enim ad minim veniam, quis{" "}
                </p>
              </div>
            </div>
          </div>
          <div className="flex justify-end items-end w-full gap-3">
            <div className="flex flex-col gap-1 items-end">
              <p className="text-black/50"> 15h32 </p>
              <div className="flex bg-[#687BEC] rounded-lg px-2 max-w-xl">
                <p className="text-white"> Sure </p>
              </div>
            </div>
            <img src={user2} alt="user" />
          </div>
          <div className="flex flex-col gap-1 w-full">
            <p className="font-semibold"> Yesterday </p>
            <hr className="flex-1 border border-black" />
          </div>
          <div className="flex items-end gap-3">
            <img src={userIcon} alt="userIcon" />
            <div className="flex flex-col gap-1 items-end">
              <p className="text-black/50"> 15h32 </p>
              <div className="flex bg-[#EBEBEB] rounded-lg px-2 max-w-xl">
                <p className="text-black">
                  {" "}
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Ut enim ad minim veniam, quis{" "}
                </p>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-1 w-full">
            <div className="flex justify-between w-full">
              <p className="font-semibold text-[#6B8AFD]"> Today </p>
              <p className="font-semibold text-[#6B8AFD]"> NEW </p>
            </div>
            <hr className="flex-1 border border-[#6B8AFD]" />
          </div>
          {messages.map((message) =>
            message.senderId === userId ? (
              <div
                className="flex justify-end items-end w-full gap-3"
                key={message.id}
              >
                <div className="flex flex-col gap-1 items-end">
                  <p className="text-black/50">
                    {" "}
                    {formatDate(message.sendDate, "HH'h'mm")}{" "}
                  </p>
                  <div className="flex bg-[#687BEC] rounded-lg px-2 max-w-xl">
                    <p className="text-white"> {message.content} </p>
                  </div>
                </div>
                <img src={user2} alt="user" />
              </div>
            ) : (
              <div className="flex items-end gap-3" key={message.id}>
                <img src={userIcon} alt="userIcon" />
                <div className="flex flex-col gap-1">
                  <p className="text-black/50">
                    {" "}
                    {formatDate(message.sendDate, "HH'h'mm")}{" "}
                  </p>
                  <div className="flex bg-[#EBEBEB] rounded-lg px-2 max-w-xl">
                    <p className="text-black"> {message.content} </p>
                  </div>
                </div>
              </div>
            ),
          )}
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
      </div>
    </>
  );
}

export default Channel;
