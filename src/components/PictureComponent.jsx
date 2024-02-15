import React from 'react';

const PictureComponent = ({ imageUrl }) => {
    return (
        <div>
            {imageUrl && <img src={imageUrl} alt="Profile Image" width="300" height="300" />}
        </div>
    );
};

export default PictureComponent;