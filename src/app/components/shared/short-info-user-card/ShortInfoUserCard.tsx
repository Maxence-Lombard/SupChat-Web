import message from "../../../../assets/icons/message.svg";
import { Image } from "primereact/image";
import { Tooltip } from "primereact/tooltip";
import { useNavigate } from "react-router-dom";
import ProfilePictureAvatar from "../profilePictureAvatar/ProfilePictureAvatar.tsx";
import { UserProps } from "../../../Models/User.ts";
import useProfilePicture from "../../../hooks/useProfilePicture.tsx";

function ShortInfoUserCard({ user }: UserProps) {
  const navigate = useNavigate();
  const userImage = useProfilePicture(user.profilePictureId);

  const handleNavigation = () => {
    navigate(`/conversation/${user.id}`, {
      state: {
        user: user,
      },
    });
  };

  return (
    <>
      <div className="flex py-1 px-2 items-center justify-between border border-[#ECECEC] rounded-lg">
        <div className="flex gap-3">
          <div className="relative w-16 h-16">
            <ProfilePictureAvatar
              avatarType={"user"}
              url={userImage}
              size={"xlarge"}
            />
            <div className="status-indicator"></div>
          </div>
          <div className="flex flex-col gap-2">
            <p className="font-semibold"> {user.firstName} </p>
            <p className="text-[#00A000]"> {user.status} </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Tooltip target=".image" />
          <Image
            src={message}
            alt="message"
            className="image cursor-pointer"
            width="24"
            data-pr-tooltip="Send a message"
            data-pr-position="left"
            onClick={handleNavigation}
          />

          <i className="pi pi-times text-xl cursor-pointer"></i>
        </div>
      </div>
    </>
  );
}

export default ShortInfoUserCard;
