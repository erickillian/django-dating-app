import React from 'react';
import { Link } from 'react-router-dom';
import { Card, Avatar, Typography } from 'antd';
import { MessageOutlined } from '@ant-design/icons';

const { Text } = Typography;

const MatchComponent = ({ match }) => {
    const imageUrl = match.other_user.pictures[0].image; // Ensure this path is correct

    return (
        <Link to={`/matches/${match.id}`} style={{ width: '100%' }}>
            <Card
                hoverable
                style={{ width: 300, marginTop: 16 }}
            >
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar size={64} src={`http://localhost${imageUrl}`} style={{ marginRight: 16 }} />
                    <div>
                        <Text strong>{match.other_user.full_name}</Text>
                        <br />
                        <Text type="secondary">
                            {match.last_message ? match.last_message.message : "No messages yet"}
                        </Text>
                    </div>
                </div>
            </Card>
        </Link>
    );
};

export default MatchComponent;
