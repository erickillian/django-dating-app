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

export const fetchUserInfo = () => {
    return async dispatch => {
        dispatch({ type: 'FETCH_USER_PROFILE_START' });
        try {
            const response = await api.get('/user/profile');
            dispatch({ type: 'FETCH_USER_PROFILE_SUCCESS', payload: response.data });
        } catch (error) {
            dispatch({ type: 'FETCH_USER_PROFILE_ERROR', payload: error.response.data });
        }
    };
};

export const updateUserInfo = (updatedData) => {
    return async dispatch => {
        dispatch({ type: 'UPDATE_USER_PROFILE_START' });
        try {
            const response = await api.put('/user/profile', updatedData);
            dispatch({ type: 'UPDATE_USER_PROFILE_SUCCESS', payload: response.data });
        } catch (error) {
            dispatch({ type: 'UPDATE_USER_PROFILE_ERROR', payload: error.response.data });
        }
    };
};

export const fetchUserPictures = () => {
    return async dispatch => {
        dispatch({ type: 'FETCH_USER_PICTURES_START' });
        try {
            const response = await api.get('/user/pictures/');
            dispatch({ type: 'FETCH_USER_PICTURES_SUCCESS', payload: response.data });
        } catch (error) {
            dispatch({ type: 'FETCH_USER_PICTURES_ERROR', payload: error.response.data });
        }
    };
};

export const uploadUserPicture = (imageFile) => {
    return async (dispatch) => {
        dispatch({ type: 'UPLOAD_USER_PICTURE_START' });

        const formData = new FormData();
        formData.append('image', imageFile);

        try {
            const response = await api.post('/user/upload-picture/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                onUploadProgress: progressEvent => {
                    const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    console.log(percentCompleted)
                    dispatch({ type: 'UPLOAD_PROGRESS', payload: percentCompleted });
                }
            });

            dispatch({ type: 'UPLOAD_USER_PICTURE_SUCCESS', payload: response.data });
        } catch (error) {
            dispatch({ type: 'UPLOAD_USER_PICTURE_ERROR', payload: error.response.data });
        } finally {
            dispatch({ type: 'UPLOAD_USER_PICTURE_END' });
        }
    };
};
