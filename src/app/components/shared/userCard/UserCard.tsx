import { useNavigate } from "react-router-dom";
import { ApplicationUser } from "../../../Models/User.ts";
import useProfilePicture from "../../../hooks/useProfilePicture.tsx";
import ProfilePictureAvatar from "../profilePictureAvatar/ProfilePictureAvatar.tsx";
import { status } from "../../../Models/Enums.ts";

interface UserCardProps {
  user: ApplicationUser;
  imageSize?: "normal" | "large" | "xlarge";
}

function UserCard({ user, imageSize }: UserCardProps) {
  const navigate = useNavigate();
  const userImage = useProfilePicture(user.profilePictureId);

  const handleNavigation = () => {
    navigate(`/privateMessage/${user.id}`, {
      state: {
        user: user,
      },
    });
  };

  return (
    <>
      <div
        className="flex gap-3 cursor-pointer rounded-lg border border-[#ECECEC] p-1"
        onClick={handleNavigation}
      >
        <div className="relative">
          <ProfilePictureAvatar
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
