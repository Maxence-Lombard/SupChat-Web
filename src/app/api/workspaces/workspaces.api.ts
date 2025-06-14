import { visibility } from "../../Models/Enums.ts";
import { api } from "../api";
import {
  CreateChannelDto,
  GetChannelResponse,
} from "../channels/channels.api.ts";
import { ApplicationUser } from "../../Models/User.ts";
import { Message } from "../messages/messages.api.ts";
import { AttachmentDto } from "../attachments/attachments.api.ts"; //DTO

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

export type RoleDto = {
  id: number;
  name: string;
  hierarchy: number;
  workspaceId: number;
};

export type createRoleDto = {
  name: string;
  hierarchy: number;
  permissionsIds: number[];
};

export type rolePermissionsDto = {
  id: number;
  workspaceId: number;
  permissionId: number[];
};

//Response
export type GetWorkspaceResponse = {
  id: number;
  name: string;
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

    getWorkspaceMembersCount: builder.query<number, number>({
      query: (workspaceId) => ({
        url: `/api/Workspace/${workspaceId}/MembersCount`,
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
      providesTags: (result, _error, arg) =>
        result ? [{ type: "Roles", id: arg }] : [],
    }),

    getWorkspaceRolesPermissions: builder.query<
      rolePermissionsDto[],
      { workspaceId: number; roleId: number }
    >({
      query: (data) => ({
        url: `/api/Workspace/${data.workspaceId}/Roles/${data.roleId}/Permissions`,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),

    getWorkspaceRoleMembers: builder.query<
      ApplicationUser[],
      {
        workspaceId: number;
        roleId: number;
      }
    >({
      query: (data) => ({
        url: `/api/Workspace/${data.workspaceId}/Roles/${data.roleId}/Members`,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }),
      providesTags: (_result, _error, arg) => [
        {
          type: "WorkspaceRoleMembers",
          workspaceId: arg.workspaceId,
          roleId: arg.roleId,
        },
      ],
    }),

    getWorkspaceRoleMembersCount: builder.query<
      number,
      { workspaceId: number; roleId: number }
    >({
      query: (data) => ({
        url: `/api/Workspace/${data.workspaceId}/Roles/${data.roleId}/MembersCount`,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }),
      providesTags: (_result, _error, arg) => [
        {
          type: "WorkspaceRoleMembersCount",
          workspaceId: arg.workspaceId,
          roleId: arg.roleId,
        },
      ],
    }),

    getWorkspaceRoleNonMembers: builder.query<
      ApplicationUser[],
      { workspaceId: number; roleId: number }
    >({
      query: (data) => ({
        url: `/api/Workspace/${data.workspaceId}/Roles/${data.roleId}/NonMembers`,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }),
      providesTags: (_result, _error, arg) => [
        {
          type: "WorkspaceRoleMembers",
          workspaceId: arg.workspaceId,
          roleId: arg.roleId,
        },
      ],
    }),

    getWorkspaceUnifiedSearch: builder.query<
      {
        channelList: GetChannelResponse[];
        userList: ApplicationUser[];
        messageList: Message[];
        attachmentList: AttachmentDto[];
      },
      { workspaceId: number; q: string; pageNumber?: number; pageSize?: number }
    >({
      query: (data) => ({
        url: `/api/Workspace/${data.workspaceId}/UnifiedSearch?search=${data.q}&pageNumber=${data.pageNumber || 1}&pageSize=${data.pageSize || 10}`,
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
      invalidatesTags: ["ChannelMembers", "ChannelMembersCount"],
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
      { workspaceId: number; newRole: createRoleDto }
    >({
      query: (data) => ({
        url: `/api/Workspace/${data.workspaceId}/Roles`,
        method: "POST",
        body: JSON.stringify(data.newRole),
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),

    assignWorkspaceRoleGroup: builder.mutation<
      boolean,
      {
        workspaceId: number;
        roleId: number;
        usersId: number[];
      }
    >({
      query: (data) => ({
        url: `/api/Workspace/${data.workspaceId}/Roles/${data.roleId}/Members`,
        method: "POST",
        body: JSON.stringify({ members: data.usersId }),
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: (_result, _error, arg) => [
        {
          type: "WorkspaceRoleMembers",
          workspaceId: arg.workspaceId,
          roleId: arg.roleId,
        },
        {
          type: "WorkspaceRoleMembersCount",
          workspaceId: arg.workspaceId,
          roleId: arg.roleId,
        },
      ],
    }),

    // INVITATIONS
    createWorkspaceInvitation: builder.mutation<string, number>({
      query: (workspaceId) => ({
        url: `/api/Workspace/${workspaceId}/invitations/generate`,
        method: "POST",
        headers: {
          "Content-Type": "text/plain",
        },
      }),
    }),

    sendWorkspaceInvitationByEmail: builder.mutation<
      WorkspaceDto,
      { workspaceId: number; userId: number }
    >({
      query: (data) => ({
        url: `/api/Workspace/${data.workspaceId}/invitations/generate/${data.userId}/email`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),

    acceptWorkspaceInvitation: builder.mutation<
      GetWorkspaceResponse,
      { workspaceId: number; token: string }
    >({
      query: (data) => ({
        url: `/api/Workspace/${data.workspaceId}/invitations/accept?token=${data.token}`,
        method: "POST",
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

    modifyWorkspaceRole: builder.mutation<
      RoleDto,
      { workspaceId: number; roleId: number; modifiedRole: createRoleDto }
    >({
      query: (data) => ({
        url: `/api/Workspace/${data.workspaceId}/Roles/${data.roleId}`,
        method: "PATCH",
        body: JSON.stringify(data.modifiedRole),
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),

    // DELETE
    leaveWorkspace: builder.mutation<boolean, number>({
      query: (workspaceId) => ({
        url: `/api/Workspace/${workspaceId}/Leave`,
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),

    deleteWorkspace: builder.mutation<boolean, number>({
      query: (workspaceId) => ({
        url: `/api/Workspace/${workspaceId}`,
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),

    unassignWorkspaceRole: builder.mutation<
      ApplicationUser[],
      {
        workspaceId: number;
        roleId: number;
        userId: number;
      }
    >({
      query: (data) => ({
        url: `/api/Workspace/${data.workspaceId}/Roles/${data.roleId}/Members/${data.userId}`,
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: (_result, _error, arg) => [
        {
          type: "WorkspaceRoleMembers",
          workspaceId: arg.workspaceId,
          roleId: arg.roleId,
        },
        {
          type: "WorkspaceRoleMembersCount",
          workspaceId: arg.workspaceId,
          roleId: arg.roleId,
        },
      ],
    }),

    deleteWorkspaceRole: builder.mutation<
      RoleDto,
      { workspaceId: number; roleId: number }
    >({
      query: (data) => ({
        url: `/api/Workspace/${data.workspaceId}/Roles/${data.roleId}`,
        method: "DELETE",
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
  useGetWorkspaceMembersCountQuery,
  useGetWorkspaceRolesQuery,
  useGetWorkspaceRolesPermissionsQuery,
  useGetWorkspaceRoleMembersQuery,
  useGetWorkspaceRoleMembersCountQuery,
  useGetWorkspaceRoleNonMembersQuery,
  useGetWorkspaceUnifiedSearchQuery,
  // POST
  useCreateWorkspaceMutation,
  useCreateChannelInWorkspaceMutation,
  useAddMemberInWorkspaceMutation,
  useJoinWorkspaceMutation,
  useCreateWorkspaceRoleMutation,
  useAssignWorkspaceRoleGroupMutation,
  useCreateWorkspaceInvitationMutation,
  useSendWorkspaceInvitationByEmailMutation,
  useAcceptWorkspaceInvitationMutation,
  // PATCH
  useModifyWorkspaceMutation,
  useModifyWorkspaceProfilePictureMutation,
  useModifyWorkspaceRoleMutation,
  // DELETE
  useLeaveWorkspaceMutation,
  useDeleteWorkspaceMutation,
  useUnassignWorkspaceRoleMutation,
  useDeleteWorkspaceRoleMutation,
} = WorkspaceApi;
