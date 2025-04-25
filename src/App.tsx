import './App.css'
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Home from "./app/components/Home/Home.tsx";
import Login from "./app/components/auth/Login/Login.tsx";
import Register from "./app/components/auth/Register/Register.tsx";
import MainLayout from "./app/layouts/MainLayout.tsx";
import AuthLayout from "./app/layouts/AuthLayout.tsx";
import Conversation from "./app/components/conversation/Conversation.tsx";
import Workspace from "./app/components/Workspace/Workspace.tsx";
import { useEffect } from 'react';
import {useDispatch} from "react-redux";
import AuthRedirect from "./app/middlewares/AuthRedirect.ts";

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
                          <Route path="/conversation" element={<Conversation />} />
                          <Route path="/workspace/:id" element={<Workspace />} />
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
