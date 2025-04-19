import { createApi, fetchBaseQuery, retry } from '@reduxjs/toolkit/query/react';
import {RootState} from "../store/store.ts";

const baseQuery = fetchBaseQuery({
  baseUrl: `http://localhost:5263`,
  mode: 'cors',
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.accessToken;
    headers.set('Authorization', `Bearer ${token}`);
    return headers;
  },
});


const baseQueryWithRetry = retry(baseQuery, { maxRetries: 0 });

export const api = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithRetry,
  tagTypes: ['Auth', 'Workspaces'],

  endpoints: () => ({}),
});
