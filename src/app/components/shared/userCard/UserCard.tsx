import userIcon from '../../../../assets/placeholder/user2.svg'
import {useNavigate} from "react-router-dom";
import {UserProps} from "../../../Models/User.ts";



function UserCard({ user } : UserProps) {
    const navigate = useNavigate();
    const handleNavigation = () => {
        navigate(`/conversation/${user.id}`, {
            state: {
                user: user
            }
        });
    };


    return (
        <>
            <div className='flex gap-3 cursor-pointer' onClick={handleNavigation}>
                <div className='inline-block relative'>
                    <img src={userIcon} alt='userIcon' />
                    <div className='status-indicator'></div>
                </div>
                <div className='flex flex-col gap-2'>
                    <div className='flex justify-between'>
                        <p className='font-semibold'> { user.firstName } </p>
                        <p className='text-black/50'>21h12</p>
                    </div>
                    <p className='text-black/50'>mon kim K est éclaté  !</p>
                </div>
            </div>
        </>
    )
}

export default UserCard
