import WorkspaceCard from "../shared/workspaceCard/WorkspaceCard.tsx";
import {useGetWorkspacesAvailableQuery} from "../../api/workspaces/workspaces.api.ts";

function JoinWorkspaces() {
    const { data: workspaces } = useGetWorkspacesAvailableQuery(undefined);

    return(
        <>
            <div className='flex gap-10 bg-white w-full rounded-l-[40px] px-4 py-8'>
                <div className='flex flex-col flex-1 gap-10'>
                    <div className='bg-[#6B8AFD] flex flex-col h-auto p-6 gap-1 w-full rounded-2xl'>
                        <h2 className='text-white font-semibold text-xl'> Join the public workspaces created by the community </h2>
                        <p className='text-white/75'> Here you’ll find out the subjects you like the most </p>
                    </div>
                    {/* LIST OF WORKSPACES */}
                    <div className='flex flex-col h-full gap-4 overflow-y-auto'>
                        <p className='font-semibold'> Main Workspaces </p>
                        <div className='grid grid-cols-[repeat(auto-fit,minmax(320px,1fr))] gap-4'>
                            {workspaces?.map((workspace) => (
                                <div key={workspace.id}>
                                    <WorkspaceCard
                                        workspace={workspace}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default JoinWorkspaces;