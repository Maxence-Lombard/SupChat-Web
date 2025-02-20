import axiosClient from "./axios-client.ts";

export const login = async () => {
    try {
        const response = await axiosClient.post('/connect/token', {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: {
                username: 'bcrepin@supinfo.com',
                password: 'Soleil123!',
                grant_type: 'password',
            }
        });
        return {
            data: response.data,
            status: response.status,
            statusText: response.statusText
        };
    } catch (error) {
        console.log('Error', error);
    }};