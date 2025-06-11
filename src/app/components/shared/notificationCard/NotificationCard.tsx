import ProfilePictureAvatar from "../profilePictureAvatar/ProfilePictureAvatar.tsx";
import {
  Notification,
  useReadByNotificationIdMutation,
} from "../../../api/notifications/notifications.api.ts";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store/store.ts";
import { useGetUserInfosByIdMutation } from "../../../api/user/user.api.ts";
import { useEffect, useState } from "react";
import { addUser } from "../../../store/slices/usersSlice.ts";
import { ApplicationUser } from "../../../Models/User.ts";
import useProfilePicture from "../../../hooks/useProfilePicture.tsx";
import { useNavigate } from "react-router-dom";

interface NotificationCardProps {
  notif: Notification;
}

function NotificationCard({ notif }: NotificationCardProps) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const match = notif.content.match(/^You have a new ([^:]+?)(?::\s*(.*))?$/);
  const notifType = match ? match[1].trim() : "";
  const notifDetail = match && match[2] ? match[2].trim() : "";

  const user = useSelector(
    (state: RootState) => state.users.byId[notif.senderId],
  );

  const [readNotification] = useReadByNotificationIdMutation();
  const [getUserInfos] = useGetUserInfosByIdMutation();
  const [fetchedUser, setFetchedUser] = useState<ApplicationUser | undefined>(
    undefined,
  );

  const handleReadNotification = async () => {
    try {
      await readNotification(notif.id).unwrap();
      if (notif.senderId) {
        navigate(`/privateMessage/${notif.senderId}`);
      }
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  useEffect(() => {
    if (!user && notif.senderId) {
      getUserInfos(notif.senderId)
        .unwrap()
        .then((data) => {
          dispatch(addUser(data));
          setFetchedUser(data);
        })
        .catch(() => setFetchedUser(undefined));
    }
  }, [notif.senderId, getUserInfos, user, dispatch]);
  const displayUser = user || fetchedUser;
  const userImage = useProfilePicture(displayUser?.profilePictureId || "");

  return (
    <div
      className="flex p-2 gap-2 items-center bg-white rounded-lg border border-[#ECECEC] cursor-pointer"
      onClick={handleReadNotification}
    >
      <ProfilePictureAvatar
        key={user?.id}
        avatarType={"user"}
        isCurrentUser={false}
        url={userImage}
        altText={user?.username?.charAt(0).toUpperCase()}
        size={"xlarge"}
      />
      <div className="flex flex-col gap-2">
        <div className="flex gap-2">
          <p> {user?.username} </p> -
          <p className="font-semibold text-[var(--main-color-500)]">
            {notifType}
          </p>
        </div>
        <p> {notifDetail || notif.content} </p>
      </div>
    </div>
  );
}

export default NotificationCard;
