import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "../../Models/User.ts";

type UsersState = {
  byId: Record<string, Partial<User>>;
  allIds: string[];
  currentUserId?: string;
};

const initialState: UsersState = {
  byId: {},
  allIds: [],
  currentUserId: undefined,
};

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    addUser: (state, action: PayloadAction<User>) => {
      const user = action.payload;
      const userId = String(user.applicationUser.id);
      if (state.allIds.includes(userId)) return;
      if (userId === state.currentUserId) {
        state.byId[user.applicationUser.id] = user;
      } else {
        state.byId[user.applicationUser.id] = {
          id: userId,
          applicationUser: user.applicationUser,
        };
      }
      state.allIds.push(userId);
    },
    updateUser: (state, action: PayloadAction<User>) => {
      const user = action.payload;
      const userId = String(user.applicationUser.id);
      if (!user.applicationUser.id) return;
      if (userId === state.currentUserId) {
        state.byId[user.applicationUser.id] = user;
      } else {
        state.byId[user.applicationUser.id] = {
          id: userId,
          applicationUser: user.applicationUser,
        };
      }
    },
    setCurrentUserId: (state, action: PayloadAction<string>) => {
      state.currentUserId = action.payload;
    },
    clearUserInfos: () => initialState,
  },
});

export const { addUser, updateUser, setCurrentUserId, clearUserInfos } =
  usersSlice.actions;

export default usersSlice.reducer;
