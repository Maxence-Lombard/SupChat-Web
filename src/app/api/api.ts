import { createApi, fetchBaseQuery, retry } from "@reduxjs/toolkit/query/react";
import { RootState } from "../store/store.ts";
import { selectAccessToken } from "../store/slices/authSlice.ts";

const baseQuery = fetchBaseQuery({
  baseUrl: `http://localhost:5263`,
  mode: "cors",
  prepareHeaders: async (headers, { getState }) => {
    const state = getState() as RootState;

    let token = selectAccessToken(state);
    const maxRetries = 5;
    let retries = 0;

    while (!token && retries < maxRetries) {
      await new Promise((resolve) => setTimeout(resolve, 50));
      token = (getState() as RootState).auth.accessToken;
      retries++;
    }

    headers.set("Authorization", `Bearer ${token}`);
    return headers;
  },
});

const baseQueryWithRetry = retry(baseQuery, { maxRetries: 0 });

export const api = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithRetry,
  tagTypes: ["Auth", "Workspaces", "Channels", "Users"],

  endpoints: () => ({}),
});
