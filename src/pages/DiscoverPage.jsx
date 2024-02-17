import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getNextUserProfile, rateUserProfile } from '../actions/datingActions';
import UserProfileDisplay from '../components/UserProfileDisplay';

const DiscoverPage = () => {
    const dispatch = useDispatch();

    // This state will hold the current user's profile data
    const user = useSelector(state => state.dating.next_user);
    const loading = useSelector(state => state.dating.next_user_loading);
    const error = useSelector(state => state.dating.next_user_error);

    useEffect(() => {
        dispatch(getNextUserProfile());
    }, [dispatch]);

    const handleRate = (action) => {
        if (user && user.id) {
            dispatch(rateUserProfile(user.id, action));
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        console.log(error);
        return <div>{error.message}</div>;
    }

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

export default DiscoverPage;
