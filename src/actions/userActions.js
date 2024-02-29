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

export const registerUser = (phone_number, password, captcha) => {
    return async dispatch => {
        dispatch({ type: 'REGISTER_START' });
        try {
            const response = await api.post('/user/auth/register', { phone_number, password, captcha });
            dispatch({ type: 'LOGIN_SUCCESS', payload: response.data });
        } catch (error) {
            dispatch({ type: 'REGISTER_ERROR', payload: error.response.data });
        } finally {
            dispatch({ type: 'REGISTER_END' });
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


export const searchInterests = (query) => {
    console.log("Searching", query)
    return async dispatch => {
        dispatch({ type: 'SEARCH_INTERESTS_START' });
        try {
            const response = await api.get(`user/interests/search/?query=${query}`);
            dispatch({ type: 'SEARCH_INTERESTS_SUCCESS', payload: response.data });
        } catch (error) {
            dispatch({ type: 'SEARCH_INTERESTS_ERROR', payload: error.response.data });
        }
    };
}


export const fetchPromptsCategories = () => {
    return async dispatch => {
        dispatch({ type: 'FETCH_PROMPTS_CATEGORIES_START' });
        try {
            // Assuming `api` is your configured Axios instance or similar HTTP client
            const response = await api.get('/user/prompts-categories/');
            dispatch({ type: 'FETCH_PROMPTS_CATEGORIES_SUCCESS', payload: response.data });
        } catch (error) {
            dispatch({ type: 'FETCH_PROMPTS_CATEGORIES_ERROR', payload: error.response ? error.response.data : "An error occurred" });
        } finally {
            // Dispatch end action whether success or error
            dispatch({ type: 'FETCH_PROMPTS_CATEGORIES_END' });
        }
    };
};



export const fetchPrompts = (category) => {
    console.log("Fetching prompts", category)
    return async dispatch => {
        dispatch({ type: 'FETCH_PROMPTS_START', payload: { category: category } });
        try {
            // Assuming `api` is your configured Axios instance or similar HTTP client
            const response = await api.get('/user/prompts-list/', { params: { category: category } });
            dispatch({ type: 'FETCH_PROMPTS_SUCCESS', payload: {category: category, response: response.data} });
        } catch (error) {
            dispatch({ type: 'FETCH_PROMPTS_ERROR', payload: error.response ? error.response.data : "An error occurred" });
        } finally {
            // Dispatch end action whether success or error
            dispatch({ type: 'FETCH_PROMPTS_END', payload: { category: category } });
        }
    };
};


export const createUserPromptResponse = (promptResponseData) => {
    return async dispatch => {
        dispatch({ type: 'CREATE_USER_PROMPT_RESPONSE_START' });
        try {
            const response = await api.post('user/prompts/', promptResponseData);
            dispatch({ type: 'CREATE_USER_PROMPT_RESPONSE_SUCCESS', payload: response.data });
        } catch (error) {
            dispatch({ type: 'CREATE_USER_PROMPT_RESPONSE_ERROR', payload: error.response ? error.response.data : "An error occurred" });
        } finally {
            dispatch({ type: 'CREATE_USER_PROMPT_RESPONSE_END' });
        }
    };
};

export const deleteUserPromptResponse = (prompt) => {
    console.log("PROMPT: ", prompt)
    return async dispatch => {
        dispatch({ type: 'DELETE_USER_PROMPT_RESPONSE_START' });
        try {
            await api.delete(`user/prompts/${prompt.id}/` );
            dispatch({ type: 'DELETE_USER_PROMPT_RESPONSE_SUCCESS', payload: prompt.id });
        } catch (error) {
            dispatch({ type: 'DELETE_USER_PROMPT_RESPONSE_ERROR', payload: error.response ? error.response.data : "An error occurred" });
        } finally {
            dispatch({ type: 'DELETE_USER_PROMPT_RESPONSE_END' });
        }
    };
};

export const editUserPromptResponse = (prompt) => {
    return async dispatch => {
        dispatch({ type: 'EDIT_USER_PROMPT_RESPONSE_START' });
        try {
            const response = await api.put(`user/prompts/${prompt.id}/`, prompt);
            dispatch({ type: 'EDIT_USER_PROMPT_RESPONSE_SUCCESS', payload: response.data });
        } catch (error) {
            dispatch({ type: 'EDIT_USER_PROMPT_RESPONSE_ERROR', payload: error.response ? error.response.data : "An error occurred" });
        } finally {
            dispatch({ type: 'EDIT_USER_PROMPT_RESPONSE_END' });
        }
    };
};