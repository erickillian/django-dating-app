import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateUserInfo } from '../actions/userActions';
import { Form, Input, Select, Button, Spin, message } from 'antd';

const { Option } = Select;

const formFields = {
    full_name: { label: 'Name', type: 'text', options: [] },
    birth_date: { label: 'Birth Date', type: 'date', options: [] },
    gender: { label: 'Gender', type: 'select', options: ['Male', 'Female', 'Other', 'Prefer not to say'] },
    sexual_orientation: { label: 'Sexual Orientation', type: 'select', options: ['Straight', 'Gay', 'Bisexual', 'Other', 'Prefer not to say'] },
    location: { label: 'Location', type: 'text', options: [] },
    height: { label: 'Height (in cm)', type: 'number', options: [] },
};

const UserInfoManager = () => {
    const dispatch = useDispatch();
    const user = useSelector(state => state.user.user_profile);
    const loading = useSelector(state => state.user.loading);
    const error = useSelector(state => state.user.error);
    const [userProfileState, setUserProfileState] = useState({});
    const [changedFields, setChangedFields] = useState({});

    useEffect(() => {
        setUserProfileState(user || {});
    }, [user]);

    const handleChange = (_, allFields) => {
        const changes = allFields.reduce((acc, field) => {
            if (field.touched) {
                acc[field.name[0]] = field.value === 'Prefer not to say' ? '' : field.value;
            }
            return acc;
        }, {});
        setChangedFields(changes);
    };

    const handleSubmit = () => {
        if (Object.keys(changedFields).length > 0) {
            dispatch(updateUserInfo(changedFields));
            message.success('Profile updated successfully');
        }
    };

    return (
        <>
            {loading && <Spin />}
            {error && message.error(`Error: ${error}`)}
            <Form layout="vertical" onFieldsChange={handleChange} onFinish={handleSubmit} initialValues={user}>
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
        </>
    );
};

export default UserInfoManager;
