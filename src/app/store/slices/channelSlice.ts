import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { GetChannelResponse } from "../../api/channels/channels.api.ts";

interface ChannelState {
  byWorkspaceId: Record<number, GetChannelResponse>;
}

const initialState: ChannelState = {
  byWorkspaceId: {},
};

export const channelsSlice = createSlice({
  name: "channel",
  initialState: initialState,
  reducers: {
    addChannel: (state, action: PayloadAction<GetChannelResponse>) => {
      state.byWorkspaceId[action.payload.id] = action.payload;
    },
    modifyChannel: (state, action: PayloadAction<GetChannelResponse>) => {
      const channel = action.payload;
      if (state.byWorkspaceId[channel.id]) {
        state.byWorkspaceId[channel.id] = channel;
      }
    },
    deleteChannel: (state, action: PayloadAction<number>) => {
      const channelId = action.payload;
      if (state.byWorkspaceId[channelId]) {
        delete state.byWorkspaceId[channelId];
      }
    },
  },
});

export const { addChannel, modifyChannel, deleteChannel } =
  channelsSlice.actions;
export default channelsSlice.reducer;
