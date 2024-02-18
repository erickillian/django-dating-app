import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getNextUserProfile, rateUserProfile } from '../actions/datingActions';
import UserProfileDisplay from '../components/UserProfileDisplay';
import { Button, Spin, Card, Alert } from 'antd';
import { DislikeOutlined, LikeOutlined } from '@ant-design/icons';

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
        return <Spin size="large" />;
    }

    if (error) {
        return <Alert message={error.message} type="error" />;
    }

    return (
        <div>
            {user && <UserProfileDisplay user={user} />}
            <div style={{ textAlign: 'center', marginTop: 16 }}>
                <Button
                    icon={<DislikeOutlined />}
                    onClick={() => handleRate("dislike")}
                    type="primary"
                    style={{ marginRight: 8 }}
                >
                    No
                </Button>
                <Button
                    icon={<LikeOutlined />}
                    onClick={() => handleRate("like")}
                    type="primary"
                >
                    Yes
                </Button>
            </div>
        </div>
    );
};

export default DiscoverPage;
