import { api } from "../api";
import { ApplicationUser, User } from "../../Models/User.ts";

export const MessagesApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getAllUsersInfos: builder.query<
      ApplicationUser[],
      { pageNumber?: number; pageSize?: number }
    >({
      query: (pagination) => ({
        url: `/api/User?pageNumber=${pagination.pageNumber || 1}&pageSize=${pagination.pageSize || 10}`,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),

    getUserInfos: builder.query<User, undefined>({
      query: () => ({
        url: "/api/Account/Me",
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),

    getUserInfosById: builder.mutation<ApplicationUser, number>({
      query: (userId) => ({
        url: `/api/User/${userId}`,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: (_result, _error, arg) => [
        {
          type: "Users",
          id: arg,
        },
      ],
    }),

    getUserWithMessages: builder.query<ApplicationUser[], undefined>({
      query: () => ({
        url: "/api/User/Mp",
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),

    getExportUserData: builder.query<Blob, void>({
      query: () => ({
        url: "/api/User/Export",
        method: "GET",
      }),
    }),

    // PATCH
    updateUserInfos: builder.mutation<
      ApplicationUser,
      Partial<ApplicationUser>
    >({
      query: (data) => ({
        url: `/api/User/${data.id}`,
        method: "PATCH",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: (result, _error, arg) =>
        result?.id ? [{ type: "Users", id: arg.id }] : [],
    }),

    updateUserProfilePicture: builder.mutation<
      ApplicationUser,
      { userId: number; attachmentUuid: string }
    >({
      query: (data) => ({
        url: `/api/User/${data.userId}/ProfilePicture`,
        method: "PATCH",
        body: {
          attachmentId: data.attachmentUuid,
        },
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),

    updateUserPassword: builder.mutation<
      ApplicationUser,
      {
        userId: number;
        currentPassword: string;
        newPassword: string;
        confirmNewPassword: string;
      }
    >({
      query: (data) => {
        const { userId, ...body } = data;
        return {
          url: `/api/User/${userId}/Password`,
          method: "PATCH",
          body: JSON.stringify(body),
          headers: {
            "Content-Type": "application/json",
          },
        };
      },
    }),
  }),
});

export const {
  useGetAllUsersInfosQuery,
  useGetUserInfosQuery,
  useGetUserInfosByIdMutation,
  useGetUserWithMessagesQuery,
  useGetExportUserDataQuery,
  useUpdateUserInfosMutation,
  useUpdateUserProfilePictureMutation,
  useUpdateUserPasswordMutation,
} = MessagesApi;
