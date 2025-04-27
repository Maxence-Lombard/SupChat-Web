import { api } from "../api";
import {visibility} from "../../Models/Visibility.ts";

export type ChannelDto = {
  id: number;
  name: string,
  visibility: visibility,
  workspaceId: number
};

export type GetChannelResponse = {
  id: number,
  name: string,
  image: string,
  visibility: visibility,
  visibilityLocalized: string,
  ownerId: number
};

export const ChannelsApi = api.injectEndpoints({
  endpoints: (builder) => ({

    getChannels: builder.query<GetChannelResponse[], undefined>({
      query: () => ({
        url: `/api/Channel`,
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }),
    }),

    getChannelById: builder.query<GetChannelResponse, number>({
      query: (Id) => ({
        url: `/api/Channel/${Id}`,
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }),
    }),

    createChannel: builder.mutation<GetChannelResponse, ChannelDto>({
      query: (data) => ({
        url: `/api/Channel`,
        method: 'POST',
        body: JSON.stringify({data}),
        headers: {
          'Content-Type': 'application/json',
        },
      }),
      // invalidatesTags: ['Auth'],
    }),

    modifyChannel: builder.mutation<GetChannelResponse, ChannelDto>({
      query: (data) => ({
        url: `/api/Channel/${data.id}`,
        method: 'PUT',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
        },
      }),
      // invalidatesTags: ['Auth'],
    }),

    deleteChannel: builder.mutation<GetChannelResponse, ChannelDto>({
      query: (data) => ({
        url: `/api/Channel/${data.id}`,
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      }),
      // invalidatesTags: ['Auth'],
    }),
  }),
});

export const {
  useGetChannelsQuery,
  useGetChannelByIdQuery,
  useCreateChannelMutation,
} = ChannelsApi;
