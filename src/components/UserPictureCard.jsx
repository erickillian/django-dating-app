import React from 'react';
import { Card } from 'antd'; // Assuming you're using Ant Design
import UserPicture from './UserPicture';
import "./UserPictureCard.css"

// UserPictureCard Component
const UserPictureCard = (props) => {
    const cardStyle = {
        border: 0, // Removes the border
        padding: 0, // Removes the padding
        overflow: 'hidden' // Ensures the image fits within the card
    };

    return (
        <Card bordered={false} style={cardStyle} className="user-picture-card">
            <UserPicture image={props.image} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            {props.children}
        </Card>
    );
};

export default UserPictureCard;