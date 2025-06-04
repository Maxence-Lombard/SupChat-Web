import { useDispatch, useSelector } from "react-redux";
import { useDateFormatter } from "../../../hooks/useDateFormatter.tsx";
import { RootState } from "../../../store/store.ts";
import {
  Message,
  Reaction,
  useGetMessageReactionsQuery,
} from "../../../api/messages/messages.api.ts";
import React, { useEffect, useRef, useState } from "react";
import { useGetUserInfosByIdMutation } from "../../../api/user/user.api.ts";
import { ApplicationUser } from "../../../Models/User.ts";
import useProfilePicture from "../../../hooks/useProfilePicture.tsx";
import { addUser } from "../../../store/slices/usersSlice.ts";
import ProfilePictureAvatar from "../profilePictureAvatar/ProfilePictureAvatar.tsx";
import {
  modifyMessage,
  removeMessage,
} from "../../../store/slices/messageSlice.ts";
import { InputText } from "primereact/inputtext";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { Emoji } from "../../../Models/Emoji.ts";
import {
  addReaction,
  removeReaction,
  selectReactionsByMessageId,
} from "../../../store/slices/reactionSlice.ts";
import ReactionsDisplay from "../reactionsDisplay/ReactionsDisplay.tsx";
import { useSignalR } from "../../../context/SignalRContext.tsx";
import { SignalREventConstants } from "../../../constants/signalRConstants.ts";

type MessageProps = {
  message: Message;
  currentUserId: number;
};

