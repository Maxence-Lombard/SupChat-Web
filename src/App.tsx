import './App.css'
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Home from "./app/Home/Home.tsx";
import Login from "./app/components/auth/Login/Login.tsx";
import Register from "./app/components/auth/Register/Register.tsx";
import MainLayout from "./app/layouts/MainLayout.tsx";
import AuthLayout from "./app/layouts/AuthLayout.tsx";
import Callback from './app/components/Callback.tsx';
import Conversation from "./app/components/conversation/Conversation.tsx";

function App() {

  return (
      <>
          <div className="App h-full">
              <BrowserRouter>
                  <Routes>
                      <Route element={<MainLayout />}>
                          <Route path="/" element={<Home />} />
                          <Route path="/conversation" element={<Conversation />} />

                      </Route>
                      <Route element={<AuthLayout />}>
                          <Route path="login" element={<Login />} />
                          <Route path="register" element={<Register />} />
                      </Route>
                        <Route path="callback" element={<Callback />} />
                    </Routes>
                </BrowserRouter>
            </div>
        </>
    )
}

export default App
