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
  },
});

export const { addChannel, modifyChannel } = channelsSlice.actions;
export default channelsSlice.reducer;
