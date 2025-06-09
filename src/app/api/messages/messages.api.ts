import { api } from "../api";
import { AttachmentDto } from "../attachments/attachments.api.ts";

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
  messageAttachments: AttachmentDto[];
};

export type Reaction = {
  id: number;
  content: string;
  messageId: number;
  senderId: number;
};

export const MessagesApi = api.injectEndpoints({
  endpoints: (builder) => ({
    //GET
    getMessagesByUserId: builder.query<
      Message[],
      { Id: number; pageNumber: number; pageSize: number }
    >({
      query: ({ Id, pageNumber = 1, pageSize = 10 }) => ({
        url: `/api/Message/ByUser?userId=${Id}&pageNumber=${pageNumber}&pageSize=${pageSize}`,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),
    getMessagesByChannelId: builder.query<
      Message[],
      { Id: number; pageNumber: number; pageSize: number }
    >({
      query: ({ Id, pageNumber = 1, pageSize = 10 }) => ({
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
      { messageId: number; content: Reaction["content"] }
    >({
      query: (data) => ({
        url: `/api/Message/${data.messageId}/Reactions`,
        method: "POST",
        body: { content: data.content },
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
      }),
    }),
  }),
});

export const {
  useGetMessagesByUserIdQuery,
  useLazyGetMessagesByUserIdQuery,
  useGetMessagesByChannelIdQuery,
  useLazyGetMessagesByChannelIdQuery,
  useGetMessageReactionsQuery,
  useMessagesForUserMutation,
  useMessagesInChannelMutation,
  useCreateMessageReactionsMutation,
  useModifyMessageMutation,
  useDeleteMessageMutation,
  useDeleteMessageReactionsMutation,
} = MessagesApi;
