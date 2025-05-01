import workspacePH from '../../../../assets/icons/workspacePH.svg'
import user from '../../../../assets/placeholder/user1.svg'
import {useNavigate} from "react-router-dom";
import {useSelector} from "react-redux";
import {RootState} from "../../../store/store";

function NavBar() {
    const workspaces = useSelector((state: RootState) => state.workspaces.list);
    const navigate = useNavigate();

    const handleNavigation = (nav: string) => {
        switch (nav) {
            case 'messages':
                navigate(`/`);
                break;
            case 'activities':
                navigate(`/`);
                break;
            case 'settings':
                navigate(`/`);
                break;
            default:
                break;
        }

    };
    const navigateToWorkspace = (id: number) => {
        navigate(`/workspace/${id}`);
    }

    return (
        <>
            <div className='flex flex-col justify-between items-center w-28 h-full px-4 py-10'>
                <div className='flex flex-col gap-10'>
                    <div className='flex flex-col items-center gap-4'>
                        <i className='pi pi-inbox text-2xl cursor-pointer'
                           onClick={() => handleNavigation('messages')}/>
                        <i className='pi pi-bell text-2xl cursor-pointer' />
                        <i className='pi pi-cog text-2xl  cursor-pointer' />

                    </div>
                    <hr className='w-full border border-black/50 '/>
                    <div className='flex flex-col items-center gap-4'>
                        {workspaces?.map((workspace) => (
                            <img
                                onClick={() => navigateToWorkspace(workspace.id)}
                                key={workspace.id}
                                className='w-12 h-12 cursor-pointer rounded-lg'
                                src={workspacePH}
                                alt="workspacePH"
                            />
                        ))}
                        <button className='flex items-center justify-center w-12 h-12 bg-white border border-[#ECECEC] rounded-lg'>
                            <i className='pi pi-plus'/>
                        </button>

                    </div>
                </div>
                <div>
                    <img
                        className='w-12 h-12 cursor-pointer rounded-lg'
                        src={user}
                        alt="user"
                    />
                </div>
            </div>
        </>
    )
}

export default NavBar
