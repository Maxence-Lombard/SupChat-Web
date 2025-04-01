import { BrowserRouter, Route, Routes } from "react-router-dom";
import './App.css';
import Login from "./app/routes/auth/Login/Login.tsx";
import Register from "./app/routes/auth/Register/Register.tsx";
import Callback from './app/routes/Callback.tsx';
import Home from "./app/routes/Home.tsx";

function App() {

    return (
        <>
            <div className="App">
                <BrowserRouter>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="login" element={<Login />} />
                        <Route path="register" element={<Register />} />
                        <Route path="callback" element={<Callback />} />
                    </Routes>
                </BrowserRouter>
            </div>
        </>
    )
}

export default App
