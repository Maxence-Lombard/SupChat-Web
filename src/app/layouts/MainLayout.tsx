import { Outlet } from "react-router-dom";
import NavBar from "../components/shared/navBar/NavBar";
import {useDispatch, useSelector} from "react-redux";
import {useGetWorkspacesJoinedQuery} from "../api/workspaces/workspaces.api.ts";
import {useEffect} from "react";
import {setWorkspaces} from "../store/slices/workspaceSlice.ts";
import {RootState} from "../store/store.ts";
import {useGetUserInfosQuery} from "../api/user/user.api.ts";
import {setUserInfos} from "../store/slices/userSlice.ts";

function MainLayout() {
    const dispatch = useDispatch();
    const existingWorkspaces = useSelector((state: RootState) => state.workspaces.list);
    const skip = existingWorkspaces.length > 0;

    const { data: userInfos } = useGetUserInfosQuery(undefined, { skip: false });
    const { data: workspaces, isSuccess } = useGetWorkspacesJoinedQuery(undefined, { skip });

    const handleUserInfos = () => {
        if (userInfos) {
            dispatch(setUserInfos(userInfos));
        }
    }

    useEffect(() => {
        handleUserInfos();
        if (isSuccess && workspaces) {
            dispatch(setWorkspaces(workspaces));
        }
    }, [isSuccess, workspaces]);

    return (
        <div className="flex flex-row w-full h-full">
            <NavBar />
            <Outlet />
        </div>
    );
}

export default MainLayout;