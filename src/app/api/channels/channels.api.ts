import { api } from "../api";
import { visibility } from "../../Models/Enums.ts"; //DTO

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
  useModifyChannelMutation,
  useDeleteChannelMutation,
} = ChannelsApi;
