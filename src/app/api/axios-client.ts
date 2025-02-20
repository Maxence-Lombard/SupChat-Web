import axios from 'axios';

const axiosClient = axios.create({
    baseURL: "http://localhost:5263",
    timeout: 2000,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
        // 'Authorization': 'Bearer YOUR_TOKEN_HERE'
    }
});

export default axiosClient;
