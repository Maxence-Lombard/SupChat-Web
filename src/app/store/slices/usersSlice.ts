import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ApplicationUser } from "../../Models/User.ts";

type UsersState = {
  byId: Record<string, Partial<ApplicationUser>>;
  allIds: number[];
  currentUserId?: number;
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
    addUser: (state, action: PayloadAction<ApplicationUser>) => {
      const user = action.payload;
      const userId = user.id;
      if (state.allIds.includes(userId)) return;
      if (userId === state.currentUserId) {
        state.byId[user.id] = user;
      } else {
        state.byId[user.id] = {
          ...user,
        };
      }
      state.allIds.push(userId);
    },
    updateUser: (state, action: PayloadAction<ApplicationUser>) => {
      const user = action.payload;
      const userId = user.id;
      if (!user.id) return;
      if (userId === state.currentUserId) {
        state.byId[user.id] = user;
      } else {
        state.byId[user.id] = {
          ...user,
        };
      }
    },
    setCurrentUserId: (state, action: PayloadAction<number>) => {
      state.currentUserId = action.payload;
    },
    clearUserInfos: () => initialState,
  },
});

export const { addUser, updateUser, setCurrentUserId, clearUserInfos } =
  usersSlice.actions;

export default usersSlice.reducer;
