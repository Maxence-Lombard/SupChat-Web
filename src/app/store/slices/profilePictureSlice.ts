import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ProfilePictureSliceState {
  [key: string]: string;
}

const initialState: ProfilePictureSliceState = {};

const profilePictureSlice = createSlice({
  name: "profilePicture",
  initialState,
  reducers: {
    setProfilePicture: (
      state,
      action: PayloadAction<{ id: string; url: string }>,
    ) => {
      state[action.payload.id] = action.payload.url;
    },
    addProfilePicture: (
      state,
      action: PayloadAction<{ id: string; url: string }>,
    ) => {
      if (!state[action.payload.id]) {
        state[action.payload.id] = action.payload.url;
      }
    },
  },
});

export const { setProfilePicture, addProfilePicture } =
  profilePictureSlice.actions;
export default profilePictureSlice.reducer;
