import { api } from "../api.ts";

//DTO
export type BotDto = {
  id: number;
  clientId: string;
  clientSecret: string;
  userId: number;
  userUsername: string;
  ownerId: number;
  ownerUsername: string;
};

export const BotApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getBotById: builder.query<BotDto, number>({
      query: (botId) => ({
        url: `/api/Bot/${botId}`,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),

    getOwnedBots: builder.query<BotDto, void>({
      query: () => ({
        url: `/api/Bot/GetOwnedBots`,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),

    createBot: builder.mutation<BotDto, string>({
      query: (botUsername) => ({
        url: `/api/Bot/`,
        method: "POST",
        body: JSON.stringify({ username: botUsername }),
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),

    deleteFile: builder.mutation<boolean, number>({
      query: (botId) => {
        return {
          url: `/api/Bot/${botId}`,
          method: "DELETE",
        };
      },
    }),
  }),
});

export const {
  useGetBotByIdQuery,
  useGetOwnedBotsQuery,
  useCreateBotMutation,
  useDeleteFileMutation,
} = BotApi;