function MessageItem({ message, currentUserId }: MessageProps) {
  const dispatch = useDispatch();
  const pickerRef = useRef<HTMLDivElement>(null);
  const {
    on,
    off,
    editUserMessage,
    deleteUserMessage,
    sendReaction,
    deleteReaction,
  } = useSignalR();

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editedMessage, setEditedMessage] = useState<Message>(message);
  const [pickerIsEnabled, setPickerIsEnabled] = useState<boolean>(false);

  const storeUser = useSelector(
    (state: RootState) => state.users.byId[message.senderId],
  );
  const reactions = useSelector(selectReactionsByMessageId(message.id));

  const [user, setUser] = useState<Partial<ApplicationUser> | undefined>(
    storeUser,
  );
  const [profilePictureId, setProfilePictureId] = useState<string>(
    user?.profilePictureId || "",
  );

  const { formatDate } = useDateFormatter();
  const { data: fetchedReactions } = useGetMessageReactionsQuery(message.id);
  const [getUserInfos] = useGetUserInfosByIdMutation();

  const handleModifyMessage = () => {
    setIsEditing(true);
    setEditedMessage(message);
  };

  const handleEditingKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      editUserMessage({
        messageId: message.id,
        content: editedMessage.content,
      });
      dispatch(modifyMessage(editedMessage));
      setIsEditing(false);
    } else if (e.key === "Escape") {
      setIsEditing(false);
      setEditedMessage(message);
    }
  };

  const handleStopEditing = () => {
    setIsEditing(false);
    setEditedMessage(message);
  };

  const handleDeleteMessage = (messageId: number) => {
    deleteUserMessage(messageId);
    dispatch(
      removeMessage({
        messageId: messageId,
        channelId: message.channelId || undefined,
      }),
    );
  };

  const handleAddReaction = async (emoji: Emoji) => {
    const createdReaction = {
      messageId: message.id,
      content: emoji.native,
    };
    sendReaction(createdReaction);
    setPickerIsEnabled(false);
  };

  const handleReceiveReaction = (...args: unknown[]) => {
    const reaction = args[0] as Reaction;
    console.log("Received reaction:", reaction);
    dispatch(addReaction(reaction));
  };

  const handleReceiveDeletedReaction = (...args: unknown[]) => {
    const reactionId = args[0] as number;
    console.log("Deleted reaction:", reactionId);
    dispatch(removeReaction(reactionId));
    dispatch(removeReaction(reactionId));
  };

  const handleToggleReaction = async (reactionContent: string) => {
    const userReaction = reactions?.find(
      (reaction) =>
        reaction.content === reactionContent &&
        reaction.senderId === currentUserId,
    );
    if (userReaction) {
      await deleteReaction({
        messageId: userReaction.messageId,
        reactionId: userReaction.id,
      });
      removeReaction(userReaction.id);
    } else {
      await handleAddReaction({ native: reactionContent } as Emoji);
    }
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      pickerRef.current &&
      !pickerRef.current.contains(event.target as Node)
    ) {
      setPickerIsEnabled(false);
    }
  };
  const handleEscape = (event: KeyboardEvent) => {
    if (event.key === "Escape") {
      setPickerIsEnabled(false);
    }
  };

  useEffect(() => {
    if (!storeUser) {
      getUserInfos(message.senderId)
        .unwrap()
        .then((data) => {
          setUser(data);
          setProfilePictureId(data.profilePictureId || "");
          dispatch(addUser(data));
        });
    }
  }, [storeUser, message.senderId]);

  useEffect(() => {
    on(SignalREventConstants.receivedReaction, handleReceiveReaction);
    on("DeleteReaction", handleReceiveDeletedReaction);

    return () => {
      off("AddReaction", handleReceiveReaction);
      off("DeleteReaction", handleReceiveDeletedReaction);
    };
  }, [on, off]);

  useEffect(() => {
    if (reactions.length === 0 && fetchedReactions) {
      fetchedReactions.forEach((reaction) => dispatch(addReaction(reaction)));
    }
  }, [fetchedReactions]);

  useEffect(() => {
    if (pickerIsEnabled) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscape);
    }
  }, [pickerIsEnabled]);

  const userImage = useProfilePicture(profilePictureId);

  if (message.senderId === currentUserId) {
    return (
      <div className="flex flex-col gap-2 w-full group">
        <div
          className="flex justify-end items-end w-full gap-3"
          key={message.id}
        >
          <div className="flex flex-col gap-1 items-end">
            {isEditing ? (
              <>
                <InputText
                  autoFocus
                  value={editedMessage.content}
                  onChange={(e) =>
                    setEditedMessage({
                      ...editedMessage,
                      content: e.target.value,
                    })
                  }
                  onKeyDown={handleEditingKeyDown}
                  onBlur={handleStopEditing}
                  className="text-right"
                />
                <div className="flex gap-1">
                  <p className="text-xs text-[var(--main-color-500)]">Enter</p>
                  <p className="text-xs"> to save </p>
                  <p className="text-xs"> - </p>
                  <p className="text-xs text-[var(--main-color-500)]">Escape</p>
                  <p className="text-xs"> to cancel </p>
                </div>
              </>
            ) : (
              <>
                <div className="flex flex-col gap-1 items-end">
                  <div className="flex w-full gap-4 items-center justify-between">
                    <div className="hidden group-hover:flex gap-2">
                      <i
                        className="pi pi-trash cursor-pointer text-red-500"
                        onClick={() => handleDeleteMessage(message.id)}
                      />
                      <i
                        className="pi pi-pencil text-black/50 cursor-pointer"
                        onClick={handleModifyMessage}
                      />
                    </div>
                    <p className="text-black/50 text-right w-full">
                      {formatDate(message.sendDate, "HH'h'mm")}
                    </p>
                  </div>
                  <div className="flex bg-[#687BEC] rounded-lg px-2 max-w-xl">
                    <p className="text-white w-full break-words">
                      {editedMessage.content}
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>
          <ProfilePictureAvatar
            avatarType={"user"}
            url={userImage}
            altText={user?.firstName?.charAt(0).toUpperCase()}
          />
        </div>
        <div className="relative">
          <div className="flex justify-end mr-[60px] gap-2 items-center">
            <i
              className="pi pi-face-smile hidden group-hover:flex text-black/50 cursor-pointer"
              onClick={() => setPickerIsEnabled(true)}
            />
            {reactions && reactions.length > 0 ? (
              <ReactionsDisplay
                reactions={reactions}
                currentUserId={currentUserId}
                onToggleReaction={handleToggleReaction}
              />
            ) : null}
          </div>

          {pickerIsEnabled ? (
            <div
              ref={pickerRef}
              className="absolute z-10 right-0 top-full mt-2"
            >
              <Picker
                data={data}
                onEmojiSelect={(emoji: Emoji) => handleAddReaction(emoji)}
              />
            </div>
          ) : null}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 w-full group">
      <div className="flex items-end w-full gap-3" key={message.id}>
        <ProfilePictureAvatar
          avatarType={"user"}
          url={userImage}
          altText={user?.firstName?.charAt(0).toUpperCase()}
        />
        <div className="flex flex-col gap-1">
          <p className="text-black/50">
            {formatDate(message.sendDate, "HH'h'mm")}
          </p>
          <div className="flex bg-[#EBEBEB] rounded-lg px-2 max-w-xl">
            <p className="text-black w-full break-words">{message.content}</p>
          </div>
        </div>
      </div>
      <div className="relative">
        <div className="flex ml-[60px] gap-2 items-center">
          {reactions && reactions.length > 0 ? (
            <ReactionsDisplay
              reactions={reactions}
              currentUserId={currentUserId}
              onToggleReaction={handleToggleReaction}
            />
          ) : null}
          <i
            className="pi pi-face-smile hidden group-hover:flex text-black/50 cursor-pointer"
            onClick={() => setPickerIsEnabled(true)}
          />
        </div>

        {pickerIsEnabled ? (
          <div ref={pickerRef} className="absolute z-10 left-0 top-full mt-2">
            <Picker
              data={data}
              onEmojiSelect={(emoji: Emoji) => handleAddReaction(emoji)}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default MessageItem;
