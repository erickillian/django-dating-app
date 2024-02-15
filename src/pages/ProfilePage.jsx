import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
// import { fetchUserPreferences } from './actions/userActions';
import { Link } from 'react-router-dom';

const ProfilePage = () => {
    const dispatch = useDispatch();
    // const preferences = useSelector(state => state.user.preferences);

    // useEffect(() => {
    //     dispatch(fetchUserPreferences());
    // }, [dispatch]);

    return (
        <div>
            <h1>Profile</h1>
            {/* {preferences.map((preference, index) => (
                <div key={index}>
                    <h2>{preference.title}</h2>
                    <p>{preference.value}</p>
                </div>
            ))} */}
            <Link to="/logout" replace>Logout </Link>
        </div>
    );
};

export default ProfilePage;