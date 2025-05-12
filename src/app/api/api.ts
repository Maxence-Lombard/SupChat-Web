import { createApi, fetchBaseQuery, retry } from '@reduxjs/toolkit/query/react';
import { RootState } from "../store/store.ts";

const baseQuery = fetchBaseQuery({
  baseUrl: `https://localhost:7268`,
  mode: 'cors',
  prepareHeaders: async (headers, { getState }) => {
    const state = getState() as RootState;

    let token = state.auth.accessToken;
    const maxRetries = 5;
    let retries = 0;

    while (!token && retries < maxRetries) {
      await new Promise((resolve) => setTimeout(resolve, 50));
      token = (getState() as RootState).auth.accessToken;
      retries++;
    }

    headers.set('Authorization', `Bearer ${token}`);
    return headers;
  }
});

const baseQueryWithRetry = retry(baseQuery, { maxRetries: 0 });

export const api = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithRetry,
  tagTypes: ['Auth', 'Workspaces', 'Channels'],

  endpoints: () => ({}),
});
