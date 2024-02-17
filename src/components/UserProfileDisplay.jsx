import React from 'react';
import UserPicture from '../components/UserPicture';

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
            <div className="user-pictures">
                {user && user.pictures && user.pictures.map((picture, index) => (
                    <UserPicture key={index} image={picture.image} />
                ))}
            </div>
            <h1>{user.full_name}</h1>
            <div>
                {user && Object.entries(user).map(([key, value]) => {
                    if (key !== "full_name" && key !== "pictures" && key !== "id") {
                        return (
                            <p key={key}><strong>{key.replace(/_/g, ' ')}:</strong> {displayUserInfo(key, value)}</p>
                        );
                    }
                    return null;
                })}
            </div>

        </div>
    );
};

export default UserProfileDisplay;
