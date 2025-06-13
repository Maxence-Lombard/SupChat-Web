import { api } from "../api";
import { visibility } from "../../Models/Enums.ts";
import { ApplicationUser } from "../../Models/User.ts"; //DTO

//DTO
export type ChannelDto = {
  id: number;
  name: string;
  visibility: visibility;
  workspaceId: number;
};

export type CreateChannelDto = {
  name: string;
  visibility: visibility;
  workspaceId: number;
};

//Response
export type GetChannelResponse = {
  id: number;
  name: string;
  visibility: visibility;
  visibilityLocalized: string;
  workspaceId: number;
};

export const ChannelsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getChannels: builder.query<GetChannelResponse[], undefined>({
      query: () => ({
        url: `/api/Channel`,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),

    getChannelById: builder.query<GetChannelResponse, number>({
      query: (Id) => ({
        url: `/api/Channel/${Id}`,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),

    getChannelMembersCount: builder.query<number, number>({
      query: (Id) => ({
        url: `/api/Channel/${Id}/CountMembers`,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),

    getChannelMembers: builder.query<
      ApplicationUser[],
      { channelId: number; pageNumber: number; pageSize: number }
    >({
      query: (data) => ({
        url: `/api/Channel/${data.channelId}/Members?pageNumber=${data.pageNumber | 1}&pageSize=${data.pageSize | 20}`,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),

    getChannelNotMembers: builder.query<
      ApplicationUser[],
      { channelId: number; pageNumber: number; pageSize: number }
    >({
      query: (data) => ({
        url: `/api/Channel/${data.channelId}/NotMember?pageNumber=${data.pageNumber | 1}&pageSize=${data.pageSize | 20}`,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),

    addMembersInChannel: builder.mutation<
      boolean,
      { channelId: number; usersId: number[] }
    >({
      query: (data) => ({
        url: `/api/Channel/${data.channelId}/AddMembers`,
        method: "POST",
        body: JSON.stringify({ userIdList: data.usersId }),
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),

    modifyChannel: builder.mutation<GetChannelResponse, Partial<ChannelDto>>({
      query: (data) => ({
        url: `/api/Channel/${data.id}`,
        method: "PATCH",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),

    deleteChannel: builder.mutation<GetChannelResponse, number>({
      query: (channelId) => ({
        url: `/api/Channel/${channelId}`,
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),
  }),
});

export const {
  useGetChannelsQuery,
  useGetChannelByIdQuery,
  useGetChannelMembersCountQuery,
  useGetChannelMembersQuery,
  useGetChannelNotMembersQuery,
  useAddMembersInChannelMutation,
  useModifyChannelMutation,
  useDeleteChannelMutation,
} = ChannelsApi;
