import api from '../api/api';

export const loginUser = (phone_number, password, captcha) => {
    return async dispatch => {
        dispatch({ type: 'LOGIN_START' });
        try {
            const response = await api.post('/user/auth/login', { phone_number, password, captcha });
            dispatch({ type: 'LOGIN_SUCCESS', payload: response.data });
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

export const deleteUserPicture = (picture_id) => {
    console.log("Delete Picture " + picture_id);
    return async (dispatch) => {
        console.log("Dispatching delete")
        dispatch({ type: 'DELETE_USER_PICTURE_START', payload: picture_id });
        try {
            const response = await api.delete(`/user/pictures/${picture_id}/`);
            dispatch({ type: 'DELETE_USER_PICTURE_SUCCESS', payload: picture_id });
        } catch (error) {
            dispatch({
                type: 'DELETE_USER_PICTURE_ERROR', payload: error.response.data,
            });
        } finally {
            dispatch({ type: 'DELETE_USER_PICTURE_END', payload: picture_id });
        }
    };
};

export const updateUserPicturesOrder = (orderedPictureIds) => {
    return async (dispatch) => {
        dispatch({ type: 'UPDATE_USER_PICTURES_ORDER_START' });

        try {
            // Construct the payload for the API request
            const payload = {
                selected_pictures: orderedPictureIds
            };

            // Send the updated order to the backend
            const response = await api.put('/user/select-pictures/', payload);

            // Dispatch success action with the updated pictures
            dispatch({
                type: 'UPDATE_USER_PICTURES_ORDER_SUCCESS',
                payload: response.data // Assuming the response contains the updated pictures
            });

            // Optionally, you might want to refresh the user profile or pictures
            dispatch(fetchUserInfo());
            // dispatch(fetchUserPictures());

        } catch (error) {
            dispatch({
                type: 'UPDATE_USER_PICTURES_ORDER_ERROR',
                payload: error.response ? error.response.data : 'Network error'
            });
        } finally {
            // Dispatch end action whether success or error
            dispatch({ type: 'UPDATE_USER_PICTURES_ORDER_END' });
        }
    };
};