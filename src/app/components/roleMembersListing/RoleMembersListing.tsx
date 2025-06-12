import WorkspaceParametersLayout from "../../layouts/WorkspaceParametersLayout.tsx";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store.ts";
import {
  useGetWorkspaceRoleMembersQuery,
  useUnassignWorkspaceRoleMutation,
} from "../../api/workspaces/workspaces.api.ts";
import RoleMemberListItem from "../shared/roleMemberListItem/RoleMemberListItem.tsx";

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
  const [unassignRoleFromUser] = useUnassignWorkspaceRoleMutation();

  if (!workspaceId || !roleId) return null;

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
          {users?.map((user) => (
            <RoleMemberListItem
              key={user.id}
              user={user}
              workspaceId={workspaceId}
              roleId={roleId}
              unassignRoleFromUser={unassignRoleFromUser}
            />
          ))}
        </div>
      </WorkspaceParametersLayout>
    </>
  );
}

export default RoleMembersListing;
