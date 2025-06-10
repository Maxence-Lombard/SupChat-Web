import { Navigate, Outlet } from "react-router-dom";
import { getUnencodedCookie } from "../../../helpers/cookieHelper.ts";
import { cookieConstants } from "../../constants/cookieConstants.ts";

const PrivateRoute = () => {
  const token = getUnencodedCookie(cookieConstants.accessToken);
  return token ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
