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

export type Response<T> = {
  status: number;
  data: T;
}

export const AuthApi = api.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<Response<LoginResponse>, LoginDto>({
      query: (data: LoginDto) => ({
        url: `/login`,
        method: 'POST',
        body: new URLSearchParams({
          email: data.username,
          password: data.password
        }).toString(),
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }),
      invalidatesTags: ['Auth'],
    }),
  }),
});

export const { useLoginMutation } = AuthApi;
