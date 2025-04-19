import { api } from "../api";

export type LoginDto = {
  email: string;
  password: string;
  grant_type: 'password';
};

export type LoginResponse = {
  accessToken: string;
  expires_at: number;
  token_type: 'Bearer';
  refreshToken: string;
  refreshExpiresAt: Date
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
        url: `/login`,
        method: 'POST',
        body: new URLSearchParams({
          email: data.email,
          password: data.password
        }).toString(),
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }),
      // invalidatesTags: ['Auth'],
    }),
    register: builder.mutation<RegisterResponse, RegisterDto>({
      query: (data: RegisterDto) => ({
        url: `/connect/register`,
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
        },
      }),
      // invalidatesTags: ['Auth'],
    }),
  }),
});

export const { useLoginMutation, useRegisterMutation } = AuthApi;
