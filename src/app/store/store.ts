import { configureStore } from "@reduxjs/toolkit";
import authReducer from './authSlice';
import { api } from "../api/api";
import authMiddleware from "../middlewares/authMiddleware.ts";

export const store = configureStore({
  reducer: {
    auth: authReducer,
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