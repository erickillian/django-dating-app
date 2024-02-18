import React from 'react';
import { Link } from 'react-router-dom';
import { Card, Avatar, Button } from 'antd';
import { MessageOutlined } from '@ant-design/icons';

const { Meta } = Card;

const MatchComponent = ({ match }) => {
    const imageUrl = match.other_user.pictures[0].image; // Use optional chaining for safety

    return (
        <Card
            style={{ width: 300, marginTop: 16 }}
            actions={[
                <Link to={`/matches/${match.id}`}>
                    <Button type="primary" icon={<MessageOutlined />} size="large">
                        Messages
                    </Button>
                </Link>
            ]}
        >
            <Meta
                avatar={<Avatar src={`http://localhost${imageUrl}`} />}
                title={match.other_user.full_name}
                description={
                    <div>
                        Last Message: {match.last_message ? match.last_message.message : "No messages yet"}
                    </div>
                }
            />
        </Card>
    );
};

export default MatchComponent;
