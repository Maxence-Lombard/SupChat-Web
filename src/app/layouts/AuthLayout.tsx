import { Outlet } from "react-router-dom";

function AuthLayout() {
  return (
    <div className="flex h-full flex-col justify-center items-center">
      <Outlet />
    </div>
  );
}

export default AuthLayout;
