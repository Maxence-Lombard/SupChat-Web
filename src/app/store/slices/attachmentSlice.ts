import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface attachmentSliceState {
  [key: string]: string;
}

const initialState: attachmentSliceState = {};

const attachmentSlice = createSlice({
  name: "attachment",
  initialState,
  reducers: {
    setAttachment: (
      state,
      action: PayloadAction<{ id: string; url: string }>,
    ) => {
      state[action.payload.id] = action.payload.url;
    },
    addAttachment: (
      state,
      action: PayloadAction<{ id: string; url: string }>,
    ) => {
      if (!state[action.payload.id]) {
        state[action.payload.id] = action.payload.url;
      }
    },
  },
});

export const { setAttachment, addAttachment } = attachmentSlice.actions;
export default attachmentSlice.reducer;
