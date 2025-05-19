import { api } from "../api";
import { visibility } from "../../Models/Enums.ts";

export type MessageDto = {
  id: number;
  name: string;
  visibility: visibility;
  workspaceId: number;
};

export type Message = {
  id: number;
  content: string;
  sendDate: Date;
  senderId: number;
  channelId: number;
  receiverId: number;
  parentId: number;
};

export const MessagesApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getMessagesByUserId: builder.query<Message[], number>({
      query: (Id, pageNumber = 1, pageSize = 10) => ({
        url: `/api/Message/ByUser?userId=${Id}&pageNumber=${pageNumber}&pageSize=${pageSize}`,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),
    getMessagesByChannelId: builder.query<Message[], number>({
      query: (Id, pageNumber = 1, pageSize = 10) => ({
        url: `/api/Message/ByChannel?channelId=${Id}&pageNumber=${pageNumber}&pageSize=${pageSize}`,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),
  }),
});

export const { useGetMessagesByUserIdQuery, useGetMessagesByChannelIdQuery } =
  MessagesApi;
