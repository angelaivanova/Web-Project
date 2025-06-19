import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://localhost:8081/api',
});

instance.interceptors.request.use(config => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user?.access_token) {
        config.headers.Authorization = `Bearer ${user.access_token}`;
    }
    return config;
});

export default instance;
