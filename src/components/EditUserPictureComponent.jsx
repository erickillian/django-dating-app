import React from 'react';
import { useDispatch } from 'react-redux';
import { deleteUserPicture } from '../actions/userActions';
import { Card, Button } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import UserPicture from "./UserPicture";

const { Meta } = Card;

const EditUserPictureComponent = ({ picture, selected, selected_order }) => {
    const dispatch = useDispatch();

    const handleDelete = () => {
        dispatch(deleteUserPicture(picture.id));
    };

    return (
        <Card
            hoverable
            style={{ width: 240 }} // You may adjust the width as needed
            cover={<UserPicture image={picture.image} />}
            actions={[
                <Button
                    type="danger"
                    icon={<DeleteOutlined />}
                    onClick={handleDelete}
                >
                    Delete
                </Button>
            ]}
        >
            {selected && (
                <Meta
                    title={`Picture ${selected_order}`}
                    description={`Active with order: ${selected_order}`}
                />
            )}
        </Card>
    );
};

export default EditUserPictureComponent;
