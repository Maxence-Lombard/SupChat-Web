import useProfilePicture from "../../../hooks/useProfilePicture.tsx";
import ProfilePictureAvatar from "../profilePictureAvatar/ProfilePictureAvatar.tsx";
import { ApplicationUser } from "../../../Models/User.ts";

function ChannelMemberAvatar({ member }: { member: ApplicationUser }) {
  const url = useProfilePicture(member.profilePictureId);
  return (
    <ProfilePictureAvatar
      avatarType="user"
      url={url}
      altText={member.username.charAt(0).toUpperCase() || "?"}
      size="large"
    />
  );
}

export default ChannelMemberAvatar;
