import userIcon from "../../../assets/placeholder/user4.svg";
import user2 from "../../../assets/placeholder/user3.svg";
import {useParams} from "react-router-dom";
import {useGetMessagesByChannelIdQuery} from "../../api/messages/messages.api.ts";
import {formatDate} from "date-fns";
import {useSelector} from "react-redux";
import {RootState} from "../../store/store.ts";

function Channel () {
    const { channelId } = useParams();
    const userId = useSelector((state: RootState) => state.user.id);

    const { data: messages } = useGetMessagesByChannelIdQuery(Number(channelId));

    return (
        <>
            <div className='flex flex-col gap-4 h-full overflow-y-auto'>
                <div className='flex flex-col gap-1 w-full'>
                    <p className='font-semibold'> November 15 2024 CHANNEL </p>
                    <hr className='flex-1 border border-black'/>
                </div>
                <div className='flex flex-col items-start gap-4'>
                    <div className='flex items-end gap-3'>
                        <img src={userIcon} alt='userIcon' />
                        <div className='flex flex-col gap-1 items-end'>
                            <p className='text-black/50'> 15h32 </p>
                            <div className='flex bg-[#EBEBEB] rounded-lg px-2 max-w-xl'>
                                <p className='text-black'> Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis </p>
                            </div>
                        </div>
                    </div>
                    <div className='flex items-end gap-3'>
                        <img src={userIcon} alt='userIcon' />
                        <div className='flex flex-col gap-1 items-end'>
                            <p className='text-black/50'> 15h32 </p>
                            <div className='flex bg-[#EBEBEB] rounded-lg px-2 max-w-xl'>
                                <p className='text-black'> Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis </p>
                            </div>
                        </div>
                    </div>
                    <div className='flex justify-end items-end w-full gap-3'>
                        <div className='flex flex-col gap-1 items-end'>
                            <p className='text-black/50'> 15h32 </p>
                            <div className='flex bg-[#687BEC] rounded-lg px-2 max-w-xl'>
                                <p className='text-white'> Sure </p>
                            </div>
                        </div>
                        <img src={user2} alt='user' />

                    </div>
                    <div className='flex flex-col gap-1 w-full'>
                        <p className='font-semibold'> Yesterday </p>
                        <hr className='flex-1 border border-black'/>
                    </div>
                    <div className='flex items-end gap-3'>
                        <img src={userIcon} alt='userIcon' />
                        <div className='flex flex-col gap-1 items-end'>
                            <p className='text-black/50'> 15h32 </p>
                            <div className='flex bg-[#EBEBEB] rounded-lg px-2 max-w-xl'>
                                <p className='text-black'> Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis </p>
                            </div>
                        </div>
                    </div>
                    <div className='flex flex-col gap-1 w-full'>
                        <div className='flex justify-between w-full'>
                            <p className='font-semibold text-[#6B8AFD]'> Today </p>
                            <p className='font-semibold text-[#6B8AFD]'> NEW </p>
                        </div>
                        <hr className='flex-1 border border-[#6B8AFD]'/>
                    </div>
                    { messages?.slice().reverse().map(message => (
                        message.senderId === userId ? (
                            <div className='flex justify-end items-end w-full gap-3' key={message.id}>
                                <div className='flex flex-col gap-1 items-end'>
                                    <p className='text-black/50'> { formatDate(message.sendDate, "HH'h'mm") } </p>
                                    <div className='flex bg-[#687BEC] rounded-lg px-2 max-w-xl'>
                                        <p className='text-white'> { message.content } </p>
                                    </div>
                                </div>
                                <img src={user2} alt='user' />
                            </div>
                        ) : (
                            <div className='flex items-end gap-3' key={message.id}>
                                <img src={userIcon} alt='userIcon' />
                                <div className='flex flex-col gap-1'>
                                    <p className='text-black/50'> { formatDate(message.sendDate, "HH'h'mm") } </p>
                                    <div className='flex bg-[#EBEBEB] rounded-lg px-2 max-w-xl'>
                                        <p className='text-black'> { message.content } </p>
                                    </div>
                                </div>
                            </div>
                        )
                    ))}
                </div>
            </div>
        </>
    )
}

export default Channel