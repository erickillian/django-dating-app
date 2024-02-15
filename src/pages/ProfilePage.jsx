import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUserInfo, updateUserInfo } from '../actions/userActions'; // Adjust the import path as needed

const formFields = {
    full_name: { label: 'Name', type: 'text', options: [] },
    birth_date: { label: 'Birth Date', type: 'date', options: [] },
    gender: { label: 'Gender', type: 'select', options: ['Male', 'Female', 'Other', 'Prefer not to say'] },
    sexual_orientation: { label: 'Sexual Orientation', type: 'select', options: ['Straight', 'Gay', 'Bisexual', 'Other', 'Prefer not to say'] },
    location: { label: 'Location', type: 'text', options: [] },
    height: { label: 'Height (in cm)', type: 'number', options: [] },
    phone_number: { label: 'Phone Number', type: 'text', options: [] }
};

const ProfilePage = () => {
    const dispatch = useDispatch();
    const user = useSelector(state => state.user.user_profile);
    const loading = useSelector(state => state.user.loading);
    const error = useSelector(state => state.user.error);

    const [formState, setFormState] = useState({
        full_name: '',
        birth_date: '',
        gender: '',
        sexual_orientation: '',
        location: '',
        height: '',
        phone_number: ''
    });

    useEffect(() => {
        if (user) {
            setFormState(user);
        } else {
            dispatch(fetchUserInfo());
        }
    }, [dispatch, user]);

    const handleChange = (event) => {
        const value = event.target.value === 'Prefer not to say' ? '' : event.target.value;
        setFormState({
            ...formState,
            [event.target.name]: value
        });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        dispatch(updateUserInfo(formState));
    };

    // Render user information or loading/error message
    return (
        <div>
            <h1>Profile</h1>
            {loading && <p>Loading...</p>}
            {error && <p>Error: {error}</p>}
            {user && (
                <form onSubmit={handleSubmit}>
                    {Object.keys(formFields).map((key) => {
                        const field = formFields[key];
                        return (
                            <label key={key}>
                                {field.label}:
                                {field.type === 'select' ? (
                                    <select name={key} value={formState[key] || ''} onChange={handleChange}>
                                        {field.options.map((option, index) => (
                                            <option key={index} value={option === 'Prefer not to say' ? '' : option}>{option}</option>
                                        ))}
                                    </select>
                                ) : (
                                    <input type={field.type} name={key} value={formState[key] || ''} onChange={handleChange} />
                                )}
                            </label>
                        );
                    })}
                    <button type="submit">Save Changes</button>
                </form>
            )}
        </div>
    );
};

export default ProfilePage;