import "primeicons/primeicons.css";
import { useSelector } from "react-redux";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Login from "./app/components/auth/Login/Login.tsx";
import Register from "./app/components/auth/Register/Register.tsx";
import Callback from "./app/components/callback/Callback.tsx";
import ConfirmEmail from "./app/components/confirmEmail/ConfirmEmail.tsx";
import Home from "./app/components/home/Home.tsx";
import JoinWorkspaces from "./app/components/joinWorkspaces/JoinWorkspaces.tsx";
import Workspace from "./app/components/workspace/Workspace.tsx";
import WorkspaceParameters from "./app/components/workspaceParameters/WorkspaceParameters.tsx";
import AuthLayout from "./app/layouts/AuthLayout.tsx";
import MainLayout from "./app/layouts/MainLayout.tsx";
import MyProfile from "./app/components/myProfile/MyProfile.tsx";
import { SignalRProvider } from "./app/context/SignalRContext.tsx";
import { selectAccessToken } from "./app/store/slices/authSlice.ts";
import TokenExpiryChecker from "./app/middlewares/TokenExpiryChecker.ts";
import AuthRedirect from "./app/middlewares/AuthRedirect.ts";
import PrivateMessage from "./app/components/privateMessage/PrivateMessage.tsx";
import RoleListing from "./app/components/roleListing/RoleListing.tsx";
import RoleCreation from "./app/components/roleCreation/RoleCreation.tsx";

function App() {
  const token = useSelector(selectAccessToken);

  const users = ["user1", "user2", "user3", "user4", "user5"];
  users.map((user) => {
    return user;
  });

  return (
    <>
      <div className="App h-full">
        <BrowserRouter>
          <TokenExpiryChecker />
          <AuthRedirect />
          <Routes>
            <Route element={<AuthLayout />}>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Route>
            <Route
              element={
                token ? (
                  <SignalRProvider>
                    <MainLayout />
                  </SignalRProvider>
                ) : null
              }
            >
              <Route path="/" element={<Home />} />
              <Route path="/privateMessage/:id" element={<PrivateMessage />} />
              <Route
                path="/workspace/:workspaceId/channel/:channelId"
                element={<Workspace />}
              />
              <Route path="/joinWorkspaces" element={<JoinWorkspaces />} />
              {/* TODO: REPLACE WORKSPACE SETTINGS ROUTES BY A LAYOUT */}
              <Route
                path="/workspace/settings/:workspaceId"
                element={<WorkspaceParameters />}
              />
              <Route
                path="/workspace/settings/:workspaceId/roleListing"
                element={<RoleListing />}
              />
              <Route
                path="/workspace/settings/:workspaceId/roleCreation"
                element={<RoleCreation />}
              />
              {/* User settings */}
              <Route path="/settings/myprofile" element={<MyProfile />} />
            </Route>

            <Route path="/login/confirmEmail" element={<ConfirmEmail />} />
            <Route path="/login/callback" element={<Callback />} />

            <Route path="*" element={<h1>404</h1>} />
          </Routes>
        </BrowserRouter>
      </div>
    </>
  );
}

export default App;
