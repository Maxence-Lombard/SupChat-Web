import {
  combineReducers,
  configureStore,
  UnknownAction,
} from "@reduxjs/toolkit";
import { api } from "../api/api";
import authReducer from "./slices/authSlice.ts";
import userReducer from "./slices/usersSlice.ts";
import workspacesReducer from "./slices/workspaceSlice.ts";
import channelsReducer from "./slices/channelSlice.ts";
import messageReducer from "./slices/messageSlice.ts";
import profilePictureReducer from "./slices/profilePictureSlice.ts";
import reactionReducer from "./slices/reactionSlice.ts";
import roleReducer from "./slices/roleSlice.ts";
import authMiddleware from "../middlewares/authMiddleware.ts";

const appReducer = combineReducers({
  auth: authReducer,
  users: userReducer,
  workspaces: workspacesReducer,
  channels: channelsReducer,
  messages: messageReducer,
  profilePictures: profilePictureReducer,
  reactions: reactionReducer,
  roles: roleReducer,
  [api.reducerPath]: api.reducer,
});

const rootReducer = (
  state: ReturnType<typeof appReducer> | undefined,
  action: UnknownAction,
) => {
  if (action.type === "RESET") {
    state = undefined;
  }
  return appReducer(state, action);
};

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(api.middleware, authMiddleware),
  devTools: true,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
