import { api } from "../api";
import { types } from "../../Models/Enums.ts";

export interface Notification {
  id: number;
  content: string;
  type: types;
  isActive: boolean;
  messageId: number;
  userId: number;
  senderId: number;
  typeLocalized: string;
}

export const NotificationsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // GET
    getNotifications: builder.query<Notification[], undefined>({
      query: () => ({
        url: `/api/Notification`,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }),
      providesTags: ["Notifications"],
    }),
    getNotificationById: builder.query<Notification[], number>({
      query: (notificationId) => ({
        url: `/api/Notification/${notificationId}`,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }),
      providesTags: ["Notifications"],
    }),
    getNotificationByUser: builder.query<Notification[], number>({
      query: (userId) => ({
        url: `/api/Notification/User/${userId}`,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }),
      providesTags: ["Notifications"],
    }),

    // PATCH
    readByNotificationId: builder.mutation<boolean, number>({
      query: (notificationId) => ({
        url: `/api/Notification/${notificationId}/Read`,
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: ["Notifications"],
    }),

    readAllNotification: builder.mutation<boolean, number[]>({
      query: (notificationsId) => ({
        url: `/api/Notification/ReadAll`,
        method: "PATCH",
        body: JSON.stringify({ notificationList: notificationsId }),
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: ["Notifications"],
    }),

    // DELETE
    deleteNotification: builder.mutation<Notification, number>({
      query: (notificationId) => ({
        url: `/api/Notification/${notificationId}`,
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: ["Notifications"],
    }),
  }),
});

export const {
  useGetNotificationsQuery,
  useGetNotificationByIdQuery,
  useGetNotificationByUserQuery,
  useReadByNotificationIdMutation,
  useReadAllNotificationMutation,
  useDeleteNotificationMutation,
} = NotificationsApi;
