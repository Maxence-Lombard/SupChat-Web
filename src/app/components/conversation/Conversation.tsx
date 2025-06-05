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

function Conversation() {
  const { id, channelId } = useParams();
  const { messages, oldMessages, userId } = useConversationMessages({
    id,
    channelId,
  });

  const { on, off, sendUserMessage, joinChannel, sendChannelMessage } =
    useSignalR();
  const dispatch = useDispatch();

  const [messageInput, setMessageInput] = useState("");
  const [isAtBottom, setIsAtBottom] = useState(true);
  const previousMessagesLength = useRef(0);
  // REFERENCES
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollableRef = useRef<HTMLDivElement>(null);

  const sendMessage = () => {
    if (messageInput.trim()) {
      if (channelId) {
        sendChannelMessage({
          content: messageInput,
          channelId: Number(channelId),
        });
      } else {
        sendUserMessage({
          content: messageInput,
          receiverId: Number(id),
        });
      }
      setMessageInput("");
    }
  };

  const handleReceiveMessage = (...args: unknown[]) => {
    const message = args[0] as Message;
    console.log("Received message:", message);
    dispatch(addMessage(message));
  };

  const handleMessageUpdated = (...args: unknown[]) => {
    const message = args[0] as Message;
    console.log("Received updated message:", message);
    console.log("Message updated:", message);
    dispatch(modifyMessage(message));
  };

  const handleMessageDeleted = (...args: unknown[]) => {
    const messageId = args[0] as number;
    console.log("Deleted message:", messageId);
    dispatch(removeMessage({ messageId: messageId, channelId: undefined }));
  };

  // SCROLLING EFFECTS
  useEffect(() => {
    if (oldMessages?.length && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "auto" });
    }
  }, [oldMessages]);

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
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isAtBottom]);

  // SIGNALR EVENT EFFECT
  useEffect(() => {
    if (channelId) {
      joinChannel(Number(channelId));
    }
    on(SignalREventConstants.receivedMessage, handleReceiveMessage);
    on(SignalREventConstants.updatedMessage, handleMessageUpdated);
    on(SignalREventConstants.deletedReaction, handleMessageDeleted);

    return () => {
      off(SignalREventConstants.receivedMessage, handleReceiveMessage);
      off(SignalREventConstants.updatedMessage, handleMessageUpdated);
      off(SignalREventConstants.deletedReaction, handleMessageDeleted);
    };
  }, [channelId, on, off, sendUserMessage, joinChannel, sendChannelMessage]);

  // MESSAGES STORAGE & TEXTAREA RESIZE EFFECT
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
  }, [oldMessages, dispatch]);

  return (
    <>
      <div
        className="flex flex-col gap-4 h-full overflow-y-auto"
        ref={scrollableRef}
      >
        {/*<div className="flex flex-col gap-1 w-full">*/}
        {/*  <p className="font-semibold"> November 15 2024 </p>*/}
        {/*  <hr className="flex-1 border border-black" />*/}
        {/*</div>*/}
        <div className="flex flex-col items-start gap-4">
          {/*<div className="flex items-end gap-3">*/}
          {/*  <img src={userIcon} alt="userIcon" />*/}
          {/*  <div className="flex flex-col gap-1 items-end">*/}
          {/*    <p className="text-black/50"> 15h32 </p>*/}
          {/*    <div className="flex bg-[#EBEBEB] rounded-lg px-2 max-w-xl">*/}
          {/*      <p className="text-black">*/}
          {/*        {" "}*/}
          {/*        Lorem ipsum dolor sit amet, consectetur adipiscing elit,*/}
          {/*        sed do eiusmod tempor incididunt ut labore et dolore magna*/}
          {/*        aliqua. Ut enim ad minim veniam, quis{" "}*/}
          {/*      </p>*/}
          {/*    </div>*/}
          {/*  </div>*/}
          {/*</div>*/}
          {/*<div className="flex justify-end items-end w-full gap-3">*/}
          {/*  <div className="flex flex-col gap-1 items-end">*/}
          {/*    <p className="text-black/50"> 15h32 </p>*/}
          {/*    <div className="flex bg-[#687BEC] rounded-lg px-2 max-w-xl">*/}
          {/*      <p className="text-white"> Sure </p>*/}
          {/*    </div>*/}
          {/*  </div>*/}
          {/*  <img src={user2} alt="user" />*/}
          {/*</div>*/}
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
        <div className="flex flex-col gap-4 p-2 justify-end bg-[#F3F3F3] rounded-2xl">
          <textarea
            ref={textAreaRef}
            name="messageInput"
            id="messageInput"
            className="messageTextArea"
            placeholder="Message..."
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
          />
          <div className="flex justify-between w-full items-center">
            <div className="flex gap-4">
              <i
                className="pi pi-plus-circle text-xl cursor-pointer"
                style={{ color: "var(--main-color-500)" }}
              />
              <i
                className="pi pi-face-smile text-xl cursor-pointer"
                style={{ color: "var(--main-color-500)" }}
              />
              <i
                className="pi pi-at text-xl cursor-pointer"
                style={{ color: "var(--main-color-500)" }}
              />
            </div>
            <button
              className="flex gap-2 px-2 py-1 items-center bg-[var(--main-color-500)] rounded-lg"
              onClick={() => sendMessage()}
            >
              <i className="pi pi-send text-white" />
              <p className="text-white">Send</p>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Conversation;
