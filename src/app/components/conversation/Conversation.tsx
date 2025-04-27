import user from "../../../assets/placeholder/user4.svg";
import user2 from "../../../assets/placeholder/user3.svg";
import plus from "../../../assets/icons/main-color/plus.svg";
import mention from "../../../assets/icons/main-color/mention.svg";
import emoji from "../../../assets/icons/main-color/emoji.svg";
import discard from "../../../assets/icons/discard.svg";
import send from "../../../assets/icons/send.svg";
import searchIconMainColor from "../../../assets/icons/main-color/search.svg";
import searchIcon from "../../../assets/icons/search.svg";
import infoIcon from "../../../assets/icons/main-color/info.svg";
import moreIcon from "../../../assets/icons/main-color/more.svg";
import {useEffect, useState} from "react";
import UserCard from "../shared/userCard/UserCard.tsx";
import {useGetMessagesByUserIdQuery} from "../../api/messages/messages.api.ts";

function Conversation() {
    const [search, setSearch] = useState<string>('');

    const { data: messages, error } = useGetMessagesByUserIdQuery(2);
    useEffect(() => {
        console.log('Fetched messages:', messages);
        if (messages) {
            console.log('Fetched messages:', messages);
        }
        if (error) {
            console.error('Error fetching messages:', error);
        }
    }, [messages, error]);

    return (
        <>
            <div className='flex gap-10 bg-white w-full rounded-l-[40px] px-4 py-8'>
                {/*Left Panel*/}
                <div className='flex flex-col gap-8 min-w-[231px]'>
                    <div className='flex gap-1 p-2 w-full border rounded-lg border-black'>
                        <img
                            className='w-6 h-6'
                            src={searchIcon}
                            alt="search"
                        />
                        <input
                            className='bg-white focus:outline-none w-full'
                            name="search"
                            id="firstname"
                            placeholder='Search'
                            value={search} onChange={(e) => setSearch(e.target.value ?? '')}
                        />
                    </div>
                    <div className='flex flex-col gap-5 h-full overflow-y-auto'>
                        <UserCard></UserCard>
                        <UserCard></UserCard>
                        <UserCard></UserCard>
                        <UserCard></UserCard>
                        <UserCard></UserCard>
                        <UserCard></UserCard>
                        <UserCard></UserCard>
                        <UserCard></UserCard>
                        <UserCard></UserCard>
                        <UserCard></UserCard>
                        <UserCard></UserCard>
                        <UserCard></UserCard>
                    </div>
                </div>
                <div className='flex flex-col flex-1'>
                    {/* User Banner */}
                    <div className='flex mb-8 w-full items-center justify-between border border-[#ECECEC] rounded-2xl px-4 py-2'>
                        <div className='flex items-center gap-2'>
                            <img src={user} alt='user' />
                            <div>
                                <p className='font-semibold'>Maria Santa</p>
                                <p className='text-[#00A000] text-xs'> online </p>
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
                                <img src={user} alt='user' />
                                <div className='flex flex-col gap-1 items-end'>
                                    <p className='text-black/50'> 15h32 </p>
                                    <div className='flex bg-[#EBEBEB] rounded-lg px-2 max-w-xl'>
                                        <p className='text-black'> Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis </p>
                                    </div>
                                </div>
                            </div>
                            <div className='flex items-end gap-3'>
                                <img src={user} alt='user' />
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
                                <img src={user} alt='user' />
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
                            { messages?.slice().reverse().map(messages => (
                                <div className='flex justify-end items-end w-full gap-3'>
                                    <div className='flex flex-col gap-1 items-end'>
                                        <p className='text-black/50'> 15h32 </p>
                                        <div className='flex bg-[#687BEC] rounded-lg px-2 max-w-xl'>
                                            <p className='text-white'> { messages.content } </p>
                                        </div>
                                    </div>
                                    <img src={user2} alt='user' />
                                </div>
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