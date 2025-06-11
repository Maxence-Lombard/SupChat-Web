import DiscussionsListing from "../shared/discussions-listing/DiscussionsListing.tsx";
import ProfilePictureAvatar from "../shared/profilePictureAvatar/ProfilePictureAvatar.tsx";
import Conversation from "../conversation/Conversation.tsx";
import { useParams } from "react-router-dom";
import useProfilePicture from "../../hooks/useProfilePicture.tsx";
import { status } from "../../Models/Enums.ts";
import { useGetUserInfosByIdMutation } from "../../api/user/user.api.ts";
import { useEffect } from "react";

function PrivateMessage() {
  const { id } = useParams();
  const [getUserInfosById, { data: user }] = useGetUserInfosByIdMutation();
  const userImage = useProfilePicture(user?.profilePictureId || "");

  useEffect(() => {
    if (id) {
      getUserInfosById(Number(id));
    }
  }, [id, getUserInfosById]);

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
                key={user?.id}
                avatarType={"user"}
                url={userImage}
                altText={user?.username.charAt(0).toUpperCase()}
              />
              <div>
                <p className="font-semibold"> {user?.username} </p>
                <p
                  className={`text-xs ${user?.status === status.online ? "text-[#00A000]" : "text-black"}`}
                >
                  {user?.status}
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
