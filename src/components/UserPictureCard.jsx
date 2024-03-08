import React from "react";
import { Card } from "antd"; // Assuming you're using Ant Design
import "./UserPictureCard.css";

// UserPictureCard Component
const UserPictureCard = (props) => {
    const cardStyle = {
        border: 0, // Removes the border
        padding: 0, // Removes the padding
        overflow: "hidden", // Ensures the image fits within the card
    };

    const imageStyle = {
        width: "100%",
        height: "100%",
        objectFit: "cover",
        userDrag: "none", // Disable dragging of the image
        userSelect: "none", // Disable selection of the image
    };

    return (
        <Card bordered={false} style={cardStyle} className="user-picture-card">
            <img
                src={"http://localhost" + props.image}
                alt="User"
                style={imageStyle}
                draggable="false" // Make the image not draggable
            />
            {props.children}
        </Card>
    );
};

export default UserPictureCard;
