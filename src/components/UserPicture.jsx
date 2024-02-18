import React from 'react';

const UserPicture = ({ image }) => {
    return (
        <div style={{ lineHeight: 0, overflow: 'hidden' }}> {/* Ensures no extra space below the image */}
            <img src={"http://localhost" + image} alt="User" style={{ maxWidth: '100%', }} /> {/* Maintains aspect ratio */}
        </div>
    );
};

export default UserPicture;