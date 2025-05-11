import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {User, UserInitialState} from "../../Models/User.ts";

const initialState: UserInitialState = {
    id: undefined,
    firstName: undefined,
    lastName: undefined,
    image: undefined,
    status: undefined,
    statusLocalized: undefined,
    theme: undefined,
    themeLocalized: undefined,
    language: undefined,
    languageLocalized: undefined,
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUserInfos: (state, action: PayloadAction<User>) => {
            return { ...state, ...action.payload };
        },
        clearUserInfos: () => initialState,
    },
});

export const selectUser = (state: { user: User }) => state.user;

export const {
    setUserInfos,
    clearUserInfos,
} = userSlice.actions;

export default userSlice.reducer;
