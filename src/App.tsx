import './App.css'
import 'primeicons/primeicons.css';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Home from "./app/components/home/Home.tsx";
import Login from "./app/components/auth/Login/Login.tsx";
import Register from "./app/components/auth/Register/Register.tsx";
import MainLayout from "./app/layouts/MainLayout.tsx";
import AuthLayout from "./app/layouts/AuthLayout.tsx";
import Conversation from "./app/components/conversation/Conversation.tsx";
import Workspace from "./app/components/workspace/Workspace.tsx";
import { useEffect } from 'react';
import {useDispatch} from "react-redux";
import AuthRedirect from "./app/middlewares/AuthRedirect.ts";
import JoinWorkspaces from "./app/components/joinWorkspaces/JoinWorkspaces.tsx";

function App() {

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch({ type: 'auth/checkAuth' });
    }, [dispatch]);

  return (
      <>
          <div className="App h-full">
              <BrowserRouter>
                  <AuthRedirect />
                  <Routes>
                      <Route element={<MainLayout />}>
                          <Route path="/" element={<Home />} />
                          <Route path="/conversation/:id" element={<Conversation />} />
                          <Route path="/workspace/:workspaceId/channel/:channelId" element={<Workspace />} />
                            <Route path="/joinWorkspaces" element={<JoinWorkspaces />} />
                          <Route path="*" element={<Home />} />

                      </Route>
                      <Route element={<AuthLayout />}>
                          <Route path="login" element={<Login />} />
                          <Route path="register" element={<Register />} />
                      </Route>
                    </Routes>
                </BrowserRouter>
            </div>
        </>
    )
}

export default App
