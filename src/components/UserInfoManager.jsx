import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    updateUserInfo,
    searchInterests,
    searchLanguages,
    searchNationalities,
} from "../actions/userActions";
import {
    Card,
    Form,
    Input,
    Select,
    Button,
    Spin,
    Checkbox,
    message,
} from "antd";

const { Option } = Select;

const UserInfoManager = () => {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user.user_profile);
    const errors = useSelector((state) => state.user.user_profile_error);
    const interestsQuery = useSelector((state) => state.user.interests_query);
    const nationaltiesQuery = useSelector(
        (state) => state.user.nationalities_query
    );
    const languagesQuery = useSelector((state) => state.user.languages_query);
    const [userProfileState, setUserProfileState] = useState({});
    const [changedFields, setChangedFields] = useState({});
    const [formKey, setFormKey] = useState(Date.now()); // Using Date.now() to generate a unique key

    const formFields = {
        full_name: {
            label: "Name",
            type: "text",
            options: [],
            visability: "none",
        },
        birth_date: {
            label: "Birth Date",
            type: "date",
            options: [],
            visability: "none",
        },
        gender: {
            label: "Gender",
            type: "select",
            options: ["Male", "Female", "Other", "Prefer not to say"],
            visability: "controlable",
        },
        sexual_orientation: {
            label: "Sexual Orientation",
            type: "select",
            options: [
                "Straight",
                "Gay",
                "Bisexual",
                "Other",
                "Prefer not to say",
            ],
            visability: "controlable",
        },
        height: {
            label: "Height (in cm)",
            type: "number",
            options: [],
            visability: "controlable",
        },
        occupation: {
            label: "Occupation",
            type: "text",
            options: [],
            visability: "controlable",
        },
        education: {
            label: "Education",
            type: "text",
            options: [],
            visability: "controlable",
        },
        looking_for: {
            label: "Looking For",
            type: "select",
            options: [
                "Long-term relationship",
                "Long-term open to short-term",
                "Short-term open to long-term",
                "Short-term relationship",
                "Friendship",
                "Other",
            ],
            visability: "controlable",
        },
        eye_color: {
            label: "Eye Color",
            type: "select",
            options: ["Brown", "Blue", "Green", "Hazel", "Grey", "Other"],
            visability: "controlable",
        },
        hair_color: {
            label: "Hair Color",
            type: "select",
            options: ["Black", "Brown", "Blonde", "Red", "Grey", "Other"],
            visability: "controlable",
        },
        ethnicity: {
            label: "Ethnicity",
            type: "select",
            options: [
                "Asian",
                "Black or African American",
                "Hispanic or Latino",
                "White",
                "Native American",
                "Pacific Islander",
                "Middle Eastern",
                "Mixed",
                "Other",
                "Prefer not to say",
                "Not applicable",
            ],
            visability: "controlable",
        },
        interests: {
            label: "Interests",
            type: "tags",
            options: [],
            search: searchInterests,
            query: interestsQuery,
            max: 6,
            visability: "controlable",
        },
        languages: {
            label: "Languages",
            type: "tags",
            options: [],
            search: searchLanguages,
            query: languagesQuery,
            max: 4,
            visability: "controlable",
        },
        nationalities: {
            label: "Nationalities",
            type: "tags",
            options: [],
            search: searchNationalities,
            query: nationaltiesQuery,
            max: 4,
            visability: "controlable",
        },
    };

    useEffect(() => {
        if (user) {
            setUserProfileState({
                ...user,
            });
            setFormKey(Date.now()); // Update key to force re-render
            setChangedFields({}); // Reset changed fields when user data is loaded
        }
    }, [user]);

    const handleChange = (_, allFields) => {
        const changes = allFields.reduce((acc, field) => {
            if (field.name[0] === "interests_names") {
                return;
            }
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

        if (updates.birth_date === "") {
            updates.birth_date = null;
        }

        // Iterate over the properties and change any ones that are "Prefer not to say" to ""
        for (const key in updates) {
            if (updates[key] === "Prefer not to say") {
                updates[key] = "";
            }
        }

        if (updates.height === "") {
            updates.height = null;
        }

        if (Object.keys(updates).length > 0) {
            dispatch(updateUserInfo(updates));
            message.success("Profile updated successfully");
        }
    };

    return (
        <>
            <Card title="Basic Information" bordered={false}>
                <Spin spinning={Object.keys(userProfileState).length === 0}>
                    <Form
                        layout="vertical"
                        key={formKey} // Use the dynamic key
                        onFieldsChange={handleChange}
                        onFinish={handleSubmit}
                        initialValues={userProfileState} // Use the state that's updated when user data is loaded
                    >
                        {Object.keys(formFields).map((key) => {
                            const field = formFields[key];
                            const err = errors?.[key]
                                ? [{ errors: [errors[key]] }]
                                : [];
                            return (
                                <>
                                    <Form.Item
                                        key={key}
                                        label={field.label}
                                        name={key}
                                        rules={[
                                            {
                                                required: field.required,
                                                message: `Please input your ${field.label}!`,
                                            },
                                        ]}
                                        // Add this line to show validation feedback based on `err`
                                        validateStatus={
                                            err.length > 0 ? "error" : ""
                                        }
                                        help={
                                            err.length > 0 ? errors[key] : null
                                        }
                                    >
                                        {field.type === "select" ? (
                                            <Select>
                                                {field.options.map((option) => (
                                                    <Option
                                                        key={option}
                                                        value={option}
                                                    >
                                                        {option}
                                                    </Option>
                                                ))}
                                            </Select>
                                        ) : field.type === "tags" ? (
                                            <Select
                                                mode="multiple"
                                                style={{ width: "100%" }}
                                                placeholder="Select or add interests"
                                                maxCount={field.max}
                                                onSearch={(value) =>
                                                    dispatch(
                                                        field.search(value)
                                                    )
                                                }
                                                optionLabelProp="label"
                                                notFoundContent={null}
                                            >
                                                {field.query.length > 0 &&
                                                    field.query.map(
                                                        (interest) => (
                                                            <Option
                                                                key={
                                                                    interest.id
                                                                }
                                                                value={
                                                                    interest.name
                                                                }
                                                                label={
                                                                    interest.name
                                                                }
                                                            >
                                                                {interest.name}
                                                            </Option>
                                                        )
                                                    )}
                                            </Select>
                                        ) : (
                                            <Input type={field.type} />
                                        )}
                                    </Form.Item>
                                    {field.visibility === "controlable" && (
                                        <Form.Item
                                            name={`${key}_visible`}
                                            valuePropName="checked"
                                        >
                                            <Checkbox>
                                                Show {field.label}
                                            </Checkbox>
                                        </Form.Item>
                                    )}
                                </>
                            );
                        })}
                        <Button type="primary" htmlType="submit">
                            Save Changes
                        </Button>
                    </Form>
                </Spin>
            </Card>
        </>
    );
};

export default UserInfoManager;
