import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getLikes } from '../actions/datingActions';
import UserProfileDisplay from '../components/UserProfileDisplay';

const LikesPage = () => {
    const dispatch = useDispatch();
    const likes = useSelector(state => state.dating.likes);

    useEffect(() => {
        dispatch(getLikes());
    }, [dispatch]);

    return (
        <div>
            <h1>My Likes</h1>
            {likes && likes.map((like, index) => (
                <UserProfileDisplay user={like.rater} key={index} />
            ))}
            {likes && likes.length === 0 && (
                <p>No likes yet. </p>
            )}

        </div>
    );
};

export default LikesPage;
