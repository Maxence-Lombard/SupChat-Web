import TitleBanner from "../shared/titleBanner/TitleBanner.tsx";
import ParametersLeftPanel from "../shared/parametersLeftPanel/ParametersLeftPanel.tsx";
import { useParams } from "react-router-dom";

function RolesParameters() {
  const { workspaceId } = useParams();

  // NAVIGATION ITEMS
  const navigationItems = [
    {
      name: "Workspace",
      urlToNavigate: `/workspace/settings/${workspaceId}`,
    },
    {
      name: "Roles",
      urlToNavigate: `/workspace/settings/${workspaceId}/rolesListing`,
    },
  ];

  return (
    <>
      <div className="flex gap-10 bg-white w-full rounded-l-[40px] px-4 py-8">
        <div className="flex flex-col flex-1 gap-10">
          <TitleBanner
            title={"Roles Parameters"}
            description={
              "Assign roles to users to define their permissions in the workspace"
            }
          />
          <div className="flex h-full min-h-0 bg-[#F9FAFC] rounded-3xl py-8 px-6 gap-4">
            <ParametersLeftPanel
              navigationItems={navigationItems}
              deleteAction={() => console.log("Delete action triggered")}
              itemToDelete={"workspace"}
            />
            <div className="flex flex-col gap-8 w-full h-full min-h-0">
              {/* HEAD */}
              <p className="font-semibold text-xl"> Roles listing </p>
              <div className="flex flex-1 w-full gap-6">
                <div className="flex justify-center flex-1 py-2 border border-[#ECECEC] rounded-lg bg-white">
                  <p className="font-semibold"> Total of Roles - 3 </p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-white bg-[var(--main-color-500)]">
                  <i className="pi pi-plus" />
                  <p> Create new role </p>
                </button>
              </div>
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
                    {[
                      "owner",
                      "admin",
                      "a very very very long role name that should be truncated",
                      "editor",
                      "admin",
                      "admin",
                      "admin",
                      "admin",
                      "admin",
                      "admin",
                    ].map((role, index) => (
                      <tr key={index} className="gap-y-6">
                        <td
                          className="text-left font-semibold max-w-[80px] truncate "
                          title={role}
                        >
                          {role}
                        </td>
                        <td className="text-center">1</td>
                        <td className="text-center">
                          <i className="pi pi-user cursor-pointer text-gray-700" />
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
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default RolesParameters;
