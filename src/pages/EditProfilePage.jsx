import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUserInfo, updateUserInfo, fetchUserPictures, updateUserPicturesOrder } from '../actions/userActions';
import ImageUpload from '../components/ImageUpload';
import UserPictureComponent from '../components/UserPictureComponent';
import UserProfileDisplay from '../components/UserProfileDisplay';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

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
        }
    }, [dispatch, pictures]);

    const handleChange = (event) => {
        const value = event.target.value === 'Prefer not to say' ? '' : event.target.value;
        setUserProfileState({
            ...userProfileState,
            [event.target.name]: value
        });
    };

    const onDragEnd = (result) => {
        if (!result.destination) return;

        const reorderedPictures = Array.from(pictures);
        const [reorderedItem] = reorderedPictures.splice(result.source.index, 1);
        reorderedPictures.splice(result.destination.index, 0, reorderedItem);

        // dispatch(updateUserPicturesOrder(reorderedPictures.map(p => p.id)));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        dispatch(updateUserInfo(userProfileState));
    };

    // Render user information or loading/error message
    return (
        <div>
            <h1>Edit Profile</h1>
            <div className="user-pictures">
                {pictures && pictures.length > 0 && (
                    <DragDropContext onDragEnd={onDragEnd}>
                        <Droppable droppableId="droppable">
                            {(provided) => (
                                <div {...provided.droppableProps} ref={provided.innerRef}>
                                    {pictures.map((picture, index) => (
                                        <Draggable key={picture.id} draggableId={picture.id.toString()} index={index}>
                                            {(provided) => (
                                                <div
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                >
                                                    <UserPictureComponent key={index} imageUrl={"http://localhost" + picture.image} id={picture.id} />
                                                </div>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    </DragDropContext>
                )}
            </div>
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