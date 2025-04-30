import { api } from "../api";
import {visibility} from "../../Models/Enums.ts";

export type MessageDto = {
  id: number;
  name: string,
  visibility: visibility,
  workspaceId: number
};

export type GetMessagesResponse = {
  id: 5,
  content: string,
  sendDate: Date,
  senderId: string, //TODO: change to number
  channelId: number,
  receiverId: string, //TODO: change to number
  parentId: number
};

export const MessagesApi = api.injectEndpoints({
  endpoints: (builder) => ({

    getMessagesByUserId: builder.query<GetMessagesResponse[], number>({
      query: (Id, pageNumber = 1, pageSize= 10) => ({
        url: `/api/Message/ByUser?userId=${Id}&pageNumber=${pageNumber}&pageSize=${pageSize}`,
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }),
    }),
  }),
});

export const {
  useGetMessagesByUserIdQuery
} = MessagesApi;
