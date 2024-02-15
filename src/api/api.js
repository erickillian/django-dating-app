import axios from 'axios';
import store from '../store/store';

const api = axios.create({
    baseURL: 'http://localhost/',
});

api.interceptors.request.use((config) => {
    const state = store.getState();
    const token = state.user.token;

    if (token) {
        config.headers.Authorization = `Token ${token}`;
    }

    return config;
}, (error) => {
    return Promise.reject(error);
});

export default api; 