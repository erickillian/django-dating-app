import React from "react";
import { Card, Row, Col, Typography, List, Tag } from "antd";
import {
    GlobalOutlined,
    UserOutlined,
    ManOutlined,
    WomanOutlined,
    TeamOutlined,
    CalendarOutlined,
    ColumnHeightOutlined,
} from "@ant-design/icons";
import UserPictureCard from "./UserPictureCard";
import "./UserProfileDisplay.css";

const { Title, Text } = Typography;

const infoFieldMappings = {
    location: { displayName: "Location", icon: <GlobalOutlined /> },
    sexual_orientation: {
        displayName: "Sexual Orientation",
        icon: <UserOutlined />,
    },
    gender: {
        displayName: "Gender",
        icon: (value) =>
            value === "Male" ? (
                <ManOutlined />
            ) : value === "Female" ? (
                <WomanOutlined />
            ) : (
                <TeamOutlined />
            ),
    },
    age: { displayName: "Age", icon: <CalendarOutlined /> },
    height: { displayName: "Height", icon: <ColumnHeightOutlined /> },
};

const UserProfileDisplay = ({ user }) => {
    const renderHeader = () => (
        <Title level={2} style={{ textAlign: "center" }}>
            {user.full_name}
        </Title>
    );

    const displayUserInfo = (key, value) => {
        if (key === "birth_date") {
            return new Date(value).toLocaleDateString();
        } else if (key === "interests" || key === "prompts") {
            return value.map((item, index) => (
                <div key={index}>{item.name}</div>
            ));
        }
        return value || "Not Specified";
    };

    const renderUserInfo = () => (
        <Row
            gutter={[16, 16]}
            justify="center"
            style={{ marginTop: 16 }}
            key="user-info"
        >
            <Col span={24}>
                <List
                    grid={{ gutter: 16, column: 4 }}
                    dataSource={Object.entries(user)
                        .filter(([key]) =>
                            infoFieldMappings.hasOwnProperty(key)
                        )
                        .map(([key, value]) => ({ key, value }))}
                    renderItem={({ key, value }) => {
                        const { displayName, icon } = infoFieldMappings[key];
                        const IconComponent =
                            typeof icon === "function" ? icon(value) : icon;
                        return (
                            <List.Item>
                                <Card>
                                    <Text strong>
                                        {IconComponent} {` ${displayName} `}
                                    </Text>{" "}
                                    <br />
                                    <Text>{displayUserInfo(key, value)}</Text>
                                </Card>
                            </List.Item>
                        );
                    }}
                />
            </Col>
        </Row>
    );

    const renderPicture = (picture, index) => (
        <Row
            gutter={[16, 16]}
            justify="center"
            style={{ marginTop: 16 }}
            key={`picture-${index}`}
        >
            <Col key={index} xs={24} sm={24} md={24} lg={24}>
                <UserPictureCard image={picture.image} />
            </Col>
        </Row>
    );

    const renderPrompt = (prompt, index) => (
        <Row
            gutter={[16, 16]}
            justify="center"
            style={{ marginTop: 16 }}
            key={`prompt-${index}`}
        >
            <Col key={index} span={24}>
                <Card
                    title={
                        <div style={{ textAlign: "center" }}>
                            {prompt.prompt}
                        </div>
                    }
                >
                    <Text style={{ textAlign: "center", display: "block" }}>
                        {prompt.response}
                    </Text>
                </Card>
            </Col>
        </Row>
    );

    const renderContent = () => {
        const elements = [];
        const prompts = user.prompts || [];
        const pictures = user.pictures || [];

        // Start with a picture if available
        if (pictures.length > 0) {
            elements.push(renderPicture(pictures[0], 0));
        }

        // Render user info next
        elements.push(renderUserInfo());

        // If there's at least one prompt, render the first prompt next
        if (prompts.length > 0) {
            elements.push(renderPrompt(prompts[0], 0));
        }

        // Continue with the rest of the pictures and prompts
        let pictureIndex = 1; // Start from the second picture
        for (let i = 1; i < Math.max(prompts.length, pictures.length); i++) {
            if (i < pictures.length) {
                elements.push(
                    renderPicture(pictures[pictureIndex++], pictureIndex)
                );
            }
            if (i < prompts.length) {
                elements.push(renderPrompt(prompts[i], i));
            }
        }

        return elements;
    };

    return (
        <div style={{ maxWidth: 800, margin: "auto" }}>
            {renderHeader()}
            {renderContent()}
        </div>
    );
};

export default UserProfileDisplay;
