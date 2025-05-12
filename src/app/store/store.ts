import { configureStore } from "@reduxjs/toolkit";
import { api } from "../api/api";
import authReducer from './slices/authSlice.ts';
import userReducer from './slices/userSlice.ts';
import workspacesReducer from './slices/workspaceSlice.ts';
import channelsReducer from './slices/channelSlice.ts';
import authMiddleware from "../middlewares/authMiddleware.ts";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    workspaces: workspacesReducer,
    channels: channelsReducer,
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