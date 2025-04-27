import { api } from "../api";
import {status, theme, visibility} from "../../Models/Enums.ts";

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
  useGetUserWithMessagesQuery
} = MessagesApi;
