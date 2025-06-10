import WorkspaceParametersLayout from "../../layouts/WorkspaceParametersLayout.tsx";
import {
  RoleDto,
  useDeleteWorkspaceRoleMutation,
  useGetWorkspaceRolesQuery,
} from "../../api/workspaces/workspaces.api.ts";
import { useNavigate, useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { Dialog } from "primereact/dialog";
import AssignRolePopup from "../shared/popups/assignRolePopup/AssignRolePopup.tsx";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store.ts";
import {
  deleteRole,
  Role,
  setRolesForWorkspace,
} from "../../store/slices/roleSlice.ts";
import RoleMemberCount from "../shared/roleMemberCount/RoleMemberCount.tsx";
import DeletePopup from "../shared/popups/deletePopup/DeletePopup.tsx";

function RoleListing() {
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const { data: roles } = useGetWorkspaceRolesQuery(Number(workspaceId));
  const [deleteRoleRequest] = useDeleteWorkspaceRoleMutation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [assignRoleVisible, setAssignRoleVisible] = useState(false);
  const [deleteRoleVisible, setDeleteRoleVisible] = useState(false);
  const [roleSelected, setRoleSelected] = useState<{
    id: number;
    name: string;
  }>({ id: 0, name: "" });

  const rolesFromStore = useSelector(
    (state: RootState) =>
      state.roles.byWorkspaceId?.[Number(workspaceId)] ?? [],
  );

  function mapRoleDtoToRole(dto: RoleDto): Role {
    return {
      id: dto.id,
      name: dto.name,
      hierarchy: dto.hierarchy,
      workspaceId: dto.workspaceId,
    };
  }

  useEffect(() => {
    if (roles && workspaceId && rolesFromStore.length === 0) {
      const mappedRoles = roles.map(mapRoleDtoToRole);
      dispatch(
        setRolesForWorkspace({
          workspaceId: Number(workspaceId),
          roles: mappedRoles,
        }),
      );
    }
  }, [roles, workspaceId, dispatch, rolesFromStore.length]);

  return (
    <>
      <WorkspaceParametersLayout
        titleBanner={"Roles Listing"}
        descriptionBanner={
          "Manage the roles assign to users and their permissions in the workspace"
        }
      >
        <div className="flex flex-col gap-8 w-full h-full min-h-0">
          {/* HEAD */}
          <p className="font-semibold text-xl"> Roles listing </p>
          <div className="flex flex-1 w-full gap-6">
            <div className="flex justify-center flex-1 py-2 border border-[#ECECEC] rounded-lg bg-white">
              <p className="font-semibold"> Total of Roles - 3 </p>
            </div>
          </div>
          {rolesFromStore ? (
            <div className="h-full min-h-0 overflow-y-auto">
              <table className="min-w-full table-auto">
                <thead className="sticky top-0 bg-[#F9FAFC] z-10">
                  <tr className="h-12">
                    <th className="text-left">Roles</th>
                    <th className="text-center">Members</th>
                    <th className="text-center">Assign</th>
                    <th className="text-center">See members</th>
                    <th className="text-center">Edit role</th>
                    <th className="text-center">Delete</th>
                  </tr>
                </thead>
                <tbody className="[&>tr]:h-16 [&>tr]:align-middle [&>tr]:border-t [&>tr]:border-[#f0f0f0]">
                  {rolesFromStore.map((role, index) => (
                    <tr key={index} className="gap-y-6">
                      <td
                        className="text-left font-semibold max-w-[80px] truncate"
                        title={role.name}
                      >
                        {role.name}
                      </td>
                      <td className="text-center">
                        <RoleMemberCount
                          workspaceId={Number(workspaceId)}
                          roleId={role.id}
                        />
                      </td>
                      <td className="text-center">
                        <i
                          className="pi pi-user cursor-pointer text-gray-700"
                          onClick={() => {
                            setAssignRoleVisible(true);
                            setRoleSelected({ id: role.id, name: role.name });
                          }}
                        />
                      </td>
                      <td className="text-center">
                        <i className="pi pi-eye cursor-pointer text-gray-700" />
                      </td>
                      <td className="text-center">
                        <i
                          className="pi pi-pencil cursor-pointer text-gray-700"
                          onClick={() =>
                            navigate(
                              `/workspace/settings/${workspaceId}/roleCreation?roleId=${role.id}&roleName=${role.name}`,
                            )
                          }
                        />
                      </td>
                      <td className="text-center">
                        <i
                          className="pi pi-trash cursor-pointer text-red-500"
                          onClick={() => {
                            setDeleteRoleVisible(true);
                            setRoleSelected({ id: role.id, name: role.name });
                          }}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : null}
        </div>
      </WorkspaceParametersLayout>
      <Dialog
        className="rounded-2xl"
        visible={assignRoleVisible}
        modal
        onHide={() => {
          if (!assignRoleVisible) return;
          setAssignRoleVisible(false);
        }}
        content={({ hide }) => (
          <AssignRolePopup
            hide={() => hide({} as React.SyntheticEvent)}
            roleName={roleSelected.name}
            roleId={roleSelected.id}
          />
        )}
      ></Dialog>
      {/* CONFIRM DELETE DIALOG */}
      <Dialog
        className="rounded-2xl"
        visible={deleteRoleVisible}
        modal
        onHide={() => {
          if (!deleteRoleVisible) return;
          setDeleteRoleVisible(false);
        }}
        content={({ hide }) => (
          <DeletePopup
            itemToDelete={"role"}
            deleteAction={async () => {
              await deleteRoleRequest({
                workspaceId: Number(workspaceId),
                roleId: roleSelected.id,
              });
              setDeleteRoleVisible(false);
              dispatch(
                deleteRole({
                  workspaceId: Number(workspaceId),
                  roleId: roleSelected.id,
                }),
              );
              hide({} as React.SyntheticEvent);
            }}
            hide={() => hide({} as React.SyntheticEvent)}
          />
        )}
      ></Dialog>
    </>
  );
}

export default RoleListing;
