import { useGetWorkspaceRoleMembersCountQuery } from "../../../api/workspaces/workspaces.api.ts";

interface RoleMemberCountProps {
  workspaceId: number;
  roleId: number;
}

function RoleMemberCount({ workspaceId, roleId }: RoleMemberCountProps) {
  const { data: roleCount } = useGetWorkspaceRoleMembersCountQuery({
    workspaceId,
    roleId,
  });

  return <span> {roleCount ?? "..."} </span>;
}

export default RoleMemberCount;
