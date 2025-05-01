import {InputText} from "primereact/inputtext";
import {useState} from "react";
import {useDispatch} from "react-redux";
import {useCreateChannelInWorkspaceMutation} from "../../../../api/workspaces/workspaces.api.ts";
import {visibility} from "../../../../Models/Enums.ts";
import {CreateChannelDto} from "../../../../api/channels/channels.api.ts";
import {setChannel} from "../../../../store/slices/channelSlice.ts";

interface CreateChannelPopupProps {
    hide: () => void;
    workspaceId: number;
    onChannelCreated: () => void;
}

function CreateChannelPopup({hide, workspaceId, onChannelCreated }: CreateChannelPopupProps) {
    const dispatch = useDispatch();
    const [newChannelName, setNewChannelName] = useState<string>('');
    const [isPublic, setIsPublic] = useState<boolean>(true);
    const [createChannelRequest] = useCreateChannelInWorkspaceMutation();

    const handleCreateChannel = async () => {
        if (!workspaceId) {
            console.error("L'ID du workspace est manquant.");
            hide();
            return;
        }
        if (!newChannelName) {
            console.error("Le nom du channel est manquant.");
            return;
        }

        const newChannel: CreateChannelDto = {
            name: newChannelName,
            visibility: isPublic ? visibility.public : visibility.private,
            workspaceId: workspaceId
        };

        try {
            const createdChannel = await createChannelRequest(newChannel).unwrap();
            dispatch(setChannel(createdChannel));
            onChannelCreated();
            hide();
        } catch (error) {
            console.log("Error creating channel:", error);
        }
    }


    return (
        <>
            <div className='flex flex-col text-black px-8 py-6 border bg-white border-[#ECECEC] rounded-2xl'>
                <div className='flex flex-col gap-4'>
                    <p className='font-semibold text-xl'>Create a channel</p>
                    <div className='flex flex-col gap-10'>
                        <div className='flex flex-col gap-8'>
                            <div className='flex flex-col gap-1'>
                                <label className='flex' htmlFor="createChannel">Name of the channel</label>
                                <InputText
                                    keyfilter="email"
                                    name="createChannel"
                                    id="createChannel"
                                    className='w-full border rounded border-black px-2 py-1'
                                    placeholder='Name of the channel'
                                    value={newChannelName} onChange={
                                    (e) => setNewChannelName(e.target.value ?? '')}
                                />
                            </div>
                            <div className='flex gap-8'>
                                <div className='flex flex-col gap-2'>
                                    <p> Public channel </p>
                                    <p className='text-black/50'> All the members can view and speak in this channel </p>
                                </div>
                                <input
                                    type="checkbox"
                                    className='customSwitch'
                                    defaultChecked
                                    onChange={(e) => setIsPublic(e.target.checked)}/>
                            </div>
                        </div>
                        <div className='flex self-end gap-4'>
                            <button className='flex gap-2 px-2 py-1 items-center border border-[#687BEC] rounded-lg'
                                    onClick={(e) => hide(e)}>
                                <i className="pi pi-times" style={{ color: 'var(--primary-color)' }}></i>
                                <p className='text-[#687BEC]'>Cancel</p>
                            </button>
                            <button className='flex gap-2 px-2 py-1 items-center bg-[#687BEC] rounded-lg'
                                    onClick={() => handleCreateChannel()}>
                                <i className="pi pi-plus text-white"></i>
                                <p className='text-white'>Create the channel</p>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default CreateChannelPopup;