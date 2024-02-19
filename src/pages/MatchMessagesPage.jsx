import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import api from '../api/api';

import { List, Input, Button, Spin, Layout } from 'antd';
import { SendOutlined } from '@ant-design/icons';

const { Content } = Layout;
const { TextArea } = Input;

const MatchMessagesPage = () => {
    const { match_id } = useParams();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [typing, setTyping] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const ws = useRef(null);
    const userToken = useSelector(state => state.user.token);
    let typingTimeout = null;

    useEffect(() => {
        const fetchPreviousMessages = async () => {
            try {
                const response = await api.get(`/dating/matches/${match_id}/messages`);
                setMessages(response.data);
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
    }, [match_id, userToken]);

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
        typingTimeout = setTimeout(() => {
            setTyping(false);
            ws.current.send(JSON.stringify({ type: 'typing', is_typing: false }));
        }, 500);
    };

    return (
        <Layout>
            <Content style={{ maxWidth: '600px', margin: 'auto' }}>
                <div style={{ background: '#fff', minHeight: 280 }}>
                    <List
                        itemLayout="horizontal"
                        dataSource={messages}
                        renderItem={item => (
                            <List.Item>
                                <List.Item.Meta
                                    title={<strong>{item.user.full_name}:</strong>}
                                    description={item.message}
                                />
                            </List.Item>
                        )}
                    />
                    {isTyping && <Spin />}
                    <TextArea
                        rows={4}
                        value={newMessage}
                        onChange={handleTyping}
                        placeholder="Type a message..."
                        style={{ marginBottom: '20px' }}
                    />
                    <Button
                        type="primary"
                        onClick={sendMessage}
                        icon={<SendOutlined />}
                        disabled={!newMessage.trim()}
                    >
                        Send
                    </Button>
                </div>
            </Content>
        </Layout>
    );
};

export default MatchMessagesPage;
