import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getLikes } from '../actions/datingActions';
import LikeComponent from '../components/LikeComponent';

const LikesPage = () => {
    const dispatch = useDispatch();
    const likes = useSelector(state => state.dating.likes);

    useEffect(() => {
        dispatch(getLikes());
    }, [dispatch]);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '20px' }}>
            {likes && likes.length > 0 ? (
                likes.map((like, index) => (
                    <LikeComponent like={like} key={index} style={{ marginBottom: '10px' }} />
                ))
            ) : (
                <p>No likes yet.</p>
            )}
        </div>
    );
};

export default LikesPage;
