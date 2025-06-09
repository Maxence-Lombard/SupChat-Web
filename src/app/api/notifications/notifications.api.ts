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
    }),
    getNotificationById: builder.query<Notification[], number>({
      query: (notificationId) => ({
        url: `/api/Notification/${notificationId}`,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),
    getNotificationByUser: builder.query<Notification[], number>({
      query: (userId) => ({
        url: `/api/Notification/User/${userId}`,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),

    // PATCH
    readByNotificationId: builder.query<boolean, number>({
      query: (notificationId) => ({
        url: `/api/Notification/${notificationId}/Read`,
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),

    readAllNotification: builder.query<boolean, number[]>({
      query: (notificationsId) => ({
        url: `/api/Notification/ReadAll`,
        method: "PATCH",
        body: JSON.stringify({ notificationList: notificationsId }),
        headers: {
          "Content-Type": "application/json",
        },
      }),
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
    }),
  }),
});

export const {
  useGetNotificationsQuery,
  useGetNotificationByIdQuery,
  useGetNotificationByUserQuery,
  useReadByNotificationIdQuery,
  useReadAllNotificationQuery,
  useDeleteNotificationMutation,
} = NotificationsApi;
