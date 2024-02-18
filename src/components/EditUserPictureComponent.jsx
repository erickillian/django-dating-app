import React from 'react';
import { useDispatch } from 'react-redux';
import { deleteUserPicture } from '../actions/userActions';
import { Card, Button } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import UserPictureCard from "./UserPictureCard";
import './EditUserPictureComponent.css'; // Make sure to include the CSS file

const { Meta } = Card;

const EditUserPictureComponent = ({ picture, selected, selected_order }) => {
    const dispatch = useDispatch();

    const handleDelete = () => {
        dispatch(deleteUserPicture(picture.id));
    };

    // Determine the CSS class for the border
    const borderClass = selected ? 'selected-border' : '';

    return (
        <div className={"card-container " + borderClass} >
            <UserPictureCard
                hoverable

                style={{ width: 240 }} // Adjust width as needed
                image={picture.image}
            >
                {
                    selected_order !== -1 &&
                    <Button className="display-button number-badge" shape="circle" hoverable="false">
                        {selected_order}
                    </Button>
                }
            </UserPictureCard>

            <Button className="display-button delete-button" onClick={handleDelete} shape="circle">
                <DeleteOutlined />
            </Button>
        </div >
    );
};

export default EditUserPictureComponent;
