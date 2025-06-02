import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Reaction } from "../../api/messages/messages.api.ts";

interface ReactionState {
  reaction: Record<number, Reaction>;
}

const initialState: ReactionState = {
  reaction: {},
};

export const reactionSlice = createSlice({
  name: "reaction",
  initialState: initialState,
  reducers: {
    addReaction: (state, action: PayloadAction<Reaction>) => {
      const reaction = action.payload;
      state.reaction[reaction.id] = reaction;
    },
    removeReaction: (state, action: PayloadAction<number>) => {
      const reactionId = action.payload;
      delete state.reaction[reactionId];
    },
  },
});

export const { addReaction, removeReaction } = reactionSlice.actions;
export default reactionSlice.reducer;
