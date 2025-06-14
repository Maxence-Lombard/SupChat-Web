import { useNavigate } from "react-router-dom";
import { ApplicationUser } from "../../../Models/User.ts";
import useProfilePicture from "../../../hooks/useProfilePicture.tsx";
import ProfilePictureAvatar from "../profilePictureAvatar/ProfilePictureAvatar.tsx";
import { status } from "../../../Models/Enums.ts";
import { useSelector } from "react-redux";
import { RootState } from "../../../store/store.ts";

interface UserCardProps {
  user: ApplicationUser;
  imageSize?: "normal" | "large" | "xlarge";
}

function UserCard({ user, imageSize }: UserCardProps) {
  const navigate = useNavigate();
  const userImage = useProfilePicture(user.profilePictureId);
  const currentUserId = useSelector(
    (state: RootState) => state.users.currentUserId,
  );

  const handleNavigation = () => {
    if (user.id === currentUserId) return;
    navigate(`/privateMessage/${user.id}`, {
      state: { user },
    });
  };

  return (
    <>
      <div
        className={`flex gap-3 ${user.id === currentUserId ? "" : "cursor-pointer"} rounded-lg border border-[#ECECEC] p-1`}
        onMouseDown={handleNavigation}
      >
        <div className="relative">
          <ProfilePictureAvatar
            key={user.id}
            avatarType={"user"}
            url={userImage}
            size={imageSize || "xlarge"}
            altText={user?.username?.charAt(0).toUpperCase()}
          />
          <div
            className={`status-indicator ${user.status === status.online ? "bg-[#00A000]" : "bg-black"} `}
          ></div>
        </div>
        <div className="flex flex-1 flex-col gap-2 w-0">
          <p className="font-semibold truncate w-full text-left">
            {user.username}
          </p>
          <p
            className={`text-left ${user.status === "Online" ? "text-[#00A000]" : "text-black"}`}
          >
            {user.status}
          </p>
        </div>
      </div>
    </>
  );
}

export default UserCard;
