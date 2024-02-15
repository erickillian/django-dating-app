const initialState = {
    token: localStorage.getItem('token'),
    error: null,
    loading: false,
};

const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'LOGIN_START':
            return { ...state, loading: true };
        case 'LOGIN_SUCCESS':
            localStorage.setItem('token', action.payload); // Save to local storage
            return { ...state, token: action.payload, error: null };
        case 'LOGIN_ERROR':
            return { ...state, error: action.payload, token: null };
        case 'LOGIN_END':
            return { ...state, loading: false };
        case 'LOGOUT_START':
            return { ...state, loading: true };
        case 'LOGOUT_SUCCESS':
            return { ...initialState, token: null };
        case 'LOGOUT_ERROR':
            return { ...state, error: action.payload };
        case 'LOGOUT_END':
            return { ...state, loading: false };
        default:
            return state;
    }
};


export default userReducer;