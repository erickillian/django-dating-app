import React from 'react';
import { getNextUserProfile, rateUserProfile } from '../actions/datingActions';

const UserRateComponent = ({ user }) => {
    return (
        <div>
            {user && <UserProfileDisplay user={user} />}
            <button onClick={() => handleRate("dislike")}>
                No
            </button>
            <button onClick={() => handleRate("like")}>
                Yes
            </button>
        </div>
    );
};

export default UserRateComponent;
