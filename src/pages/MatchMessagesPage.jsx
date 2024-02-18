import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import api from '../api/api';

const MatchMessagesPage = () => {
    const { match_id } = useParams();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [typing, setTyping] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const ws = useRef(null);
    const userToken = useSelector(state => state.user.token);

    useEffect(() => {
        // Function to fetch previous messages
        const fetchPreviousMessages = async () => {
            try {
                const response = await api.get(`http://localhost/dating/matches/${match_id}/messages`, {
                    headers: { Authorization: `Token ${userToken}` }
                });
                setMessages(response.data); // Assuming the response has a messages array
            } catch (error) {
                console.error('Error fetching messages:', error);
            }
        };

        fetchPreviousMessages();

        document.cookie = 'Authorization=' + userToken + '; path=/';
        ws.current = new WebSocket(`ws://localhost/ws/dating/${match_id}/`);
        ws.current.onopen = () => console.log("Connected to WS");
        ws.current.onclose = () => console.log("Disconnected from WS");

        ws.current.onmessage = e => {
            const data = JSON.parse(e.data);
            switch (data.type) {
                case 'chat_message':
                    setMessages(prev => [...prev, data]);
                    break;
                case 'typing':
                    setIsTyping(data.is_typing);
                    break;
                default:
                    break;
            }
        };

        return () => {
            ws.current.close();
        };
    }, [match_id]);

    const sendMessage = () => {
        if (newMessage) {
            ws.current.send(JSON.stringify({ type: 'message', message: newMessage }));
            setNewMessage('');
            setTyping(false);
        }
    };

    const handleTyping = (e) => {
        setNewMessage(e.target.value);
        if (!typing) {
            setTyping(true);
            ws.current.send(JSON.stringify({ type: 'typing', is_typing: true }));
        }
        clearTimeout(typingTimeout);
        const typingTimeout = setTimeout(() => {
            setTyping(false);
            ws.current.send(JSON.stringify({ type: 'typing', is_typing: false }));
        }, 500);
    };

    return (
        <div>
            <h1>Match Messages {match_id}</h1>
            <div>
                {messages.map((msg, index) => (
                    <p key={index}><strong>{msg.user}:</strong> {msg.message}</p>
                ))}
                {isTyping && <p>Someone is typing...</p>}
            </div>
            <textarea
                value={newMessage}
                onChange={handleTyping}
                placeholder="Type a message..."
            />
            <button onClick={sendMessage}>Send</button>
        </div>
    );
};

export default MatchMessagesPage;
