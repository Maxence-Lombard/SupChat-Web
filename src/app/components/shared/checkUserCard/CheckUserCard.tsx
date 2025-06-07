import ProfilePictureAvatar from "../profilePictureAvatar/ProfilePictureAvatar.tsx";
import { useState } from "react";

interface CheckUserCardProps {
  user: {
    firstName: string;
    image?: string;
  };
}

function CheckUserCard({ user }: CheckUserCardProps) {
  const [checked, setChecked] = useState(false);

  return (
    <div
      className="flex py-1 px-2 items-center justify-between border bg-white border-[#ECECEC] rounded-lg cursor-pointer"
      onClick={() => setChecked(!checked)}
    >
      <div className="flex items-center gap-3 w-[400px]">
        <ProfilePictureAvatar
          avatarType={"user"}
          url={user.image}
          size={"xlarge"}
          altText={user?.firstName?.charAt(0).toUpperCase()}
        />
        <p className="font-semibold"> {user.firstName} </p>
      </div>
      <label className="custom-checkbox-wrapper">
        <input type="checkbox" className="custom-checkbox" checked={checked} />
        <span className="check-icon">
          <i className="pi pi-check text-white" />
        </span>
      </label>
    </div>
  );
}

export default CheckUserCard;
