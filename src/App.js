import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { checkUserAuthentication } from './actions/userActions';
import LoginForm from './components/LoginForm';
import LogoutComponent from './components/LogoutComponent';
import HomePage from './pages/HomePage';
import UserPage from './pages/UserPage';

// import NotFoundPage from './components/NotFoundPage';

const App = () => {
    const dispatch = useDispatch();
    const isAuthenticated = useSelector(state => (state.user.token !== null));

    useEffect(() => {
        dispatch(checkUserAuthentication());
    }, [dispatch]);

    return (
        <Router>
            <Routes>
                {isAuthenticated ? (
                    // Routes for authenticated users
                    <>
                        <Route path="/" element={<UserPage />} exact />
                        <Route path="/dashboard" element={<div>Dashboard</div>} />
                        {/* Add more routes for authenticated users here */}

                        {/* Redirect from login/register to home if already authenticated */}
                        <Route path="/logout" element={<LogoutComponent />} />
                        <Route path="/login" element={<Navigate to="/" replace />} />

                        {/* Fallback route for undefined paths */}
                        <Route path="*" element={<div>Not Found</div>} />
                    </>
                ) : (
                    // Routes for non-authenticated users
                    <>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/login" element={<LoginForm />} />
                        <Route path="/register" element={<div>Register</div>} />
                        {/* Add more routes for non-authenticated users here */}
                        {/* Fallback route for undefined paths */}
                        <Route path="*" element={<Navigate to="/login" replace />} />
                    </>
                )}
            </Routes>
        </Router>
    );
};

export default App;