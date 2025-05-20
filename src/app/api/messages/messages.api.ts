import { api } from "../api";

export type MessageForUserDto = {
  content: string;
  receiverId: number;
  parentId?: number;
};

export type MessageInChannelDto = {
  content: string;
  channelId: number;
  parentId?: number;
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
    MessagesForUser: builder.mutation<Message, MessageForUserDto>({
      query: (data) => ({
        url: `/api/Message/PostForUser`,
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),
    MessagesInChannel: builder.mutation<Message, MessageInChannelDto>({
      query: (data) => ({
        url: `/api/Message/PostInChannel`,
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),
  }),
});

export const {
  useGetMessagesByUserIdQuery,
  useGetMessagesByChannelIdQuery,
  useMessagesForUserMutation,
  useMessagesInChannelMutation,
} = MessagesApi;
