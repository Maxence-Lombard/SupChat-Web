import "./App.css";
import "primeicons/primeicons.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./app/components/home/Home.tsx";
import Login from "./app/components/auth/Login/Login.tsx";
import Register from "./app/components/auth/Register/Register.tsx";
import MainLayout from "./app/layouts/MainLayout.tsx";
import AuthLayout from "./app/layouts/AuthLayout.tsx";
import Conversation from "./app/components/conversation/Conversation.tsx";
import Workspace from "./app/components/workspace/Workspace.tsx";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import AuthRedirect from "./app/middlewares/AuthRedirect.ts";
import JoinWorkspaces from "./app/components/joinWorkspaces/JoinWorkspaces.tsx";
import Callback from "./app/components/callback/Callback.tsx";
import ConfirmEmail from "./app/components/confirmEmail/ConfirmEmail.tsx";
import WorkspaceParameters from "./app/components/workspaceParameters/WorkspaceParameters.tsx";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch({ type: "auth/checkAuth" });
  }, [dispatch]);

  const users = ["user1", "user2", "user3", "user4", "user5"];
  users.map((user) => {
    return user;
  });

  return (
    <>
      <div className="App h-full">
        <BrowserRouter>
          <AuthRedirect />
          <Routes>
            <Route element={<MainLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/conversation/:id" element={<Conversation />} />
              <Route
                path="/workspace/:workspaceId/channel/:channelId"
                element={<Workspace />}
              />
              <Route path="/joinWorkspaces" element={<JoinWorkspaces />} />
              <Route
                path="/workspace/settings/:workspaceId"
                element={<WorkspaceParameters />}
              />
            </Route>
            <Route path="/login/confirmEmail" element={<ConfirmEmail />} />
            <Route path="/login/callback" element={<Callback />} />

            <Route element={<AuthLayout />}>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Route>
            <Route path="*" element={<Login />} />
          </Routes>
        </BrowserRouter>
      </div>
    </>
  );
}

export default App;
