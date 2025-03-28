import { Outlet } from "react-router-dom";
import NavBar from "../components/shared/navBar/NavBar";

function MainLayout() {
    return (
        <div className="flex flex-row w-full h-full">
            <NavBar />
            <Outlet />
        </div>
    );
}

export default MainLayout;