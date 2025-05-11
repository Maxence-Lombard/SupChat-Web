import { api } from "../api";
import {visibility} from "../../Models/Enums.ts";
import {CreateChannelDto, GetChannelResponse} from "../channels/channels.api.ts";

export type WorkspaceDto = {
  id: number;
  name: string;
  image?: string;
  visibility: visibility;
};

export type CreateWorkspaceDto = {
  name: string;
  image?: string;
  visibility: visibility;
};

export type GetWorkspaceResponse = {
  id: number,
  name: string,
  image: string,
  visibility: visibility,
  visibilityLocalized: string,
  ownerId: number
};

export const WorkspaceApi = api.injectEndpoints({
  endpoints: (builder) => ({

    // GET
    getWorkspaces: builder.query<GetWorkspaceResponse[], undefined>({
      query: () => ({
        url: `/api/Workspace`,
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }),
    }),

    getWorkspaceById: builder.query<GetWorkspaceResponse, number>({
      query: (Id) => ({
        url: `/api/Workspace/${Id}`,
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }),
    }),

    getChannelsByWorkspaceId: builder.query<GetChannelResponse[], number>({
      query: (Id) => ({
        url: `/api/Workspace/${Id}/Channels`,
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }),
    }),

    // POST
    createWorkspace: builder.mutation<GetWorkspaceResponse, CreateWorkspaceDto>({
      query: (workspace) => ({
        url: `/api/Workspace`,
        method: 'POST',
        body: JSON.stringify(workspace),
        headers: {
          'Content-Type': 'application/json',
        },
      }),
    }),

    createChannelInWorkspace: builder.mutation<GetChannelResponse, CreateChannelDto>({
      query: (channel) => ({
        url: `/api/Workspace/${channel.workspaceId}/Channels`,
        method: 'POST',
        body: JSON.stringify(channel),
        headers: {
          'Content-Type': 'application/json',
        },
      }),
    }),

    modifyWorkspace: builder.mutation<GetWorkspaceResponse, WorkspaceDto>({
      query: (data) => ({
        url: `/api/Workspace/${data.id}`,
        method: 'PUT',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
        },
      }),
    }),

    deleteWorkspace: builder.mutation<GetWorkspaceResponse, WorkspaceDto>({
      query: (data) => ({
        url: `/api/Workspace/${data.id}`,
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      }),
    }),
  }),
});

export const {
  useGetWorkspacesQuery,
  useGetWorkspaceByIdQuery,
  useGetChannelsByWorkspaceIdQuery,
  useCreateWorkspaceMutation,
  useCreateChannelInWorkspaceMutation,
  useModifyWorkspaceMutation,
  useDeleteWorkspaceMutation,
} = WorkspaceApi;
