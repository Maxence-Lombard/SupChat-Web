import { api } from "../api";
import {status, theme, visibility} from "../../Models/Enums.ts";
import {User} from "../../Models/User.ts";

export type UserMpDto = {
  id: number;
  name: string,
  visibility: visibility,
  workspaceId: number
};

export type GetUserMpResponse = {
  id: number,
  firstName: string,
  lastName: string,
  image: null,
  status: status,
  statusLocalized: string,
  theme: theme,
  themeLocalized: string,
  language: string,
  languageLocalized: string
};

export const MessagesApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getUserInfos: builder.query<User, undefined>({
      query: () => ({
        url: '/api/Account/Own',
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }),
    }),

    getUserWithMessages: builder.query<GetUserMpResponse[], undefined>({
      query: () => ({
        url: '/api/User/Mp',
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }),
    }),
  }),
});

export const {
  useGetUserInfosQuery,
  useGetUserWithMessagesQuery
} = MessagesApi;
