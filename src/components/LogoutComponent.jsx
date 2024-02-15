import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../actions/userActions'; // Update the path as necessary

const LogoutComponent = () => {
    const dispatch = useDispatch();
    const { loading, token, error } = useSelector(state => state.user);
    const [message, setMessage] = useState('');

    useEffect(() => {
        dispatch(logoutUser());
    }, [dispatch]);

    useEffect(() => {
        if (loading) {
            setMessage('Logging out...');
        } else if (!token && !error) {
            setMessage('Logout successful.');
        } else if (error) {
            setMessage('Logout failed. Please try again.');
        }
    }, [loading, token, error]);

    return (
        <div>
            <p>{message}</p>
        </div>
    );
};

export default LogoutComponent;
