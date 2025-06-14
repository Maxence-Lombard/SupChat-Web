import { createApi, fetchBaseQuery, retry } from "@reduxjs/toolkit/query/react";
import { RootState } from "../store/store.ts";
import { selectAccessToken } from "../store/slices/authSlice.ts";

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_URL,
  mode: "cors",
  responseHandler: (response) => {
    if ([201, 204].includes(response.status)) {
      return Promise.resolve(undefined);
    }
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/zip")) {
      return response.blob();
    }
    if (contentType && contentType.includes("application/json")) {
      return response.json();
    } else if (contentType && contentType.includes("text/plain")) {
      return response.text();
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
    "OwnedBots",
    "ChannelMembers",
    "ChannelMembersCount",
    "WorkspacesJoined",
  ],

  endpoints: () => ({}),
});
