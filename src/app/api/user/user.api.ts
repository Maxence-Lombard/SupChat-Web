import { api } from "../api";
import { visibility } from "../../Models/Enums.ts";
import { ApplicationUser, User } from "../../Models/User.ts";

export type UserMpDto = {
  id: number;
  name: string;
  visibility: visibility;
  workspaceId: number;
};

export const MessagesApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getUserInfos: builder.query<User, undefined>({
      query: () => ({
        url: "/api/Account/Me",
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),

    getUserInfosById: builder.mutation<ApplicationUser, number>({
      query: (userId) => ({
        url: `/api/User/${userId}`,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),

    getUserWithMessages: builder.query<ApplicationUser[], undefined>({
      query: () => ({
        url: "/api/User/Mp",
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),
  }),
});

export const {
  useGetUserInfosQuery,
  useGetUserInfosByIdMutation,
  useGetUserWithMessagesQuery,
} = MessagesApi;
