import api from "../api/api";

export const getNextUserProfile = () => {
    return async dispatch => {
        dispatch({ type: 'NEXT_USER_START' });
        try {
            const response = await api.get('/dating/next/');
            dispatch({ type: 'NEXT_USER_SUCCESS', payload: response.data });
        } catch (error) {
            dispatch({ type: 'NEXT_USER_ERROR', payload: error.response.data });
        } finally {
            dispatch({ type: 'NEXT_USER_END' });
        }
    };
};


// Async Action Creator
export const rateUserProfile = (ratedUserId, action) => {
    return async dispatch => {
        // Dispatch START action
        dispatch({ type: 'RATE_USER_START' });

        try {
            // API call to rate the user profile
            const response = await api.post('dating/rate/', {
                rated_user_id: ratedUserId,
                action: action  // 'like' or 'dislike'
            });

            // Dispatch SUCCESS action with the response data
            dispatch({ type: 'RATE_USER_SUCCESS', payload: response.data });

            // Assuming the rating was successful, get the next user profile
            dispatch(getNextUserProfile());
        } catch (error) {
            // Dispatch ERROR action with error response data
            dispatch({ type: 'RATE_USER_ERROR', payload: error.response.data });
        } finally {
            // Dispatch END action
            dispatch({ type: 'RATE_USER_END' });
        }
    };
};

export const getLikes = () => {
    return async dispatch => {
        dispatch({ type: 'LIKES_START' });
        try {
            const response = await api.get('/dating/likes/');
            dispatch({ type: 'LIKES_SUCCESS', payload: response.data });
        } catch (error) {
            dispatch({ type: 'LIKES_ERROR', payload: error.response.data });
        } finally {
            dispatch({ type: 'LIKES_END' });
        }
    };
};

export const getMatches = () => {
    return async dispatch => {
        dispatch({ type: 'MATCHES_START' });
        try {
            const response = await api.get('/dating/matches/');
            dispatch({ type: 'MATCHES_SUCCESS', payload: response.data });
        } catch (error) {
            dispatch({ type: 'MATCHES_ERROR', payload: error.response.data });
        } finally {
            dispatch({ type: 'MATCHES_END' });
        }
    };
};

