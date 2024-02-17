import React from 'react';

const UserPicture = ({ image }) => {
    return (
        <img src={"http://localhost" + image} alt="Profile Image" width="300" height="300" />
    );
};

export default UserPicture;