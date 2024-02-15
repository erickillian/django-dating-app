import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUserInfo, updateUserInfo, fetchUserPictures } from '../actions/userActions';
import ImageUpload from '../components/ImageUpload';
import PictureComponent from '../components/PictureComponent';

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
    const pictures = useSelector(state => state.user.user_pictures);
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
        if (!user) {
            dispatch(fetchUserInfo());
        }
    }, [dispatch, user]);

    useEffect(() => {
        if (!pictures) {
            dispatch(fetchUserPictures());
        }
    }, [dispatch, pictures]);

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
            <div className="user-pictures">
                {pictures && pictures.map((picture, index) => (
                    <PictureComponent key={index} imageUrl={"http://localhost" + picture.image} /> // Adjust the property as per your data structure
                ))}
            </div>
            <ImageUpload />
        </div>
    );
};

export default ProfilePage;