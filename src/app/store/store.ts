import { configureStore } from "@reduxjs/toolkit";
import { api } from "../api/api";
import authReducer from "./slices/authSlice.ts";
import userReducer from "./slices/usersSlice.ts";
import workspacesReducer from "./slices/workspaceSlice.ts";
import channelsReducer from "./slices/channelSlice.ts";
import messageReducer from "./slices/messageSlice.ts";
import profilePictureReducer from "./slices/profilePictureSlice.ts";
import authMiddleware from "../middlewares/authMiddleware.ts";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    users: userReducer,
    workspaces: workspacesReducer,
    channels: channelsReducer,
    messages: messageReducer,
    profilePictures: profilePictureReducer,
    // ...createRouterReducerMapObject(routerHistory),
    [api.reducerPath]: api.reducer,
    // app: appReducer,
    // snackbar: snackbarReducer,
    // modal: modalReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    })
      // .concat(thunk)
      // .concat(createRouterMiddleware(routerHistory))
      .concat(api.middleware, authMiddleware),
  devTools: true,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
