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

    return (
        <div style={{ maxWidth: 800, margin: "auto" }}>
            <Title level={2} style={{ textAlign: "center" }}>
                {user.full_name}
            </Title>
            <Row gutter={[16, 16]} justify="center">
                {user.pictures.length > 0 && (
                    <Col xs={24} sm={24} md={24} lg={24}>
                        <UserPictureCard image={user.pictures[0].image} />
                    </Col>
                )}
            </Row>
            {user.prompts && user.prompts.length > 0 && (
                <Row
                    gutter={[16, 16]}
                    justify="center"
                    style={{ marginTop: 16 }}
                >
                    {user.prompts.map((prompt, index) => (
                        <Col key={index} span={24}>
                            <Card
                                title={
                                    <div style={{ textAlign: "center" }}>
                                        {prompt.prompt}
                                    </div>
                                }
                            >
                                <Text
                                    style={{
                                        textAlign: "center",
                                        display: "block",
                                    }}
                                >
                                    {prompt.response}
                                </Text>
                            </Card>
                        </Col>
                    ))}
                </Row>
            )}
            <Row gutter={[16, 16]} justify="center" style={{ marginTop: 16 }}>
                <Col span={24}>
                    <List
                        grid={{ gutter: 16, column: 4 }}
                        dataSource={Object.entries(user)
                            .filter(([key]) =>
                                infoFieldMappings.hasOwnProperty(key)
                            )
                            .map(([key, value]) => ({ key, value }))}
                        renderItem={({ key, value }) => {
                            const { displayName, icon } = infoFieldMappings[
                                key
                            ];
                            const IconComponent =
                                typeof icon === "function" ? icon(value) : icon;
                            return (
                                <List.Item>
                                    <Card>
                                        <Text strong>
                                            {IconComponent}
                                            {` ${displayName} `}
                                        </Text>{" "}
                                        <br />
                                        <Text>
                                            {displayUserInfo(key, value)}
                                        </Text>
                                    </Card>
                                </List.Item>
                            );
                        }}
                    />
                </Col>
            </Row>
            {user.interests && user.interests.length > 0 && (
                <Row
                    gutter={[16, 16]}
                    justify="center"
                    style={{ marginBottom: "20px" }}
                >
                    <Col span={24}>
                        <Card title="Interests">
                            {user.interests.map((interest, index) => (
                                <Tag key={index}>
                                    {interest.name || interest}
                                </Tag>
                            ))}
                        </Card>
                    </Col>
                </Row>
            )}
            <Row gutter={[16, 16]} justify="center">
                {user.pictures &&
                    user.pictures.slice(1).map((picture, index) => (
                        <Col key={index} xs={24} sm={24} md={24} lg={24}>
                            <UserPictureCard image={picture.image} />
                        </Col>
                    ))}
            </Row>
        </div>
    );
};

export default UserProfileDisplay;
