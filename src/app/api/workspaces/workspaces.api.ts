import { api } from "../api";

export type WorkspaceDto = {
  id: string;
  username: string;
  password: string;
  grant_type: 'password';
};

export type WorkspaceResponse = {
  access_token: string;
  expires_in: number;
  token_type: 'Bearer';
};

export const AuthApi = api.injectEndpoints({
  endpoints: (builder) => ({

    getWorkspaces: builder.query<WorkspaceResponse, WorkspaceDto>({
      query: () => ({
        url: `/Workspace`,
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }),
    }),

    getWorkspaceById: builder.query<WorkspaceResponse, WorkspaceDto>({
      query: (data) => ({
        url: `/Workspace/${data.id}`,
        method: 'GET',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
        },
      }),
    }),

    createWorkspace: builder.mutation<WorkspaceResponse, WorkspaceDto>({
      query: () => ({
        url: `/Workspace`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      }),
      // invalidatesTags: ['Auth'],
    }),

    modifyWorkspace: builder.mutation<WorkspaceResponse, WorkspaceDto>({
      query: (data) => ({
        url: `/Workspace/${data.id}`,
        method: 'PUT',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
        },
      }),
      // invalidatesTags: ['Auth'],
    }),

    deleteWorkspace: builder.mutation<WorkspaceResponse, WorkspaceDto>({
      query: (data) => ({
        url: `/Workspace/${data.id}`,
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
