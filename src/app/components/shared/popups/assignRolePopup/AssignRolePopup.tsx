import CheckUserCard from "../../checkUserCard/CheckUserCard.tsx";
import {
  useAssignWorkspaceRoleGroupMutation,
  useGetWorkspaceRoleNonMembersQuery,
} from "../../../../api/workspaces/workspaces.api.ts";
import { useParams } from "react-router-dom";
import { useState } from "react";

interface AssignRolePopupProps {
  hide: () => void;
  roleName: string;
  roleId: number;
}

function AssignRolePopup({ hide, roleName, roleId }: AssignRolePopupProps) {
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const { data: workspaceMembers } = useGetWorkspaceRoleNonMembersQuery({
    workspaceId: Number(workspaceId),
    roleId: roleId,
  });
  const [usersId, setUsersId] = useState<number[]>([]);
  const [assignRoleRequest] = useAssignWorkspaceRoleGroupMutation();

  const handleAssignRole = () => {
    if (!workspaceId) {
      console.error("Workspace ID is not defined");
      return;
    }
    if (usersId.length === 0) {
      console.warn("No users selected for role assignment");
      return;
    }
    assignRoleRequest({
      workspaceId: Number(workspaceId),
      roleId: roleId,
      usersId: usersId,
    })
      .then(() => {
        hide();
      })
      .catch((error) => {
        console.error("Failed to assign role:", error);
      });
  };

  return (
    <div className="flex flex-col text-black px-8 py-6 border bg-white border-[#ECECEC] rounded-2xl">
      <div className="flex flex-col gap-4">
        <div className="flex gap-2">
          <p className="font-semibold text-xl"> Assign </p>
          <p className="font-semibold text-xl text-[var(--main-color-500)]">
            {roleName}
          </p>
          <p className="font-semibold text-xl"> to : </p>
        </div>
        <div className="flex flex-col gap-10">
          <div className="flex flex-col gap-2 max-h-[400px] overflow-y-auto">
            {workspaceMembers?.map((member, index) => (
              <CheckUserCard
                key={index}
                user={{
                  id: member.id,
                  username: member.username,
                  imageId: member.profilePictureId,
                }}
                checked={usersId.includes(member.id)}
                onChange={() => {
                  setUsersId((prev) =>
                    prev.includes(member.id)
                      ? prev.filter((id) => id !== member.id)
                      : [...prev, member.id],
                  );
                }}
              />
            ))}
          </div>
          <div className="flex self-end gap-2">
            <button
              className="flex gap-2 px-2 py-1 items-center border border-[#687BEC] rounded-lg"
              onClick={() => hide()}
            >
              <i
                className="pi pi-times"
                style={{ color: "var(--main-color-500)" }}
              ></i>
              <p className="text-[#687BEC]">Cancel</p>
            </button>
            <button
              className="flex gap-2 px-2 py-1 items-center bg-[#687BEC] rounded-lg"
              onClick={() => handleAssignRole()}
            >
              <i className="pi pi-plus text-white"></i>
              <p className="text-white">Assign role</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AssignRolePopup;
