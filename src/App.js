import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { checkUserAuthentication } from './actions/userActions';
import LoginForm from './components/LoginForm';
import LogoutComponent from './components/LogoutComponent';
import Navbar from './components/NavBar';
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';

const App = () => {
    const dispatch = useDispatch();
    const isAuthenticated = useSelector(state => (state.user.token !== null));

    useEffect(() => {
        dispatch(checkUserAuthentication());
    }, [dispatch]);

    return (
        <Router>
            {isAuthenticated ? (
                <Navbar>
                    <Routes>
                        <>
                            <Route path="/discover" element={<div>Discover</div>} />
                            <Route path="/likes" element={<div>Likes</div>} />
                            <Route path="/chat" element={<div>Chat</div>} />
                            <Route path="/profile" element={<ProfilePage />} exact />
                            <Route path="/logout" element={<LogoutComponent />} />
                            <Route path="*" element={<Navigate to="/profile" replace />} />
                        </>
                    </Routes>
                </Navbar>
            ) : (
                <Routes>
                    <>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/login" element={<LoginForm />} />
                        <Route path="/register" element={<div>Register</div>} />
                        <Route path="*" element={<Navigate to="/login" replace />} />
                    </>
                </Routes>
            )}
        </Router>
    );
};

export default App;