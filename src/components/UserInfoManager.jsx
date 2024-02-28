import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateUserInfo } from '../actions/userActions';
import { Form, Input, Select, Button, Spin, message } from 'antd';

const { Option } = Select;

// Assuming interests are predefined or fetched from an API
const availableInterests = ['Reading', 'Gaming', 'Traveling', 'Cooking', 'Sports'];

const formFields = {
    full_name: { label: 'Name', type: 'text', options: [] },
    birth_date: { label: 'Birth Date', type: 'date', options: [] },
    gender: { label: 'Gender', type: 'select', options: ['Male', 'Female', 'Other', 'Prefer not to say'] },
    sexual_orientation: { label: 'Sexual Orientation', type: 'select', options: ['Straight', 'Gay', 'Bisexual', 'Other', 'Prefer not to say'] },
    location: { label: 'Location', type: 'text', options: [] },
    height: { label: 'Height (in cm)', type: 'number', options: [] },
    interests: { label: 'Interests', type: 'interests' },
};

const UserInfoManager = () => {
    const dispatch = useDispatch();
    const user = useSelector(state => state.user.user_profile);
    const [userProfileState, setUserProfileState] = useState({});
    const [changedFields, setChangedFields] = useState({});
    const [formKey, setFormKey] = useState(Date.now()); // Using Date.now() to generate a unique key

    useEffect(() => {
        if (user) {
            setUserProfileState(user);
            setFormKey(Date.now()); // Update key to force re-render
            setChangedFields({}); // Reset changed fields when user data is loaded
        }
    }, [user]);

    const handleChange = (_, allFields) => {
        const changes = allFields.reduce((acc, field) => {
            if (field.touched) {
                acc[field.name[0]] = field.value;
            }
            return acc;
        }, {});
        setChangedFields(changes);
    };

    const handleSubmit = () => {
        // Filter out unchanged fields
        const updates = Object.keys(changedFields).reduce((acc, key) => {
            if (user[key] !== changedFields[key]) {
                acc[key] = changedFields[key];
            }
            return acc;
        }, {});

        if (Object.keys(updates).length > 0) {
            dispatch(updateUserInfo(updates));
            message.success('Profile updated successfully');
        }
    };

    return (
        <>
            <Spin spinning={Object.keys(userProfileState).length === 0}>
                <Form
                    layout="vertical"
                    key={formKey} // Use the dynamic key
                    onFieldsChange={handleChange}
                    onFinish={handleSubmit}
                    initialValues={userProfileState} // Use the state that's updated when user data is loaded
                >
                    {Object.keys(formFields).map(key => {
                        const field = formFields[key];
                        return (
                            <Form.Item key={key} label={field.label} name={key}>
                                {field.type === 'select' ? (
                                    <Select>
                                        {field.options.map(option => (
                                            <Option key={option} value={option}>{option}</Option>
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
            </Spin>
        </>
    );
};

export default UserInfoManager;


// : field.type === 'interests' ? (
//     <Select
//         mode="multiple"
//         style={{ width: '100%' }}
//         placeholder="Select or add interests"
//         onSearch={value => dispatch(searchInterests(value))}
//         // You might also want to control the component's value and options here
//         // For example, using state to manage selected values and dynamically fetched options
//         onChange={(selectedItemIds) => {
//             console.log(selectedItemIds); // Now logging IDs of selected items
//             // Update the user profile state directly with the selected IDs
//             setUserProfileState({
//                 ...userProfileState,
//                 interests: selectedItemIds
//             });
//         }}
//         // value={userProfileState.interests.map(id => {
//         //     const interest = interestsQuery.find(interest => interest.id === id);
//         //     return interest ? interest.name : null;
//         // })}
//         optionLabelProp="label"
//     >
//         {interestsQuery.map((interest) => (
//             <Option key={interest.id} value={interest.id} label={interest.name}>
//                 {interest.name}
//             </Option>
//         ))}
//     </Select>

// ) :