import DiscussionsListing from "../shared/discussions-listing/DiscussionsListing.tsx";
import ProfilePictureAvatar from "../shared/profilePictureAvatar/ProfilePictureAvatar.tsx";
import Conversation from "../conversation/Conversation.tsx";
import { useLocation } from "react-router-dom";
import { ApplicationUser } from "../../Models/User.ts";
import useProfilePicture from "../../hooks/useProfilePicture.tsx";
import { status } from "../../Models/Enums.ts";

function PrivateMessage() {
  const location = useLocation();
  const user: ApplicationUser = location.state?.user;
  const userImage = useProfilePicture(user.profilePictureId);

  return (
    <>
      <div className="flex gap-10 bg-white w-full rounded-l-[40px] px-4 py-8">
        {/*Left Panel*/}
        <DiscussionsListing />
        <div className="flex flex-col flex-1">
          {/* User Banner */}
          <div className="flex mb-8 w-full items-center justify-between border border-[#ECECEC] rounded-2xl px-4 py-2">
            <div className="flex items-center gap-2">
              <ProfilePictureAvatar
                avatarType={"user"}
                url={userImage}
                altText={user.username.charAt(0).toUpperCase()}
              />
              <div>
                <p className="font-semibold"> {user.username} </p>
                <p
                  className={`text-xs ${user.status === status.online ? "text-[#00A000]" : "text-black"}`}
                >
                  {user.status}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <i
                className="pi pi-search text-xl cursor-pointer"
                style={{ color: "var(--main-color-500)" }}
              ></i>
              <i
                className="pi pi-info-circle text-xl cursor-pointer"
                style={{ color: "var(--main-color-500)" }}
              ></i>
              <i
                className="pi pi-ellipsis-v text-xl cursor-pointer"
                style={{ color: "var(--main-color-500)" }}
              ></i>
            </div>
          </div>
          {/* Conversation */}
          <Conversation />
        </div>
      </div>
    </>
  );
}

export default PrivateMessage;
