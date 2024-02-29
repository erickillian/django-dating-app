import React, { useState, useEffect } from "react";
import { Card, Button, Modal, Tabs, List, Input, Spin, Row, Col } from "antd";
import { PlusOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { useSelector, useDispatch } from "react-redux";
import {
    fetchPrompts,
    fetchPromptsCategories,
    createUserPromptResponse,
} from "../actions/userActions";

const UserPromptsManager = () => {
    const dispatch = useDispatch();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [activePrompt, setActivePrompt] = useState(null);
    const [responseText, setResponseText] = useState("");
    const [responses, setResponses] = useState([]);
    const [myPrompts, setMyPrompts] = useState([]);
    const [openCategory, setOpenCategory] = useState(null);

    const promptsLoading = useSelector((state) => state.user.prompts_loading);
    const promptCategories = useSelector(
        (state) => state.user.prompt_categories || []
    );
    const prompts = useSelector((state) => state.user.prompts);
    const user = useSelector((state) => state.user.user_profile);

    // Fetch categories on mount if not already loaded
    useEffect(() => {
        if (promptCategories.length === 0) {
            dispatch(fetchPromptsCategories());
        }
    }, [dispatch]);

    useEffect(() => {
        if (user) {
            setMyPrompts(user.prompts);
        }
    }, [user]);

    useEffect(() => {
        if (prompts[openCategory] === undefined) {
            dispatch(fetchPrompts(openCategory));
        }
    }, [openCategory]);

    const showModal = () => {
        setOpenCategory(promptCategories[0]);
        setIsModalVisible(true);
        resetActivePrompt();
    };

    const resetActivePrompt = () => {
        setActivePrompt(null);
        setResponseText("");
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        resetActivePrompt();
    };

    const selectPrompt = (prompt) => {
        setActivePrompt(prompt);
    };

    const handlePromptDelete = (prompt) => {
        console.log(prompt);
    };

    const submitResponse = () => {
        if (myPrompts.length < 3) {
            const data = {
                prompt: activePrompt.id,
                response: responseText,
                order: myPrompts.length,
            };

            dispatch(createUserPromptResponse(data));
            handleCancel(); // Close modal and reset after submission
        } else {
            alert("Maximum of 3 responses reached");
        }
    };

    const listOfPrompts = (category) => {
        return promptsLoading[category] ? (
            <Spin />
        ) : (
            <List
                dataSource={prompts[category] || []}
                renderItem={(item) => (
                    <List.Item
                        key={item.id}
                        onClick={() => {
                            selectPrompt(item);
                        }}
                        style={{
                            cursor: "pointer",
                            backgroundColor:
                                activePrompt?.id === item.id
                                    ? "#e6f7ff"
                                    : "transparent",
                        }}
                    >
                        {item.text}
                    </List.Item>
                )}
            />
        );
    };

    const renderPromptSelection = () => (
        <Tabs
            defaultActiveKey="0"
            items={promptCategories.map((category, i) => {
                const id = String(i);
                return {
                    key: id, // Corrected from `category` to `key`
                    label: `${category}`,
                    children: listOfPrompts(category),
                };
            })}
            animated
            onChange={(category) => {
                setOpenCategory(promptCategories[category]);
            }}
            tabPosition="left"
        />
    );

    const renderResponseInput = () => (
        <div>
            <h3>{activePrompt?.text}</h3>
            <Input.TextArea
                rows={4}
                value={responseText}
                onChange={(e) => setResponseText(e.target.value)}
                placeholder="Write your response here..."
            />
            <div
                style={{
                    marginTop: "10px",
                    display: "flex",
                    justifyContent: "space-between",
                }}
            >
                <Button onClick={() => setActivePrompt(null)}>Back</Button>
                <Button type="primary" onClick={submitResponse}>
                    Submit Response
                </Button>
            </div>
        </div>
    );

    return (
        <Card title="Your Prompts">
            <Row gutter={[16, 16]}>
                {myPrompts.map((prompt, index) => (
                    <Col>
                        <Card
                            key={index}
                            title={prompt.prompt}
                            actions={[
                                <EditOutlined />,
                                <DeleteOutlined
                                    key="delete"
                                    onClick={() => {
                                        handlePromptDelete(prompt);
                                    }}
                                />,
                            ]}
                        >
                            {prompt.response}
                        </Card>
                    </Col>
                ))}
                <Col>
                    <Card
                        onClick={showModal}
                        hoverable
                        style={{
                            width: "100%",
                            height: "100%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: "pointer",
                        }}
                        onMouseDown={(e) => {
                            e.currentTarget.style.backgroundColor = "#f0f0f0";
                        }}
                        onMouseUp={(e) => {
                            e.currentTarget.style.backgroundColor = "#fff";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = "#fff";
                        }}
                    >
                        <PlusOutlined style={{ fontSize: "24px" }} />
                        <span style={{ marginLeft: "8px" }}>Add Prompt</span>
                    </Card>
                </Col>
            </Row>
            <Modal
                title="Select a Prompt"
                open={isModalVisible}
                onCancel={handleCancel}
                footer={null}
                width={800}
            >
                {activePrompt ? renderResponseInput() : renderPromptSelection()}
            </Modal>
        </Card>
    );
};

export default UserPromptsManager;
