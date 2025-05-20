import { api } from "../api";

export type LoginDto = {
  email: string;
  password: string;
  grant_type: "password";
};

export type ConfirmEmailDto = {
  code: string;
  userId: string;
};

export type LoginResponse = {
  accessToken: string;
  expires_at: number;
  token_type: "Bearer";
  refreshToken: string;
  refreshExpiresAt: Date;
};

export type RegisterDto = {
  userName: string;
  email: string;
  password: string;
};

export type RegisterResponse = {
  access_token: string;
  expires_in: number;
};

export const AuthApi = api.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginDto>({
      query: (data: LoginDto) => ({
        url: `/api/Authorization/login`,
        method: "POST",
        body: new URLSearchParams({
          email: data.email,
          password: data.password,
        }).toString(),
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }),
      // invalidatesTags: ['Auth'],
    }),
    register: builder.mutation<RegisterResponse, RegisterDto>({
      query: (data: RegisterDto) => ({
        url: `/api/Account/register`,
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      }),
      // invalidatesTags: ['Auth'],
    }),
    confirmEmail: builder.mutation<LoginResponse, ConfirmEmailDto>({
      query: (data: ConfirmEmailDto) => ({
        url: `/api/Account/${data.userId}/confirmEmail`,
        method: "PATCH",
        body: {
          code: data.code,
        },
      }),
      // invalidatesTags: ['Auth'],
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useConfirmEmailMutation,
} = AuthApi;
