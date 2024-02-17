import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUserInfo, updateUserInfo, fetchUserPictures, updateUserPicturesOrder } from '../actions/userActions';
import ImageUpload from '../components/ImageUpload';
import EditUserPictureComponent from '../components/EditUserPictureComponent';
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
    const pictures = useSelector(state => state.user.user_pictures);
    const loading = useSelector(state => state.user.loading);
    const error = useSelector(state => state.user.error);

    const [userProfileState, setUserProfileState] = useState({});
    const [selectedPictures, setSelectedPictures] = useState([]);

    useEffect(() => {
        if (!user) {
            dispatch(fetchUserInfo());
        } else {
            setUserProfileState(user);
        }
    }, [dispatch, user]);

    useEffect(() => {
        if (!pictures) {
            dispatch(fetchUserPictures());
        } else {
            // Gets pictures that are in the users profile, and sorts them by picture order.  Then maps the picture id's to an array.
            let selected_picture_ordering = pictures.filter(picture => picture.in_profile).sort((a, b) => a.picture_order - b.picture_order).map(picture => picture.id);
            // console.log(selected_picture_ordering);
            setSelectedPictures(selected_picture_ordering);
        }
    }, [dispatch, pictures]);

    const handleChange = (event) => {
        const value = event.target.value === 'Prefer not to say' ? '' : event.target.value;
        setUserProfileState({
            ...userProfileState,
            [event.target.name]: value
        });
    };

    const handlePictureClick = (pictureId) => {
        setSelectedPictures(prevSelected => {
            if (prevSelected.includes(pictureId)) {
                return prevSelected.filter(id => id !== pictureId);
            } else {
                return [...prevSelected, pictureId];
            }
        });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        dispatch(updateUserInfo(userProfileState));
    };

    const savePictureOrder = () => {
        dispatch(updateUserPicturesOrder(selectedPictures));
    };

    // Render user information or loading/error message
    return (
        <div>
            <div className="user-pictures">
                {pictures && pictures.length > 0 && pictures.map((picture, index) => (
                    <div key={picture.id} onClick={() => handlePictureClick(picture.id)}>
                        <EditUserPictureComponent
                            picture={picture}
                            selected={selectedPictures.includes(picture.id)}
                            selected_order={selectedPictures.includes(picture.id) ? selectedPictures.indexOf(picture.id) + 1 : -1}
                        />
                    </div>
                ))}
            </div>
            <button onClick={savePictureOrder}>Save Picture Order</button>
            <ImageUpload />
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
                                    <select name={key} value={userProfileState[key] || ''} onChange={handleChange}>
                                        {field.options.map((option, index) => (
                                            <option key={index} value={option === 'Prefer not to say' ? '' : option}>{option}</option>
                                        ))}
                                    </select>
                                ) : (
                                    <input type={field.type} name={key} value={userProfileState[key] || ''} onChange={handleChange} />
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