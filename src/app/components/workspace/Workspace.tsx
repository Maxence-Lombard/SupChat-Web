// ASSETS
import user from "../../../assets/placeholder/user4.svg";
import user2 from "../../../assets/placeholder/user3.svg";
import searchIcon from "../../../assets/icons/search.svg";
import workspacePH from "../../../assets/icons/workspacePH.svg";
import channelMainColor from "../../../assets/icons/main-color/channel.svg";
import channelIcon from "../../../assets/icons/channel.svg";
import {AvatarGroup} from "primereact/avatargroup";
import { useParams } from 'react-router-dom';
import {useEffect, useState} from "react";
import {Avatar} from "primereact/avatar";
import {
    useGetChannelsByWorkspaceIdQuery,
    useGetWorkspaceByIdQuery
} from "../../api/workspaces/workspaces.api.ts";
import {Dialog} from "primereact/dialog";
import CreateChannelPopup from "../shared/popups/createChannelPopup/CreateChannelPopup.tsx";
import {useDispatch, useSelector} from "react-redux";
import {addChannel} from "../../store/slices/channelSlice.ts";
import {RootState} from "../../store/store.ts";

function Workspace() {
    const dispatch = useDispatch();

    const { id } = useParams();
    const [search, setSearch] = useState<string>('');
    const [visible, setVisible] = useState<boolean>(false);

    const channelsFromStore = useSelector((state: RootState) => state.channels.byWorkspaceId);
    const workspaceChannels = Object.values(channelsFromStore).filter(channel => channel.workspaceId === Number(id));
    const skip = workspaceChannels.length > 0;

    const { data: workspace } = useGetWorkspaceByIdQuery(Number(id));
    const { data: channels, isSuccess } = useGetChannelsByWorkspaceIdQuery(Number(id), { skip });

    useEffect(() => {
        if (isSuccess && channels) {
            channels.forEach(channel => {
                dispatch(addChannel(channel));
            });
        }
    }, [isSuccess, channels, dispatch]);

    return (
        <>
            <div className='flex gap-10 bg-white w-full rounded-l-[40px] px-4 py-8'>
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
                    <div className='flex flex-col p-2 gap-6 h-full overflow-y-auto bg-[#EBEBEB]/50 rounded-lg'>
                        <div className='flex gap-3'>
                            <img
                                className='w-12 h-12 cursor-pointer rounded'
                                src={workspacePH}
                                alt="workspacePH"
                            />
                            <div className='flex flex-col h-full gap-auto'>
                                <p className='font-semibold'> { workspace?.name } </p>
                                <div className='flex items-center gap-1'>
                                    <p className='text-black/50'>Settings</p>
                                    <i className='pi pi-cog text-black/50' />
                                </div>
                            </div>
                        </div>
                        <hr className='w-full border border-[#EBEBEB]'/>
                        <div className='flex flex-col gap-6'>
                            {/* LIST OF CHANNELS */}
                            <div className='flex flex-col gap-2'>
                                <div className='flex gap-2'>
                                    <div className='flex flex-col h-full items-center gap-4'>
                                        <img
                                            className='w-6 h-6 rounded-lg'
                                            src={channelMainColor}
                                            alt="channelMainColor"
                                        />
                                        <div className="w-[1px] h-full rounded-lg bg-black"></div>
                                    </div>
                                    <div className='flex flex-col gap-3'>
                                        <div className='flex gap-3'>
                                            <p className='font-semibold text-[#6B8AFD]'>Channels</p>
                                        </div>
                                        <div className='flex flex-col gap-3'>
                                            {workspaceChannels?.map((channel) => (
                                                <div className='flex items-center gap-1' key={channel.id}>
                                                    <img
                                                        className='w-6 h-6'
                                                        src={channelIcon}
                                                        alt="channelIcon"
                                                    />
                                                    <p>{channel.name}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <div className='flex items-center gap-3 ml-1 cursor-pointer'
                                     onClick={() => setVisible(true)}>
                                    <i className='pi pi-plus-circle' style={{ color: 'var(--primary-color)' }} />
                                    <p>Add Channel</p>
                                </div>
                                <Dialog
                                    className='rounded-2xl'
                                    visible={visible}
                                    modal
                                    onHide={() => {if (!visible) return; setVisible(false); }}
                                    content={({ hide }) => (
                                        <CreateChannelPopup
                                            hide={hide}
                                            workspaceId={Number(id)}
                                            onChannelCreated={() => {
                                                setVisible(false);
                                            }}
                                        />
                                    )}
                                ></Dialog>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='flex flex-col flex-1'>
                    {/* WORKSPACE BANNER */}
                    <div className='flex mb-8 w-full items-center justify-between border border-[#ECECEC] rounded-2xl px-4 py-2'>
                        <div className='flex items-center gap-2'>
                            <img className='rounded w-14 h-14' src={workspacePH} alt='workspacePH' />
                            <div>
                                <p className='font-semibold'> { workspace?.name} - general</p>
                                <div className='flex items-center gap-2'>
                                    <p className='text-black/50 text-xs'> 5 members </p>
                                    <div className="w-1 h-1 bg-[#D9D9D9] rounded-full"></div>
                                    <p className='text-[#00A000] text-xs'> 2 online </p>
                                </div>
                            </div>
                        </div>
                        <div className='flex items-center gap-2 h-full py-1'>
                            <div className='flex items-center gap-2'>
                                <AvatarGroup>
                                    <Avatar image={user} size="large" shape="square" className='rounded-lg' />
                                    <Avatar image={user} size="large" shape="square" className='rounded-lg' />
                                    <Avatar image={user} size="large" shape="square" className='rounded-lg' />
                                    <Avatar label="+2" shape="square" size="large" className='bg-[#6B8AFD] text-white rounded-lg'/>
                                </AvatarGroup>
                            </div>
                            <div className="w-[1px] h-full rounded-lg bg-[#ECECEC]"></div>
                            <div className='flex items-center gap-6'>
                                <i className='pi pi-search text-xl cursor-pointer' style={{ color: 'var(--primary-color)' }} />
                                <i className='pi pi-info-circle text-xl cursor-pointer' style={{ color: 'var(--primary-color)' }} />
                                <i className='pi pi-ellipsis-v text-xl cursor-pointer' style={{ color: 'var(--primary-color)' }} />
                            </div>
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
                            <div className='flex justify-end items-end w-full gap-3'>
                                <div className='flex flex-col gap-1 items-end'>
                                    <p className='text-black/50'> 15h32 </p>
                                    <div className='flex bg-[#687BEC] rounded-lg px-2 max-w-xl'>
                                        <p className='text-white'> Sorry did’t saw your mess. Yea that’s ok for me lets do it like that </p>
                                    </div>
                                </div>
                                <img src={user2} alt='user' />

                            </div>
                            <div className='flex justify-end items-end w-full gap-3'>
                                <div className='flex flex-col gap-1 items-end'>
                                    <p className='text-black/50'> 15h32 </p>
                                    <div className='flex bg-[#687BEC] rounded-lg px-2 max-w-xl'>
                                        <p className='text-white'> Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis </p>
                                    </div>
                                </div>
                                <img src={user2} alt='user' />

                            </div>

                        </div>
                    </div>
                    <div className='flex flex-col mt-1 gap-2 w-full'>
                        <hr className='flex-1 border border-[#EBEBEB]'/>
                        <div className='flex flex-col gap-4 p-2 justify-end bg-[#F3F3F3] rounded-2xl'>
                            <p>Message...</p>
                            <div className='flex justify-between w-full items-center'>
                                <div className='flex gap-4'>
                                    <i className='pi pi-plus-circle text-xl cursor-pointer' style={{ color: 'var(--primary-color)' }} />
                                    <i className='pi pi-face-smile text-xl cursor-pointer' style={{ color: 'var(--primary-color)' }} />
                                    <i className='pi pi-at text-xl cursor-pointer' style={{ color: 'var(--primary-color)' }} />
                                </div>
                                <div className='flex gap-2 items-center'>
                                    <button className='flex gap-2 px-2 py-1 items-center bg-[#687BEC] rounded-lg'>
                                        <i className='pi pi-times-circle text-white' />
                                        <p className='text-white'>Discard</p>
                                    </button>
                                    <button className='flex gap-2 px-2 py-1 items-center bg-[#687BEC] rounded-lg'>
                                        <i className='pi pi-send text-white' />
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

export default Workspace;