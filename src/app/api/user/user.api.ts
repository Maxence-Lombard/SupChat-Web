import { api } from "../api";
import { visibility } from "../../Models/Enums.ts";
import { ApplicationUser, User } from "../../Models/User.ts";

export type UserMpDto = {
  id: number;
  name: string;
  visibility: visibility;
  workspaceId: number;
};

export const MessagesApi = api.injectEndpoints({
  endpoints: (builder) => ({
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
  }),
});

export const {
  useGetUserInfosQuery,
  useGetUserInfosByIdMutation,
  useGetUserWithMessagesQuery,
  useUpdateUserInfosMutation,
  useUpdateUserProfilePictureMutation,
} = MessagesApi;
