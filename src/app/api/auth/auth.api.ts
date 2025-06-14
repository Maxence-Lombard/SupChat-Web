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
    }),
    refreshToken: builder.mutation<LoginResponse, string>({
      query: (refreshToken) => ({
        url: `/api/Authorization/login/refreshtoken?refreshToken=${refreshToken}`,
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }),
    }),
    register: builder.mutation<void, RegisterDto>({
      query: (data: RegisterDto) => ({
        url: `/api/Account/register`,
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      }),
      transformResponse: (_response: void, meta?: { response?: Response }) => {
        if (meta?.response?.status === 201) return;
        return;
      },
    }),
    confirmEmail: builder.mutation<LoginResponse, ConfirmEmailDto>({
      query: (data: ConfirmEmailDto) => ({
        url: `/api/Account/${data.userId}/confirmEmail`,
        method: "PATCH",
        body: {
          code: data.code,
        },
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useConfirmEmailMutation,
  useRefreshTokenMutation,
} = AuthApi;
