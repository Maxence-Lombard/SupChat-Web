import './App.css'
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Home from "./app/routes/Home.tsx";
import Login from "./app/routes/auth/Login/Login.tsx";
import Register from "./app/routes/auth/Register/Register.tsx";

function App() {

  return (
      <>
          <div className="App">
              <BrowserRouter>
                  <Routes>
                      <Route path="/" element={<Home/>}/>
                      <Route path="login" element={<Login/>}/>
                      <Route path="register" element={<Register/>}/>
                  </Routes>
              </BrowserRouter>
          </div>
      </>
  )
}

export default App
