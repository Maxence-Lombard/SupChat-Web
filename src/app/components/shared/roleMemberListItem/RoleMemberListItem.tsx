import useProfilePicture from "../../../hooks/useProfilePicture.tsx";
import ProfilePictureAvatar from "../profilePictureAvatar/ProfilePictureAvatar.tsx";
import { status } from "../../../Models/Enums.ts";

interface IRoleMemberListItemProps {
  user: {
    id: number;
    username: string;
    profilePictureId?: string;
    status: string;
  };
  workspaceId: string;
  roleId: string;
  unassignRoleFromUser: (args: {
    workspaceId: number;
    roleId: number;
    userId: number;
  }) => void;
}

function RoleMemberListItem({
  user,
  workspaceId,
  roleId,
  unassignRoleFromUser,
}: IRoleMemberListItemProps) {
  const profilePictureUrl = useProfilePicture(user.profilePictureId);

  return (
    <div className="flex items-center gap-4">
      <div className="flex gap-2 p-2 border border-[#ECECEC] rounded-lg items-center w-1/2">
        <ProfilePictureAvatar
          avatarType="user"
          url={profilePictureUrl}
          altText={user.username.charAt(0).toUpperCase()}
        />
        <div className="flex flex-col gap-1">
          <p className="text-lg">{user.username}</p>
          <p
            className={
              user.status === status.online ? "text-green-600" : "text-black"
            }
          >
            {user.status}
          </p>
        </div>
      </div>
      <i
        className="pi pi-trash text-red-500 text-xl cursor-pointer"
        onClick={() =>
          unassignRoleFromUser({
            workspaceId: Number(workspaceId),
            roleId: Number(roleId),
            userId: user.id,
          })
        }
      />
    </div>
  );
}

export default RoleMemberListItem;
