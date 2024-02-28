const initialState = {
    token: localStorage.getItem('token'),
    auth_errors: null,
    auth_loading: false,

    register_loading: false,
    register_errors: null,

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
            localStorage.setItem('token', action.payload.token); // Save to local storage
            return { ...state, token: action.payload.token, user_profile: action.payload.user_profile, auth_loading: null };
        case 'LOGIN_ERROR':
            return { ...state, auth_errors: action.payload, token: null };
        case 'LOGIN_END':
            return { ...state, auth_loading: false };
        case 'REGISTER_START':
            return { ...state, register_loading: true, register_errors: null };
        case 'REGISTER_ERROR':
            return { ...state, register_errors: action.payload };
        case 'REGISTER_END':
            return { ...state, register_loading: false };
        case 'LOGOUT_START':
            return { ...state, auth_loading: true };
        case 'LOGOUT_SUCCESS':
            localStorage.removeItem('token');
            return { ...initialState, token: null };
        case 'LOGOUT_ERROR':
            return { ...state, auth_errors: action.payload };
        case 'LOGOUT_END':
            return { ...state, auth_loading: false };
        case 'FETCH_USER_PROFILE_START':
            return { ...state, user_profile_loading: true, user_profile_error: null };
        case 'FETCH_USER_PROFILE_SUCCESS':
            return { ...state, user_profile: action.payload, user_profile_loading: false };
        case 'FETCH_USER_PROFILE_ERROR':
            return { ...state, user_profile_error: action.payload, user_profile_loading: false };
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
        case 'DELETE_USER_PICTURE_START':
            return {
                ...state,
                user_pictures_error: null,
                user_pictures: state.user_pictures.map(picture =>
                    picture.id === action.payload ? { ...picture, loading: true } : picture
                ),
            };
        case 'DELETE_USER_PICTURE_SUCCESS':
            return {
                ...state,
                user_pictures: state.user_pictures.filter(picture => picture.id !== action.payload),
            };
        case 'DELETE_USER_PICTURE_ERROR':
            return {
                ...state,
                user_pictures_error: {
                    ...action.payload
                },
            };
        case 'DELETE_USER_PICTURE_END':
            return {
                ...state,
                user_pictures: state.user_pictures.map(picture =>
                    picture.id === action.payload ? { ...picture, loading: false } : picture
                ),
            };
        case 'UPDATE_USER_PICTURES_ORDER_SUCCESS':
            return {
                ...state,
                user_pictures: action.payload,
            };
        default:
            return state;
    }
};


export default userReducer;