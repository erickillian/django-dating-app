import React from 'react';
import { useDispatch } from 'react-redux';
import { deleteUserPicture } from '../actions/userActions';

const UserPictureComponent = ({ imageUrl, id }) => {
    const dispatch = useDispatch();

    const handleDelete = () => {
        dispatch(deleteUserPicture(id));
    };

    return (
        <div>
            {imageUrl && <img src={imageUrl} alt="Profile Image" width="300" height="300" />}
            <button onClick={handleDelete}>Delete</button>
        </div>
    );
};

export default UserPictureComponent;