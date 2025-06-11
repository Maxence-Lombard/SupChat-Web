import WorkspaceParametersLayout from "../../layouts/WorkspaceParametersLayout.tsx";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store.ts";
import { useGetWorkspaceRoleMembersQuery } from "../../api/workspaces/workspaces.api.ts";
import ProfilePictureAvatar from "../shared/profilePictureAvatar/ProfilePictureAvatar.tsx";
import { status } from "../../Models/Enums.ts";

function RoleMembersListing() {
  const { workspaceId, roleId } = useParams<{
    workspaceId: string;
    roleId: string;
  }>();

  const roleFromStore = useSelector((state: RootState) =>
    state.roles.byWorkspaceId[Number(workspaceId)]?.find(
      (role) => role.id === Number(roleId),
    ),
  );

  const { data: users } = useGetWorkspaceRoleMembersQuery({
    workspaceId: Number(workspaceId),
    roleId: Number(roleId),
  });

  return (
    <>
      <WorkspaceParametersLayout
        titleBanner={"Role Members Listing"}
        descriptionBanner={
          "Manage the role assign to users and their permissions in the workspace"
        }
      >
        <div className="flex flex-col gap-8 w-full h-full min-h-0">
          <div className="flex gap-2">
            <p className="font-semibold text-xl text-[var(--main-color-500)]">
              {roleFromStore?.name}
            </p>
            <p className="font-semibold text-xl">members listing</p>
          </div>
          {!users || users?.length === 0
            ? null
            : users.map((user) => (
                <div key={user.id} className="flex items-center gap-4">
                  <div
                    key={user.id}
                    className="flex gap-2 p-2 border border-[#ECECEC] rounded-lg items-center w-1/2"
                  >
                    <ProfilePictureAvatar
                      key={user.id}
                      avatarType={"user"}
                      url={user?.profilePictureId || ""}
                      altText={user.username.charAt(0).toUpperCase()}
                    />
                    <div className="flex flex-col gap-1">
                      <p className="text-lg">{user.username}</p>
                      <p
                        className={`${user.status === status.online ? "text-green-600" : "text-black"}`}
                      >
                        {user.status}
                      </p>
                    </div>
                  </div>
                  <i className="pi pi-trash text-red-500 text-xl cursor-pointer" />
                </div>
              ))}
        </div>
      </WorkspaceParametersLayout>
    </>
  );
}

export default RoleMembersListing;
