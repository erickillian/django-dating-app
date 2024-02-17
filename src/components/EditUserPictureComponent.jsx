import React from 'react';
import { useDispatch } from 'react-redux';
import { deleteUserPicture } from '../actions/userActions';
import UserPicture from "./UserPicture";

const EditUserPictureComponent = ({ picture, selected, selected_order }) => {
    const dispatch = useDispatch();

    const handleDelete = () => {
        dispatch(deleteUserPicture(picture.id));
    };

    return (
        <div>
            <UserPicture image={picture.image} />
            <button onClick={handleDelete}>Delete</button>
            {
                selected && <div>Active with order: {selected_order}</div>
            }
        </div>
    );
};

export default EditUserPictureComponent;