import userIcon from "../../../assets/placeholder/user4.svg";
import user2 from "../../../assets/placeholder/user3.svg";
import { useGetMessagesByUserIdQuery } from "../../api/messages/messages.api.ts";
import { useLocation, useParams } from "react-router-dom";
import DiscussionsListing from "../shared/discussions-listing/DiscussionsListing.tsx";
import { useEffect, useRef, useState } from "react";
import { ApplicationUser } from "../../Models/User.ts";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store.ts";
import { addMessage } from "../../store/slices/messageSlice.ts";
import useSignalR from "../../hooks/useSignalR.tsx";
import useUserProfilePicture from "../../hooks/useUserProfilePicture.tsx";
import MessageItem from "../shared/messageItem/MessageItem.tsx";

function Conversation() {
  const { id } = useParams();
  const { sendUserMessage } = useSignalR();
  const [messageInput, setMessageInput] = useState("");
  const dispatch = useDispatch();
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const currentUserPPId = useSelector(
    (state: RootState) =>
      state.users.byId[state.users.currentUserId!]?.applicationUser
        ?.profilePictureId,
  );
  const userId = useSelector(
    (state: RootState) =>
      state.users.byId[state.users.currentUserId!].applicationUser?.id,
  );

  const location = useLocation();
  const user: ApplicationUser = location.state?.user;
  const userImage = useUserProfilePicture(user.profilePictureId);
  const currentUserImage = useUserProfilePicture(currentUserPPId || "");

  const { data: oldMessages } = useGetMessagesByUserIdQuery(Number(id));

  const conversationKey = [userId, id].sort((a, b) => a - b).join("_");
  const messages = useSelector((state: RootState) =>
    (state.messages.privateMessages[Number(conversationKey)] || [])
      .slice()
      .sort((a, b) => a.id - b.id),
  );

  useEffect(() => {
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
  }, [oldMessages, dispatch, messageInput]);

  return (
    <>
      <div className="flex gap-10 bg-white w-full rounded-l-[40px] px-4 py-8">
        {/*Left Panel*/}
        <DiscussionsListing />
        <div className="flex flex-col flex-1">
          {/* User Banner */}
          <div className="flex mb-8 w-full items-center justify-between border border-[#ECECEC] rounded-2xl px-4 py-2">
            <div className="flex items-center gap-2">
              <img
                src={userImage}
                alt="userImage"
                className="w-14 h-14 rounded-lg"
              />
              <div>
                <p className="font-semibold"> {user.firstName} </p>
                <p className="text-[#00A000] text-xs"> {user.status} </p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <i
                className="pi pi-search text-xl cursor-pointer"
                style={{ color: "var(--primary-color)" }}
              ></i>
              <i
                className="pi pi-info-circle text-xl cursor-pointer"
                style={{ color: "var(--primary-color)" }}
              ></i>
              <i
                className="pi pi-ellipsis-v text-xl cursor-pointer"
                style={{ color: "var(--primary-color)" }}
              ></i>
            </div>
          </div>
          {/* Conversations */}
          <div className="flex flex-col gap-4 h-full overflow-y-auto">
            <div className="flex flex-col gap-1 w-full">
              <p className="font-semibold"> November 15 2024 </p>
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
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                      sed do eiusmod tempor incididunt ut labore et dolore magna
                      aliqua. Ut enim ad minim veniam, quis{" "}
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
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                      sed do eiusmod tempor incididunt ut labore et dolore magna
                      aliqua. Ut enim ad minim veniam, quis{" "}
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
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                      sed do eiusmod tempor incididunt ut labore et dolore magna
                      aliqua. Ut enim ad minim veniam, quis{" "}
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
              {messages.map((message) => (
                <MessageItem
                  key={message.id}
                  message={message}
                  currentUserId={userId!}
                  currentUserImage={currentUserImage}
                />
              ))}
            </div>
            {/* Message input */}
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
                          sendUserMessage({
                            content: messageInput,
                            receiverId: Number(id),
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
      </div>
    </>
  );
}

export default Conversation;
