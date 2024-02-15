import api from '../api/api';

export const loginUser = (phone_number, password, captcha) => {
    return async dispatch => {
        dispatch({ type: 'LOGIN_START' });
        try {
            const response = await api.post('/user/auth/login', { phone_number, password, captcha });
            dispatch({ type: 'LOGIN_SUCCESS', payload: response.data.token });
        } catch (error) {
            dispatch({ type: 'LOGIN_ERROR', payload: error.response.data });
        } finally {
            dispatch({ type: 'LOGIN_END' });
        }
    };
};

export const logoutUser = () => {
    return async dispatch => {
        dispatch({ type: 'LOGOUT_START' });
        try {
            await api.post('/user/auth/logout');
            localStorage.removeItem('token');
            dispatch({ type: 'LOGOUT_SUCCESS' });
        } catch (error) {
            dispatch({ type: 'LOGOUT_ERROR', payload: error });
        } finally {
            dispatch({ type: 'LOGOUT_END' });
        }
    };
};

export const checkUserAuthentication = () => {
    return dispatch => {
        const token = localStorage.getItem('token');
        if (token) {
            dispatch({ type: 'USER_AUTHENTICATED', payload: { token } });
        } else {
            dispatch({ type: 'USER_NOT_AUTHENTICATED' });
        }
    };
};