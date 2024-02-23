import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Row, Col, Card, Button } from 'antd';
import ImageUpload from '../components/ImageUpload';
import EditUserPictureComponent from '../components/EditUserPictureComponent';
import { fetchUserPictures, updateUserPicturesOrder } from '../actions/userActions';

const UserPicturesManager = () => {
    const dispatch = useDispatch();
    const pictures = useSelector(state => state.user.user_pictures);

    const [selectedPictures, setSelectedPictures] = useState([]);

    useEffect(() => {
        dispatch(fetchUserPictures());
    }, [dispatch]);

    useEffect(() => {
        if (pictures) {
            let selectedPictureOrdering = pictures
                .filter(picture => picture.in_profile)
                .sort((a, b) => a.picture_order - b.picture_order)
                .map(picture => picture.id);

            setSelectedPictures(selectedPictureOrdering);
        }
    }, [pictures]);

    const handlePictureClick = (pictureId) => {
        setSelectedPictures(prevSelected => {
            if (prevSelected.includes(pictureId)) {
                return prevSelected.filter(id => id !== pictureId);
            } else {
                return [...prevSelected, pictureId];
            }
        });
    };

    const savePictureOrder = () => {
        dispatch(updateUserPicturesOrder(selectedPictures));
    };

    return (
        <Card title="Your Pictures" bordered={false}>
            <Row gutter={[8, 8]}>
                {pictures && pictures.length > 0 && pictures.map(picture => (
                    <Col key={picture.id} xs={24} sm={12} md={8} lg={6}>
                        <div onClick={() => handlePictureClick(picture.id)}>
                            <EditUserPictureComponent
                                picture={picture}
                                selected={selectedPictures.includes(picture.id)}
                                selected_order={selectedPictures.includes(picture.id) ? selectedPictures.indexOf(picture.id) + 1 : -1}
                            />
                        </div>
                    </Col>
                ))}
            </Row>
            <Row>
                <Button onClick={savePictureOrder} type="primary">Save Picture Order</Button>
            </Row>
            <Row>
                <ImageUpload />
            </Row>
        </Card>
    );
};

export default UserPicturesManager;
