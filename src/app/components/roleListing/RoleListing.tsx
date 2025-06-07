import WorkspaceParametersLayout from "../../layouts/WorkspaceParametersLayout.tsx";
import { useGetWorkspaceRolesQuery } from "../../api/workspaces/workspaces.api.ts";
import { useParams } from "react-router-dom";
import { useState } from "react";
import { Dialog } from "primereact/dialog";
import AssignRolePopup from "../shared/popups/assignRolePopup/AssignRolePopup.tsx";

function RoleListing() {
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const { data: roles } = useGetWorkspaceRolesQuery(Number(workspaceId));

  const [assignRoleVisible, setAssignRoleVisible] = useState(false);
  const [roleSelected, setRoleSelected] = useState<string>("role");
  const [workspaceMembers, setWorkspaceMembers] = useState<
    { name: string; image: string | undefined }[]
  >([
    { name: "John Doe", image: undefined },
    { name: "Doe Jhon", image: undefined },
  ]);

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
          {roles ? (
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
                  {roles.map((role, index) => (
                    <tr key={index} className="gap-y-6">
                      <td
                        className="text-left font-semibold max-w-[80px] truncate"
                        title={role.name}
                      >
                        {role.name}
                      </td>
                      <td className="text-center">1</td>
                      <td className="text-center">
                        <i
                          className="pi pi-user cursor-pointer text-gray-700"
                          onClick={() => {
                            setAssignRoleVisible(true);
                            setRoleSelected(role.name);
                          }}
                        />
                      </td>
                      <td className="text-center">
                        <i className="pi pi-eye cursor-pointer text-gray-700" />
                      </td>
                      <td className="text-center">
                        <i className="pi pi-pencil cursor-pointer text-gray-700" />
                      </td>
                      <td className="text-center">
                        <i className="pi pi-trash cursor-pointer text-red-500" />
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
            hide={hide}
            name={roleSelected}
            workspaceMembers={workspaceMembers}
          />
        )}
      ></Dialog>
    </>
  );
}

export default RoleListing;
