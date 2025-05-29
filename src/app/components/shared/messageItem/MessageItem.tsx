import { useDispatch, useSelector } from "react-redux";
import { useDateFormatter } from "../../../hooks/useDateFormatter.tsx";
import { RootState } from "../../../store/store.ts";
import { Message } from "../../../api/messages/messages.api.ts";
import { useEffect, useState } from "react";
import { useGetUserInfosByIdMutation } from "../../../api/user/user.api.ts";
import { ApplicationUser } from "../../../Models/User.ts";
import useProfilePicture from "../../../hooks/useProfilePicture.tsx";
import { addUser } from "../../../store/slices/usersSlice.ts";
import ProfilePictureAvatar from "../profilePictureAvatar/ProfilePictureAvatar.tsx";

type MessageProps = {
  message: Message;
  currentUserId: number;
  currentUserImage: string;
};

function MessageItem({
  message,
  currentUserId,
  currentUserImage,
}: MessageProps) {
  const dispatch = useDispatch();

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
  const [getUserInfos] = useGetUserInfosByIdMutation();

  useEffect(() => {
    if (!storeUser) {
      getUserInfos(message.senderId)
        .unwrap()
        .then((data) => {
          setUser(data);
          setProfilePictureId(data.profilePictureId);
          dispatch(addUser(data));
        });
    }
  }, [storeUser, message.senderId]);

  const userImage = useProfilePicture(profilePictureId);

  if (message.senderId === currentUserId) {
    return (
      <div className="flex justify-end items-end w-full gap-3" key={message.id}>
        <div className="flex flex-col gap-1 items-end">
          <p className="text-black/50">
            {formatDate(message.sendDate, "HH'h'mm")}
          </p>
          <div className="flex bg-[#687BEC] rounded-lg px-2 max-w-xl">
            <p className="text-white">{message.content}</p>
          </div>
        </div>
        <ProfilePictureAvatar
          avatarType={"user"}
          url={userImage}
          altText={user?.firstName?.charAt(0).toUpperCase()}
        />
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
