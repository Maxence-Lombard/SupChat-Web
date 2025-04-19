import user from '../../../../assets/placeholder/user2.svg'
import {useNavigate} from "react-router-dom";

function UserCard() {
    const navigate = useNavigate();
    const handleNavigation = () => {
        navigate('/conversation');
    };

    return (
        <>
            <div className='flex gap-3' onClick={handleNavigation}>
                <div className='inline-block relative'>
                    <img src={user} alt='user' />
                    <div className='status-indicator'></div>
                </div>
                <div className='flex flex-col gap-2'>
                    <div className='flex justify-between'>
                        <p className='font-semibold'>Jbj</p>
                        <p className='text-black/50'>21h12</p>
                    </div>
                    <p className='text-black/50'>mon kim K est éclaté  !</p>
                </div>
            </div>
        </>
    )
}

export default UserCard
