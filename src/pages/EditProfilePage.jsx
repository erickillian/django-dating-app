import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUserInfo, updateUserInfo } from '../actions/userActions';
import UserPicturesManager from '../components/UserPicturesManager';

import { Form, Input, Select, Button, Spin, message, Row, Col, Card, Flex } from 'antd';
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

    const handleChange = (event) => {
        if (event.target) {
            const value = event.target.value === 'Prefer not to say' ? '' : event.target.value;
            setUserProfileState({
                ...userProfileState,
                [event.target.name]: value
            });
        } else if (typeof event === 'object' && event !== null) {
            const key = Object.keys(event)[0];
            const value = event[key] === 'Prefer not to say' ? '' : event[key];
            setUserProfileState({
                ...userProfileState,
                [key]: value
            });
        }
    };

    const handleSubmit = (event) => {
        dispatch(updateUserInfo(userProfileState));
    };

    return (
        <Flex>
            <Col span={12}>
                <UserPicturesManager />
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
        </Flex>
    );
};

export default ProfilePage;
