import { api } from "../api";

export type LoginDto = {
  username: string;
  password: string;
  grant_type: 'password';
};

export type LoginResponse = {
  access_token: string;
  expires_in: number;
  token_type: 'Bearer';
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
        url: `/connect/token`,
        method: 'POST',
        body: new URLSearchParams({
          username: data.username,
          password: data.password,
          grant_type: data.grant_type,
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
