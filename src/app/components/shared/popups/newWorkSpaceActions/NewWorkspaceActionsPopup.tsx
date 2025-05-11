import {useNavigate} from "react-router-dom";

interface NewWorkspaceActionProps {
    hide: () => void;
    onClose: (action?: string) => void;
}

function NewWorkspaceActionsPopup({ hide, onClose }: NewWorkspaceActionProps) {
    const navigate = useNavigate();

    const handleNavigation = () => {
        navigate('/joinWorkspaces');
        hide();
    };
    const handleWorkspaceActions = (action: string) => {
        if (action === 'create') {
            console.log("Create workspace");
            onClose('create');
            hide();
        }
        if (action === 'join') {
            handleNavigation();
        }
    }

    return (
        <>
            <div className='flex flex-col gap-6 min-w-96 text-black p-4 bg-white border border-[#ECECEC] rounded-2xl'>
                <div className='flex px-2 py-1 justify-between items-center border border-[#ECECEC] rounded-lg'
                     onClick={() => handleWorkspaceActions('create')}>
                    <div className='flex flex-col gap-1'>
                        <p className='font-semibold'> Create a Workspace </p>
                        <p className='text-sm text-black/50 font-semibold'> Create your own workspace </p>
                    </div>
                    <i className='pi pi-plus-circle text-2xl cursor-pointer' style={{ color: 'var(--primary-color)' }} />
                </div>
                <div className='flex px-2 py-1 justify-between items-center border border-[#ECECEC] rounded-lg'
                     onClick={() => handleWorkspaceActions('join')}>
                    <div className='flex flex-col gap-1'>
                        <p className='font-semibold'> Join a Workspace </p>
                        <p className='text-sm text-black/50 font-semibold'> Join a public workspace </p>
                    </div>
                    <i className='pi pi-search text-2xl' style={{ color: 'var(--primary-color)' }} />
                </div>
            </div>

        </>
    )
}

export default NewWorkspaceActionsPopup;