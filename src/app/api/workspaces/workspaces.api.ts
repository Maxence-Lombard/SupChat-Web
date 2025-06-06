import { roles, visibility } from "../../Models/Enums.ts";
import { api } from "../api";
import {
  CreateChannelDto,
  GetChannelResponse,
} from "../channels/channels.api.ts";

//DTO
export type WorkspaceDto = {
  id: number;
  name: string;
  description: string;
  visibility: visibility;
  profilePictureId: string;
};

export type CreateWorkspaceDto = {
  name: string;
  visibility: visibility;
  profilePictureId?: string;
};

export type addMemberDto = {
  workspaceId: number;
  userId: number;
};

type RoleDto = {
  id: number;
  name: string;
  hierarchy: number;
  permissionsIds: roles[];
};

//Response
export type GetWorkspaceResponse = {
  id: number;
  name: string;
  image: string;
  visibility: visibility;
  visibilityLocalized: string;
  ownerId: number;
  profilePictureId: string;
  description: string;
};

export const WorkspaceApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // GET
    getWorkspaces: builder.query<GetWorkspaceResponse[], undefined>({
      query: () => ({
        url: `/api/Workspace`,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),

    getWorkspacesJoined: builder.query<GetWorkspaceResponse[], undefined>({
      query: () => ({
        url: `/api/Workspace/Joined`,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),

    getWorkspaceById: builder.query<GetWorkspaceResponse, number>({
      query: (Id) => ({
        url: `/api/Workspace/${Id}`,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }),
      providesTags: (_result, _error, arg) => [
        {
          type: "Workspaces",
          id: arg,
        },
      ],
    }),

    getWorkspacesAvailable: builder.query<GetWorkspaceResponse[], undefined>({
      query: () => ({
        url: `/api/Workspace/Available`,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),

    getFirstChannel: builder.mutation<GetChannelResponse, number>({
      query: (Id) => ({
        url: `/api/Workspace/${Id}/Channels/First`,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),

    getChannelsByWorkspaceId: builder.query<GetChannelResponse[], number>({
      query: (Id) => ({
        url: `/api/Workspace/${Id}/Channels`,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),

    getWorkspaceRoles: builder.query<RoleDto[], number>({
      query: (Id) => ({
        url: `/api/Workspace/${Id}/Roles`,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),

    getWorkspaceRoleMembersCount: builder.query<
      RoleDto[],
      { workspaceId: number; roleId: number }
    >({
      query: (data) => ({
        url: `/api/Workspace/${data.workspaceId}/Roles/${data.roleId}`,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),

    getWorkspaceRoleNonMembers: builder.query<
      RoleDto[],
      { workspaceId: number; roleId: number }
    >({
      query: (data) => ({
        url: `/api/Workspace/${data.workspaceId}/Roles/${data.roleId}`,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),

    // POST
    createWorkspace: builder.mutation<GetWorkspaceResponse, CreateWorkspaceDto>(
      {
        query: (workspace) => ({
          url: `/api/Workspace`,
          method: "POST",
          body: JSON.stringify(workspace),
          headers: {
            "Content-Type": "application/json",
          },
        }),
      },
    ),

    createChannelInWorkspace: builder.mutation<
      GetChannelResponse,
      CreateChannelDto
    >({
      query: (channel) => ({
        url: `/api/Workspace/${channel.workspaceId}/Channels`,
        method: "POST",
        body: JSON.stringify(channel),
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),

    joinWorkspace: builder.mutation<GetWorkspaceResponse, number>({
      query: (workspaceId: number) => ({
        url: `/api/Workspace/${workspaceId}/Join`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),

    addMemberInWorkspace: builder.mutation<GetWorkspaceResponse, addMemberDto>({
      query: (member) => ({
        url: `/api/Workspace/AddMember`,
        method: "POST",
        body: JSON.stringify(member),
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),

    createWorkspaceRole: builder.mutation<
      RoleDto,
      { workspaceId: number; newRole: Omit<WorkspaceDto, "id"> }
    >({
      query: (data) => ({
        url: `/api/Workspace/${data.workspaceId}/Roles`,
        method: "GET",
        body: JSON.stringify(data.newRole),
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),

    // PATCH
    modifyWorkspace: builder.mutation<WorkspaceDto, Partial<WorkspaceDto>>({
      query: (data) => ({
        url: `/api/Workspace/${data.id}`,
        method: "PATCH",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: (result, _error, arg) =>
        result?.id ? [{ type: "Workspaces", id: arg.id }] : [],
    }),

    modifyWorkspaceProfilePicture: builder.mutation<
      GetWorkspaceResponse,
      {
        workspaceId: number;
        attachmentUuid: string;
      }
    >({
      query: (data) => ({
        url: `/api/Workspace/${data.workspaceId}/ProfilePicture`,
        method: "PATCH",
        body: {
          attachmentId: data.attachmentUuid,
        },
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),

    // DELETE
    leaveWorkspace: builder.mutation<GetWorkspaceResponse, WorkspaceDto>({
      query: (data) => ({
        url: `/api/Workspace/${data.id}/Leave`,
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),

    deleteWorkspace: builder.mutation<undefined, number>({
      query: (workspaceId) => ({
        url: `/api/Workspace/${workspaceId}`,
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),

    deleteWorkspaceRole: builder.mutation<
      RoleDto,
      { workspaceId: number; roleId: number }
    >({
      query: (data) => ({
        url: `/api/Workspace/${data.workspaceId}/Roles/${data.roleId}`,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),
  }),
});

export const {
  // GET
  useGetWorkspacesQuery,
  useGetWorkspacesJoinedQuery,
  useGetWorkspaceByIdQuery,
  useGetWorkspacesAvailableQuery,
  useGetFirstChannelMutation,
  useGetChannelsByWorkspaceIdQuery,
  useGetWorkspaceRolesQuery,
  useGetWorkspaceRoleMembersCountQuery,
  useGetWorkspaceRoleNonMembersQuery,
  // POST
  useCreateWorkspaceMutation,
  useCreateChannelInWorkspaceMutation,
  useAddMemberInWorkspaceMutation,
  useJoinWorkspaceMutation,
  useCreateWorkspaceRoleMutation,
  // PATCH
  useModifyWorkspaceMutation,
  useModifyWorkspaceProfilePictureMutation,
  // DELETE
  useLeaveWorkspaceMutation,
  useDeleteWorkspaceMutation,
  useDeleteWorkspaceRoleMutation,
} = WorkspaceApi;
