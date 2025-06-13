import ParametersLeftPanel from "../components/shared/parametersLeftPanel/ParametersLeftPanel.tsx";
import { useNavigate } from "react-router-dom";
import React from "react";
import { useAuth } from "../hooks/useAuth.tsx";

type ParametersLayoutProps = {
  children: React.ReactNode;
};

function UserParametersLayout({ children }: ParametersLayoutProps) {
  const navigate = useNavigate();
  const { logout } = useAuth();

  // const [deleteAccount] = ();

  // NAVIGATION ITEMS
  const navigationItems = [
    {
      name: "My profile",
      urlToNavigate: `/settings/myprofile`,
    },
    {
      name: "Security",
      urlToNavigate: `/settings/security`,
    },
    {
      name: "Bots",
      urlToNavigate: `/settings/bots`,
    },
  ];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleDeleteAccount = async () => {
    // try {
    //   deleteWorkspace(workspaceId).unwrap();
    //   dispatch(removeWorkspace(workspaceId));
    //   navigate("/");
    // } catch (e) {
    //   console.log(e);
    // }
  };

  return (
    <div className="flex gap-10 bg-white w-full rounded-l-[40px] px-4 py-8">
      <div className="flex flex-col flex-1 gap-10">
        <div className="flex h-full min-h-0 bg-[#F9FAFC] rounded-3xl py-8 px-6 gap-4">
          <ParametersLeftPanel
            navigationItems={navigationItems}
            deleteAction={() => handleDeleteAccount()}
            itemToDelete={"account"}
            logoutAction={() => handleLogout()}
          />
          {children}
        </div>
      </div>
    </div>
  );
}

export default UserParametersLayout;
