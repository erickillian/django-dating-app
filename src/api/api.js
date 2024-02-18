import axios from 'axios';
import store from '../store/store';

const api = axios.create({
    baseURL: 'http://localhost/',
});

let errorCounter = 0;
const ERROR_THRESHOLD = 3;

const onMultipleErrors = () => {
    // Dispatch the logoutUser action
    store.dispatch({ type: 'LOGOUT_SUCCESS' });
};

api.interceptors.response.use(
    response => {
        errorCounter = 0;
        return response;
    },
    error => {
        errorCounter++;
        if (errorCounter >= ERROR_THRESHOLD) {
            onMultipleErrors();
            errorCounter = 0;
        }
        return Promise.reject(error);
    }
);

api.interceptors.request.use(
    config => {
        const state = store.getState();
        const token = state.user.token;

        if (token) {
            config.headers.Authorization = `Token ${token}`;
        }

        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

export default api;
