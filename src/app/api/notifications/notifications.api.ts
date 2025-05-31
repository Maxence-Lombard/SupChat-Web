import { api } from "../api";
import { types } from "../../Models/Enums.ts";

interface Notification {
  id: number;
  content: string;
  type: types;
  isActive: boolean;
  messageId: number;
  userId: number;
}

export const NotificationsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // GET
    getNotifications: builder.query<Notification, undefined>({
      query: () => ({
        url: `/api/Notification`,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),
    getNotificationById: builder.query<Notification, number>({
      query: (notificationId) => ({
        url: `/api/Notification/${notificationId}`,
        method: "GET",
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
  useDeleteNotificationMutation,
} = NotificationsApi;
