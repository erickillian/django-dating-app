import React, { useState, useEffect } from 'react';
import { Modal, notification } from 'antd';
import { useSelector } from 'react-redux';
import UserProfileDisplay from './UserProfileDisplay';
import { Link } from 'react-router-dom';

const NotificationComponent = () => {
    const [webSocket, setWebSocket] = useState(null);
    const [notificationsQueue, setNotificationsQueue] = useState([]);
    const [matchNotification, setMatchNotification] = useState(null);
    const isAuthenticated = useSelector(state => state.user.token !== null);
    const userToken = useSelector(state => state.user.token);

    const handleLikeNotification = (user, num_likes) => {
        notification.open({
            message: 'New Like',
            description: `You recieved a liked from ${user.full_name}`,
            duration: 3,
            placement: "top",
        });
    };

    const pushNotification = (notification) => {
        setNotificationsQueue(prevQueue => [...prevQueue, notification]);
    };

    const popNotification = () => {
        setNotificationsQueue(prevQueue => prevQueue.slice(1));
    };

    const handleMatchNotification = (user, match_id) => {
        setMatchNotification({ user, match_id });
    };

    const handleMatchLinkClick = () => {
        handleMatchModalCancel();
    };

    useEffect(() => {
        let ws;

        const connectWebSocket = () => {
            document.cookie = 'Authorization=' + userToken + '; path=/';
            ws = new WebSocket("ws://localhost/ws/dating/");

            ws.onopen = () => {
                console.log('WebSocket Connected');
            };

            ws.onmessage = (e) => {
                const message = JSON.parse(e.data);
                if (message.type === 'like') {
                    handleLikeNotification(message.user, message.num_likes);
                } else if (message.type === 'match') {
                    handleMatchNotification(message.user, message.match_id);
                }
            };

            ws.onclose = () => {
                console.log('WebSocket Disconnected');
                setTimeout(() => {
                    connectWebSocket();
                }, 3000);
            };
        };

        if (isAuthenticated && !webSocket) {
            connectWebSocket();
        }

        return () => {
            if (ws) {
                ws.close();
            }
        };
    }, [isAuthenticated, userToken, webSocket]);

    const handleMatchModalCancel = () => {
        setMatchNotification(null);
    };

    return (
        <>
            {matchNotification && (
                <Modal
                    title="It's a Match!"
                    open={Boolean(matchNotification)}
                    onCancel={handleMatchModalCancel}
                    footer={null}
                >
                    <UserProfileDisplay user={matchNotification.user} />
                    <Link to={`/match/${matchNotification.match_id}`} onClick={handleMatchLinkClick}>View Match</Link>
                </Modal>
            )}
        </>
    );
};

export default NotificationComponent;
