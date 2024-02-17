import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUserInfo, updateUserInfo, fetchUserPictures } from '../actions/userActions';
import ImageUpload from '../components/ImageUpload';
import UserPictureComponent from '../components/EditUserPictureComponent';
import UserProfileDisplay from '../components/UserProfileDisplay';

const formFields = {
    full_name: { label: 'Name', type: 'text', options: [] },
    birth_date: { label: 'Birth Date', type: 'date', options: [] },
    gender: { label: 'Gender', type: 'select', options: ['Male', 'Female', 'Other', 'Prefer not to say'] },
    sexual_orientation: { label: 'Sexual Orientation', type: 'select', options: ['Straight', 'Gay', 'Bisexual', 'Other', 'Prefer not to say'] },
    location: { label: 'Location', type: 'text', options: [] },
    height: { label: 'Height (in cm)', type: 'number', options: [] },
};

const ProfilePage = () => {
    const dispatch = useDispatch();
    const user = useSelector(state => state.user.user_profile);
    const loading = useSelector(state => state.user.loading);
    const error = useSelector(state => state.user.error);

    useEffect(() => {
        if (!user) {
            dispatch(fetchUserInfo());
        }
    }, [dispatch, user]);

    // Render user information or loading/error message
    return (
        <div>
            <h1>Profile</h1>
            {user && <UserProfileDisplay user={user} />}
        </div>
    );
};

export default ProfilePage;