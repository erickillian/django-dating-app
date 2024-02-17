import React from 'react';

const LikeComponent = ({ like }) => {
    return (
        <div key={like.rater.id}>
            <h3>{like.rater.full_name}</h3>
            <img src={"http://localhost" + like.rater.pictures[0].image} alt="Error loading image" width="80" height="80" />
        </div>
    );
};

export default LikeComponent;
