import workspacePH from "../../../../assets/icons/workspacePH.svg";
import {GetWorkspaceResponse} from "../../../api/workspaces/workspaces.api.ts";

interface Workspace {
    workspace: GetWorkspaceResponse;
}

function WorkspaceCard ({workspace}: Workspace) {
    return (
        <div className="flex flex-col gap-4 border border-[#ECECEC] rounded-2xl p-4 h-60">
            <div className='flex items-center gap-4'>
                <img
                    className='w-14 h-14 rounded'
                    src={workspacePH}
                    alt="workspacePH"
                />
                <div className='flex flex-col'>
                    <p className='font-semibold'> { workspace.name } </p>
                    <p className='text-[#A0A0A0]'> 5 members </p> {/* TODO: change with the get membersByWorkspace route */}
                </div>
            </div>
            <p className='h-full'> Join us to discus about the final project and help us improve it. </p> {/* TODO: change with description */}
            <button className='flex self-end gap-2 px-4 py-2 items-center bg-[#687BEC] rounded-lg'>
                <p className='text-white'> Join us </p>
                <i className='pi pi-external-link text-white' />
            </button>
        </div>
    );
}

export default WorkspaceCard;