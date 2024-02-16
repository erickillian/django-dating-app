import React from 'react';
import UserPictureComponent from '../components/UserPictureComponent';

const UserProfileDisplay = ({ user }) => {
    // Function to format user info for display
    const displayUserInfo = (key, value) => {
        if (key === 'birth_date') {
            // Format date if necessary
            return new Date(value).toLocaleDateString();
        }
        return value || 'Not Specified';
    };

    // Render user information
    return (
        <div>
            <h1>{user ? user.full_name : "User's Profile"}</h1>
            <div>
                {user && Object.entries(user).map(([key, value]) => {
                    if (['full_name', 'birth_date', 'gender', 'sexual_orientation', 'location', 'height'].includes(key)) {
                        return (
                            <p key={key}><strong>{key.replace(/_/g, ' ')}:</strong> {displayUserInfo(key, value)}</p>
                        );
                    }
                    return null;
                })}
            </div>
            <div className="user-pictures">
                {user && user.pictures && user.pictures.map((picture, index) => (
                    <UserPictureComponent key={index} imageUrl={picture.image} id={picture.id} />
                ))}
            </div>
        </div>
    );
};

export default UserProfileDisplay;
