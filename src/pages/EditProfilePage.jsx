import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUserInfo, updateUserInfo, fetchUserPictures, updateUserPicturesOrder } from '../actions/userActions';
import ImageUpload from '../components/ImageUpload';
import EditUserPictureComponent from '../components/EditUserPictureComponent';

import { Form, Input, Select, Button, Spin, message, Row, Col, Card } from 'antd';
import "./EditProfilePage.css";

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
        <Row gutter={16}>
            <Col span={12}>
                <Card title="Your Pictures" bordered={false}>
                    <Row gutter={[8, 8]} /* Adjust gutter for spacing */>
                        {pictures && pictures.length > 0 && pictures.map(picture => (
                            <Col key={picture.id} xs={24} sm={12} md={8} lg={6} /* Adjust column sizes as needed */>
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

                    <Button onClick={savePictureOrder} type="primary">Save Picture Order</Button>
                    <ImageUpload />
                </Card>
            </Col>
            <Col span={12}>
                {loading && <Spin />}
                {error && message.error(`Error: ${error}`)}
                {user && (
                    <Card title="Edit Profile" bordered={false}>
                        <Form layout="vertical" onValuesChange={handleChange} onFinish={handleSubmit} initialValues={user}>
                            {Object.keys(formFields).map(key => {
                                const field = formFields[key];
                                return (
                                    <Form.Item key={key} label={field.label} name={key}>
                                        {field.type === 'select' ? (
                                            <Select>
                                                {field.options.map(option => (
                                                    <Option key={option} value={option === 'Prefer not to say' ? '' : option}>{option}</Option>
                                                ))}
                                            </Select>
                                        ) : (
                                            <Input type={field.type} />
                                        )}
                                    </Form.Item>
                                );
                            })}
                            <Button type="primary" htmlType="submit">Save Changes</Button>
                        </Form>
                    </Card>
                )}
            </Col>
        </Row>
    );
};

export default ProfilePage;