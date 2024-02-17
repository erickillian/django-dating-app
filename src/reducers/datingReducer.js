const initialState = {
    next_user: null,
    next_user_loading: false,
    next_user_error: null,

    rate_user_loading: false,
    rate_user_error: null,

    likes: null,
    likes_loading: false,
    likes_error: null,

    matches: null,
    matches_loading: false,
    matches_error: null,
};

const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'NEXT_USER_START':
            return { ...state, next_user_loading: true, next_user_error: null };
        case 'NEXT_USER_SUCCESS':
            return { ...state, next_user: action.payload, next_user_loading: false };
        case 'NEXT_USER_ERROR':
            return { ...state, next_user_error: action.payload, next_user_loading: false, next_user: null };
        case 'NEXT_USER_END':
            return { ...state, next_user_loading: false };
        case 'RATE_USER_START':
            return { ...state, rate_user_loading: true, rate_user_error: null };
        case 'RATE_USER_ERROR':
            return { ...state, rate_user_error: action.payload };
        case 'RATE_USER_END':
            return { ...state, rate_user_loading: false };
        case 'LIKES_START':
            return { ...state, likes_loading: true, likes_error: null };
        case 'LIKES_SUCCESS':
            return { ...state, likes: action.payload, likes_loading: false };
        case 'LIKES_ERROR':
            return { ...state, likes_error: action.payload, likes_loading: false, likes: null };
        case 'MATCHES_START':
            return { ...state, matches_loading: true, matches_error: null };
        case 'MATCHES_SUCCESS':
            return { ...state, matches: action.payload, matches_loading: false };
        case 'MATCHES_ERROR':
            return { ...state, matches_error: action.payload, matches_loading: false, matches: null };
        default:
            return state;
    }
};

export default userReducer;