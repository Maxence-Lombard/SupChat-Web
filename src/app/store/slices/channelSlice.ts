import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {GetChannelResponse} from "../../api/channels/channels.api.ts";

interface ChannelState {
    byWorkspaceId: Record<number, GetChannelResponse>;
}
const initialState: ChannelState = {
    byWorkspaceId: {},
}

export const channelsSlice = createSlice({
    name: 'channel',
    initialState: initialState,
    reducers: {
        setChannel: (state, action: PayloadAction<GetChannelResponse>) => {
            state.byWorkspaceId[action.payload.id] = action.payload;
        },
        setChannels: (state, action: PayloadAction<GetChannelResponse[]>) => {
            action.payload.forEach(channel => {
                state.byWorkspaceId[channel.id] = channel;
            });
        },
    },
})

export const { setChannel, setChannels } = channelsSlice.actions;
export default channelsSlice.reducer;