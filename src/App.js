import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { checkUserAuthentication } from './actions/userActions';
import LoginForm from './components/LoginForm';
import LogoutComponent from './components/LogoutComponent';
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';
import EditProfilePage from './pages/EditProfilePage';
import DiscoverPage from './pages/DiscoverPage';
import LikesPage from './pages/LikesPage';
import MatchesPage from './pages/MatchesPage';
import MatchMessagesPage from './pages/MatchMessagesPage';
import AuthenticatedLayout from './layouts/AuthenticatedLayout';
import 'antd/dist/antd.js';

const App = () => {
    const dispatch = useDispatch();
    const isAuthenticated = useSelector(state => (state.user.token !== null));
    const userToken = useSelector(state => state.user.token);
    const [webSocket, setWebSocket] = useState(null);

    useEffect(() => {
        dispatch(checkUserAuthentication());
    }, [dispatch]);

    useEffect(() => {
        // Function to initialize WebSocket connection to handle real-time messages such as matches
        const connectWebSocket = () => {
            // Replace with your WebSocket connection URL
            document.cookie = 'Authorization=' + userToken + '; path=/';
            const ws = new WebSocket("ws://localhost/ws/dating/");

            ws.onopen = () => {
                console.log('WebSocket Connected');
            };

            ws.onmessage = (e) => {
                const message = JSON.parse(e.data);
                console.log('Message from server: ', message);
            };

            ws.onclose = () => {
                console.log('WebSocket Disconnected');
            };

            return ws;
        };

        if (isAuthenticated && !webSocket) {
            setWebSocket(connectWebSocket());
        }

        return () => {
            if (webSocket) {
                webSocket.close();
            }
        };
    }, [isAuthenticated, webSocket]);

    return (
        <Router>
            {isAuthenticated ? (
                <AuthenticatedLayout>
                    <Routes>
                        <>
                            <Route path="/discover" element={<DiscoverPage />} />
                            <Route path="/likes" element={<LikesPage />} />
                            <Route path="/matches" element={<MatchesPage />} />
                            <Route path="/matches/:match_id" element={<MatchMessagesPage />} />
                            <Route path="/profile" element={<ProfilePage />} exact />
                            <Route path="/edit" element={<EditProfilePage />} exact />
                            <Route path="/logout" element={<LogoutComponent />} />
                            <Route path="*" element={<Navigate to="/profile" replace />} />
                        </>
                    </Routes>
                </AuthenticatedLayout>
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
