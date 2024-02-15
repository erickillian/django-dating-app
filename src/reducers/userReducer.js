const initialState = {
    token: localStorage.getItem('token'),
    auth_errors: null,
    auth_loading: false,

    user_profile: null,
    user_profile_loading: false,
    user_profile_error: null,

    user_pictures: null,
    user_pictures_loading: false,
    user_pictures_error: null,

    user_upload_progress: 0,
    user_uploading: false,
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
            return { ...state, user_profile_loading: true, user_profile_error: null };
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
        case 'FETCH_USER_PICTURES_START':
            return { ...state, user_pictures_loading: true, user_pictures_error: null };
        case 'FETCH_USER_PICTURES_SUCCESS':
            return { ...state, user_pictures: action.payload, user_pictures_loading: false };
        case 'FETCH_USER_PICTURES_ERROR':
            return { ...state, user_pictures_error: action.payload, user_pictures_loading: false };
        case 'UPLOAD_USER_PICTURE_START':
            return {
                ...state,
                user_uploading: true,
                user_upload_progress: 0,
            };
        case 'UPLOAD_PROGRESS':
            return {
                ...state,
                user_upload_progress: action.payload,
            };
        case 'UPLOAD_USER_PICTURE_SUCCESS':
            // Add the new picture to user_pictures array
            return {
                ...state,
                user_pictures: [...state.user_pictures, action.payload],
                user_uploading: false,
                user_upload_progress: 0,
            };
        case 'UPLOAD_USER_PICTURE_ERROR':
            return {
                ...state,
                user_uploading: false,
                user_upload_progress: 0,
            };
        case 'UPLOAD_USER_PICTURE_END':
            return {
                ...state,
                user_uploading: false,
            };
        default:
            return state;
    }
};


export default userReducer;