import { useGetWorkspaceRoleMembersCountQuery } from "../../../api/workspaces/workspaces.api.ts";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { setRoleMemberCount } from "../../../store/slices/roleSlice.ts";
import { RootState } from "../../../store/store.ts";

interface RoleMemberCountProps {
  workspaceId: number;
  roleId: number;
}

function RoleMemberCount({ workspaceId, roleId }: RoleMemberCountProps) {
  const dispatch = useDispatch();
  const memberCountFromStore = useSelector(
    (state: RootState) =>
      state.roles.byWorkspaceId[workspaceId]?.find((r) => r.id === roleId)
        ?.memberCount,
  );

  const { data: roleCount } = useGetWorkspaceRoleMembersCountQuery(
    {
      workspaceId,
      roleId,
    },
    { skip: memberCountFromStore !== undefined },
  );
  useEffect(() => {
    if (memberCountFromStore === undefined && roleCount !== undefined) {
      dispatch(
        setRoleMemberCount({ workspaceId, roleId, memberCount: roleCount }),
      );
    }
  }, [roleCount, workspaceId, roleId, dispatch]);

  return <span> {memberCountFromStore ?? roleCount ?? "..."} </span>;
}

export default RoleMemberCount;
