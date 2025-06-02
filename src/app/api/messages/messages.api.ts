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

type Reaction = {
  id: number;
  content: string;
  messageId: number;
  senderId: number;
};

export const MessagesApi = api.injectEndpoints({
  endpoints: (builder) => ({
    //GET
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
    getMessageReactions: builder.query<Reaction[], number>({
      query: (messageId) => ({
        url: `/api/Message/${messageId}/Reactions`,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),

    //POST
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
    CreateMessageReactions: builder.mutation<
      Reaction,
      { messageId: number; content: Partial<Reaction> }
    >({
      query: (data) => ({
        url: `/api/Message/${data.messageId}/Reactions`,
        method: "POST",
        body: JSON.stringify(data.content),
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),

    //PATCH
    ModifyMessage: builder.mutation<
      Message,
      { messageId: number; content: string }
    >({
      query: (data) => ({
        url: `/api/Message/${data.messageId}`,
        method: "PATCH",
        body: JSON.stringify({ content: data.content }),
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),
    //DELETE
    DeleteMessage: builder.mutation<Message, number>({
      query: (messageId) => ({
        url: `/api/Message/${messageId}`,
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),
    DeleteMessageReactions: builder.mutation<
      Reaction,
      { messageId: number; reactionId: number }
    >({
      query: (data) => ({
        url: `/api/Message/${data.messageId}/Reactions/${data.reactionId}`,
        method: "DELETE",
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
  useGetMessageReactionsQuery,
  useMessagesForUserMutation,
  useMessagesInChannelMutation,
  useCreateMessageReactionsMutation,
  useModifyMessageMutation,
  useDeleteMessageMutation,
  useDeleteMessageReactionsMutation,
} = MessagesApi;
