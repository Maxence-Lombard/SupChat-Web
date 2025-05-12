import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import workspacePH from "../../../../assets/icons/workspacePH.svg";
import {
    GetWorkspaceResponse,
    useGetWorkspacesJoinedQuery,
    useJoinWorkspaceMutation
} from "../../../api/workspaces/workspaces.api.ts";
import { setWorkspaces } from "../../../store/slices/workspaceSlice.ts";
import { RootState } from "../../../store/store.ts";

interface Workspace {
    workspace: GetWorkspaceResponse;
}

function WorkspaceCard({ workspace }: Workspace) {
    const userId = useSelector((state: RootState) => state.user.id);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [shouldFetch, setShouldFetch] = useState(false);
    const [AddMemberInWorkspace] = useJoinWorkspaceMutation();
    const { data: workspaces, isSuccess } = useGetWorkspacesJoinedQuery(undefined, { skip: !shouldFetch });

    useEffect(() => {
        if (isSuccess && workspaces) {
            dispatch(setWorkspaces(workspaces));
        }
    }, [isSuccess, workspaces])

    const handleNavigation = () => {
        navigate(`/workspace/${workspace.id}/channel/1`);
    }

    const handleJoinWorkspace = async () => {
        if (!userId) {
            console.error("User ID is not defined");
            return;
        }
        if (!workspace.id) {
            console.error("Workspace ID is not defined");
            return;
        }
        try {
            await AddMemberInWorkspace(workspace.id).unwrap();
            setShouldFetch(true);
            handleNavigation();
        } catch (error) {
            console.log("Error creating channel:", error);
        }
    }

    return (
        <div className="flex flex-col gap-4 border border-[#ECECEC] rounded-2xl p-4 h-60">
            <div className='flex items-center gap-4'>
                <img
                    className='w-14 h-14 rounded'
                    src={workspacePH}
                    alt="workspacePH"
                />
                <div className='flex flex-col'>
                    <p className='font-semibold'> {workspace.name} </p>
                    <p className='text-[#A0A0A0]'> 5 members </p> {/* TODO: change with the get membersByWorkspace route */}
                </div>
            </div>
            <p className='h-full'> Join us to discus about the final project and help us improve it. </p> {/* TODO: change with description */}
            <button className='flex self-end gap-2 px-4 py-2 items-center bg-[#687BEC] rounded-lg'
                onClick={handleJoinWorkspace}>
                <p className='text-white'> Join us </p>
                <i className='pi pi-external-link text-white' />
            </button>
        </div>
    );
}

export default WorkspaceCard;