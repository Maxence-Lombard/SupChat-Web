import { api } from "../api";
import {visibility} from "../../Models/Workspace.ts";

export type WorkspaceDto = {
  id: number;
  username: string;
  password: string;
};

export type GetWorkspaceResponse = {
  id: number,
  name: string,
  image: string,
  visibility: visibility,
  visibilityLocalized: string,
  ownerId: number
};

export const AuthApi = api.injectEndpoints({
  endpoints: (builder) => ({

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

    createWorkspace: builder.mutation<GetWorkspaceResponse, WorkspaceDto>({
      query: () => ({
        url: `/api/Workspace`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      }),
      // invalidatesTags: ['Auth'],
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
      // invalidatesTags: ['Auth'],
    }),

    deleteWorkspace: builder.mutation<GetWorkspaceResponse, WorkspaceDto>({
      query: (data) => ({
        url: `/api/Workspace/${data.id}`,
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
  useGetWorkspacesQuery,
  useGetWorkspaceByIdQuery,
  useCreateWorkspaceMutation,
  useModifyWorkspaceMutation,
  useDeleteWorkspaceMutation,
} = AuthApi;
