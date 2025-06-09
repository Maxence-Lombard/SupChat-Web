import ParametersLeftPanel from "../components/shared/parametersLeftPanel/ParametersLeftPanel.tsx";
import TitleBanner from "../components/shared/titleBanner/TitleBanner.tsx";
import { useNavigate, useParams } from "react-router-dom";
import { removeWorkspace } from "../store/slices/workspaceSlice.ts";
import { useDispatch } from "react-redux";
import { useDeleteWorkspaceMutation } from "../api/workspaces/workspaces.api.ts";
import React from "react";

type ParametersLayoutProps = {
  titleBanner: string;
  descriptionBanner: string;
  children: React.ReactNode;
};

function WorkspaceParametersLayout({
  titleBanner,
  descriptionBanner,
  children,
}: ParametersLayoutProps) {
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [deleteWorkspace] = useDeleteWorkspaceMutation();

  // NAVIGATION ITEMS
  const navigationItems = [
    {
      name: "Workspace",
      urlToNavigate: `/workspace/settings/${workspaceId}`,
    },
    {
      name: "Roles listing",
      urlToNavigate: `/workspace/settings/${workspaceId}/roleListing`,
    },
    {
      name: "Role creation",
      urlToNavigate: `/workspace/settings/${workspaceId}/roleCreation`,
    },
  ];

  const handleDeleteWorkspace = async (workspaceId: number) => {
    if (!workspaceId) return;
    try {
      deleteWorkspace(workspaceId).unwrap();
      dispatch(removeWorkspace(workspaceId));
      navigate("/");
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className="flex gap-10 bg-white w-full rounded-l-[40px] px-4 py-8">
      <div className="flex flex-col flex-1 gap-10">
        <TitleBanner title={titleBanner} description={descriptionBanner} />
        <div className="flex h-full min-h-0 bg-[#F9FAFC] rounded-3xl py-8 px-6 gap-4">
          <ParametersLeftPanel
            navigationItems={navigationItems}
            deleteAction={() => handleDeleteWorkspace(Number(workspaceId))}
            itemToDelete={"workspace"}
          />
          {children}
        </div>
      </div>
    </div>
  );
}

export default WorkspaceParametersLayout;
