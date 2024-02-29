// Import configureStore from Redux Toolkit
import { configureStore } from '@reduxjs/toolkit';

// Import your root reducer
import rootReducer from '../reducers';

// Define the initial state, if necessary
const initialState = {};

// Create the store using configureStore
const store = configureStore({
    reducer: rootReducer,
    preloadedState: initialState,
    // Redux Toolkit includes Redux Thunk middleware by default,
    // so you do not need to add it explicitly unless you have additional middleware to add.
    middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
    // Redux DevTools Extension is enabled by default in development mode
    // when using configureStore, so no need for explicit configuration.
});

export default store;
