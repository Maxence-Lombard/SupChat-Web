import userIcon from "../../../assets/placeholder/user4.svg";
import user2 from "../../../assets/placeholder/user3.svg";
import plus from "../../../assets/icons/main-color/plus.svg";
import mention from "../../../assets/icons/main-color/mention.svg";
import emoji from "../../../assets/icons/main-color/emoji.svg";
import discard from "../../../assets/icons/discard.svg";
import send from "../../../assets/icons/send.svg";
import searchIconMainColor from "../../../assets/icons/main-color/search.svg";
import infoIcon from "../../../assets/icons/main-color/info.svg";
import moreIcon from "../../../assets/icons/main-color/more.svg";
import {useGetMessagesByUserIdQuery} from "../../api/messages/messages.api.ts";
import {useDateFormatter} from "../../hooks/useDateFormatter.tsx";
import {useLocation, useParams} from "react-router-dom";
import DiscussionsListing from "../shared/discussions-listing/DiscussionsListing.tsx";
import {useEffect} from "react";
import {User, UserProps} from "../../Models/User.ts";

function Conversation() {
    const { id } = useParams();
    const { formatDate } = useDateFormatter();

    //TODO : replace by get user/id
    const location = useLocation();
    const user: User = location.state?.user;

    const userId = 1; //id of the connected user

    const { data: messages } = useGetMessagesByUserIdQuery(id);

    useEffect(() => {
        console.log('conv', user);
    }, [user]);

    return (
        <>
            <div className='flex gap-10 bg-white w-full rounded-l-[40px] px-4 py-8'>
                {/*Left Panel*/}
                <DiscussionsListing />
                <div className='flex flex-col flex-1'>
                    {/* User Banner */}
                    <div className='flex mb-8 w-full items-center justify-between border border-[#ECECEC] rounded-2xl px-4 py-2'>
                        <div className='flex items-center gap-2'>
                            <img src={userIcon} alt='userIcon' />
                            <div>
                                <p className='font-semibold'>  { user.firstName } </p>
                                <p className='text-[#00A000] text-xs'> { user.status } </p>
                            </div>
                        </div>
                        <div className='flex gap-6'>
                            <img
                                className='cursor-pointer w-6 h-6'
                                src={searchIconMainColor}
                                alt="search"
                            />
                            <img
                                className='cursor-pointer w-6 h-6'
                                src={infoIcon}
                                alt="search"
                            />
                            <img
                                className='cursor-pointer w-6 h-6'
                                src={moreIcon}
                                alt="search"
                            />
                        </div>
                    </div>
                    {/* CONVERSATIONS*/}
                    <div className='flex flex-col gap-4 h-full overflow-y-auto'>
                        <div className='flex flex-col gap-1 w-full'>
                            <p className='font-semibold'> November 15 2024 </p>
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
                                message.senderId === userId.toString() ? (
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
                    <div className='flex flex-col mt-1 gap-2 w-full'>
                        <hr className='flex-1 border border-[#EBEBEB]'/>
                        <div className='flex flex-col gap-4 p-2 justify-end bg-[#F3F3F3] rounded-2xl'>
                            <p>Message...</p>
                            <div className='flex justify-between w-full items-center'>
                                <div className='flex gap-4'>
                                    <img
                                        className='cursor-pointer'
                                        src={plus}
                                        alt="plus"
                                    />
                                    <img
                                        className='cursor-pointer'
                                        src={emoji}
                                        alt="emoji"
                                    />
                                    <img
                                        className='cursor-pointer'
                                        src={mention}
                                        alt="mention"
                                    />
                                </div>
                                <div className='flex gap-2 items-center'>
                                    <button className='flex gap-2 px-2 py-1 items-center bg-[#687BEC] rounded-lg'>
                                        <img
                                            className='cursor-pointer'
                                            src={discard}
                                            alt="discard"/>
                                            <p className='text-white'>Discard</p>
                                    </button>
                                    <button className='flex gap-2 px-2 py-1 items-center bg-[#687BEC] rounded-lg'>
                                        <img
                                            className='cursor-pointer'
                                            src={send}
                                            alt="send"/>
                                        <p className='text-white'>Send</p>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Conversation;