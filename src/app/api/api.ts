import { createApi, fetchBaseQuery, retry } from "@reduxjs/toolkit/query/react";
import { RootState } from "../store/store.ts";
import { selectAccessToken } from "../store/slices/authSlice.ts";

const baseQuery = fetchBaseQuery({
  baseUrl: `http://localhost:5263`,
  mode: "cors",
  responseHandler: (response) => {
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/zip")) {
      return response.blob();
    }
    if (contentType && contentType.includes("application/json")) {
      return response.json();
    } else if (contentType && contentType.includes("text/plain")) {
      return response.text(); // ✅ string supporté
    }
    return response.json();
  },
  prepareHeaders: (headers, { getState }) => {
    const state = getState() as RootState;
    const token = selectAccessToken(state);

    headers.set("Authorization", `Bearer ${token}`);
    return headers;
  },
});

const baseQueryWithRetry = retry(baseQuery, { maxRetries: 0 });

export const api = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithRetry,
  tagTypes: [
    "Auth",
    "Workspaces",
    "Channels",
    "Users",
    "Roles",
    "Notifications",
    "WorkspaceRoleMembers",
    "WorkspaceRoleMembersCount",
  ],

  endpoints: () => ({}),
});
