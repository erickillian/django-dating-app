import React from 'react';

const MatchComponent = ({ match }) => {
    return (
        <div key={match.other_user.id}>
            <h3>{match.other_user.full_name}</h3>
            <img src={"http://localhost" + match.other_user.pictures[0].image} alt="Error loading image" width="80" height="80" />
        </div>
    );
};

export default MatchComponent;
