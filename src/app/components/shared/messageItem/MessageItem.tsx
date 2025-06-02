import { useDispatch, useSelector } from "react-redux";
import { useDateFormatter } from "../../../hooks/useDateFormatter.tsx";
import { RootState } from "../../../store/store.ts";
import {
  Message,
  useCreateMessageReactionsMutation,
  useDeleteMessageMutation,
  useGetMessageReactionsQuery,
  useModifyMessageMutation,
} from "../../../api/messages/messages.api.ts";
import React, { useEffect, useState } from "react";
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

type MessageProps = {
  message: Message;
  currentUserId: number;
};

function MessageItem({ message, currentUserId }: MessageProps) {
  const dispatch = useDispatch();

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editedMessage, setEditedMessage] = useState<Message>(message);
  const [pickerIsEnabled, setPickerIsEnabled] = useState<boolean>(false);

  const storeUser = useSelector(
    (state: RootState) => state.users.byId[message.senderId],
  );
  const [user, setUser] = useState<Partial<ApplicationUser> | undefined>(
    storeUser,
  );
  const [profilePictureId, setProfilePictureId] = useState<string>(
    user?.profilePictureId || "",
  );

  const { formatDate } = useDateFormatter();
  const { data: reactions } = useGetMessageReactionsQuery(message.id);
  const [addReactionRequest] = useCreateMessageReactionsMutation();
  const [getUserInfos] = useGetUserInfosByIdMutation();
  const [modifyMessageRequest] = useModifyMessageMutation();
  const [deleteMessage] = useDeleteMessageMutation();

  const handleModifyMessage = () => {
    setIsEditing(true);
    setEditedMessage(message);
  };

  const handleEditingKeyDown = async (
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Enter") {
      await modifyMessageRequest({
        messageId: message.id,
        content: editedMessage.content,
      }).unwrap();
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
    deleteMessage(messageId).unwrap();
    dispatch(
      removeMessage({ messageId, channelId: message.channelId || undefined }),
    );
  };

  const handleAddReaction = (emoji: Emoji) => {
    console.log("Adding reaction:", emoji.native);
    addReactionRequest({
      messageId: message.id,
      content: { content: emoji.native },
    });
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

  const userImage = useProfilePicture(profilePictureId);

  if (message.senderId === currentUserId) {
    return (
      <div className="flex flex-col gap-2 w-full">
        <div
          className="flex justify-end items-end w-full gap-3 group"
          key={message.id}
        >
          <div className="flex flex-col w-full gap-1 items-end">
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
                  <p className="text-xs text-[var(--main-color-500)]">
                    {" "}
                    Escape{" "}
                  </p>
                  <p className="text-xs"> to cancel </p>
                </div>
              </>
            ) : (
              <>
                <div className="flex gap-4 items-center justify-between">
                  <p className="text-black/50">
                    {formatDate(message.sendDate, "HH'h'mm")}
                  </p>
                  <div className="hidden group-hover:flex gap-2">
                    <i
                      className="pi pi-pencil text-black/50 cursor-pointer"
                      onClick={handleModifyMessage}
                    />
                    <i
                      className="pi pi-trash cursor-pointer text-red-500"
                      onClick={() => handleDeleteMessage(message.id)}
                    />
                  </div>
                </div>
                <div className="flex bg-[#687BEC] rounded-lg px-2 max-w-xl">
                  <p className="text-white">{editedMessage.content}</p>
                </div>
                <div className="flex gap-2 items-center">
                  {reactions && reactions.length > 0 ? (
                    <div className="flex gap-2 items-center">
                      {Object.entries(
                        reactions.reduce(
                          (acc, reaction) => {
                            acc[reaction.content] =
                              (acc[reaction.content] || 0) + 1;
                            return acc;
                          },
                          {} as Record<string, number>,
                        ),
                      ).map(([content, count]) => (
                        <p
                          key={content}
                          className="flex p-1 items-center gap-1 border border-[var(--main-color-500)] rounded text-xs cursor-pointer"
                        >
                          {content}
                          <span className="font-semibold">{count}</span>
                        </p>
                      ))}
                    </div>
                  ) : null}
                  <i
                    className="pi pi-face-smile hidden group-hover:flex text-black/50 cursor-pointer"
                    onClick={() => setPickerIsEnabled(true)}
                  />
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
        {pickerIsEnabled ? (
          <Picker
            data={data}
            onEmojiSelect={(emoji: Emoji) => handleAddReaction(emoji)}
          />
        ) : null}
      </div>
    );
  }

  return (
    <div className="flex items-end gap-3" key={message.id}>
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
          <p className="text-black">{message.content}</p>
        </div>
      </div>
    </div>
  );
}

export default MessageItem;
