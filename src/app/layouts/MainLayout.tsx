import { Outlet } from "react-router-dom";
import NavBar from "../components/shared/navBar/NavBar";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { useGetUserInfosQuery } from "../api/user/user.api.ts";
import { addUser, setCurrentUserId } from "../store/slices/usersSlice.ts";

function MainLayout() {
  const dispatch = useDispatch();

  const { data: userInfos } = useGetUserInfosQuery(undefined, { skip: false });

  const handleUserInfos = () => {
    if (userInfos) {
      dispatch(setCurrentUserId(userInfos.applicationUser.id));
      dispatch(addUser(userInfos.applicationUser));
    }
  };

  useEffect(() => {
    dispatch({ type: "auth/checkAuth" });
  }, [dispatch, location.pathname]);

  useEffect(() => {
    handleUserInfos();
  }, []);

  return (
    <div className="flex flex-row w-full h-full">
      <NavBar />
      <Outlet />
    </div>
  );
}

export default MainLayout;
