import userIcon from '../../../../assets/placeholder/user3.svg'
import message from "../../../../assets/icons/message.svg";
import close from "../../../../assets/icons/close.svg";
import {status} from "../../../Models/Enums.ts";

interface Props {
    user: {
        id: number;
        firstName: string;
        status: status;
    }
}

function ShortInfoUserCard({ user }: Props) {
    return (
        <>
            <div className='flex py-1 px-2 items-center justify-between border border-[#ECECEC] rounded-lg'>
                <div className='flex gap-3'>
                    <div className='inline-block relative'>
                        <img src={userIcon} alt='userIcon' />
                        <div className='status-indicator'></div>
                    </div>
                    <div className='flex flex-col gap-2'>
                        <p className='font-semibold'> { user.firstName } </p>
                        <p className='text-[#00A000]'> { user.status } </p>
                    </div>
                </div>
                <div className='flex items-center gap-2'>
                    <img className='w-7 h-7 cursor-pointer'
                         src={message}
                         alt='message'
                         data-pr-tooltip="No notifications"
                         data-pr-position="right"
                         data-pr-at="right+5 top"
                         data-pr-my="left center-2"
                    ></img>
                    <img className='w-9 h-9 cursor-pointer'
                         src={close}
                         alt='close'
                    ></img>
                </div>
            </div>
        </>
    )
}

export default ShortInfoUserCard
