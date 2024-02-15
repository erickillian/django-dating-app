const initialState = {
    token: localStorage.getItem('token'),
    auth_errors: null,
    auth_loading: false,
    user_profile: null,
    user_profile_loading: false,
    user_profile_error: null,
};

const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'LOGIN_START':
            return { ...state, auth_loading: true };
        case 'LOGIN_SUCCESS':
            localStorage.setItem('token', action.payload); // Save to local storage
            return { ...state, token: action.payload, auth_loading: null };
        case 'LOGIN_ERROR':
            return { ...state, auth_loading: action.payload, token: null };
        case 'LOGIN_END':
            return { ...state, auth_loading: false };
        case 'LOGOUT_START':
            return { ...state, auth_loading: true };
        case 'LOGOUT_SUCCESS':
            return { ...initialState, token: null };
        case 'LOGOUT_ERROR':
            return { ...state, auth_loading: action.payload };
        case 'LOGOUT_END':
            return { ...state, auth_loading: false };
        case 'FETCH_USER_PROFILE_START':
            return { ...state, user_profile_loading: true, error: null };
        case 'FETCH_USER_PROFILE_SUCCESS':
            return { ...state, user_profile: action.payload, user_profile_loading: false };
        case 'FETCH_USER_PROFILE_ERROR':
            return { ...state, error: action.payload, user_profile_loading: false };
        case 'UPDATE_USER_PROFILE_START':
            return { ...state, user_profile_loading: true, user_profile_error: null };
        case 'UPDATE_USER_PROFILE_SUCCESS':
            return { ...state, user_profile: action.payload, user_profile_loading: false, user_profile_error: null };
        case 'UPDATE_USER_PROFILE_ERROR':
            return { ...state, user_profile_error: action.payload, user_profile_loading: false };
        default:
            return state;
    }
};


export default userReducer;