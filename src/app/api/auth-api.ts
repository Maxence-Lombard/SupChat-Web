import axiosClient from "./axios-client.ts";

export const login = async (username: string, password: string) => {
    try {
        const response = await axiosClient.post('/connect/token',
            {
                username: username,
                password: password,
                grant_type: 'password',
            },
            {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            });
        setTimeout(
            () => {
                console.log('Login successful:', response);
            },
            2000
        );
        return {
            data: response.data,
            status: response.status,
            statusText: response.statusText
        };
    } catch (error) {
        console.log('Error', error);
    }};