


import React from 'react';
import { Card, Row, Col, Typography, List } from 'antd';
import UserPictureCard from './UserPictureCard';
import "./UserProfileDisplay.css";

const { Title, Text } = Typography;

const UserProfileDisplay = ({ user }) => {
    const displayUserInfo = (key, value) => {
        if (key === 'birth_date') {
            return new Date(value).toLocaleDateString();
        }
        return value || 'Not Specified';
    };

    const cardStyle = {
        width: 240,
        height: 240,
        margin: 'auto',
        marginTop: 16
    };

    return (
        <div style={{ maxWidth: 800, margin: 'auto' }}>
            <Title level={2} style={{ textAlign: 'center' }}>{user.full_name}</Title>

            <Row gutter={16} justify="center" className="user-card-row">
                <Col>
                    {user && user.pictures && user.pictures.length > 0 && (
                        <UserPictureCard image={user.pictures[0].image} />
                    )}
                </Col>
            </Row>
            <Row gutter={16} justify="center" className="user-card-row">
                <Col span={12}>
                    <Card bordered={false}>
                        <List>
                            {
                                user && Object.entries(user).map(([key, value]) => {
                                    if (key !== "full_name" && key !== "pictures" && key !== "id") {
                                        return (
                                            <List.Item key={key}>
                                                <Text strong>{key.replace(/_/g, ' ').toUpperCase()}:</Text> {displayUserInfo(key, value)}
                                            </List.Item>
                                        );
                                    }
                                    return null;
                                })
                            }
                        </List>
                    </Card>
                </Col>
            </Row>

            {user && user.pictures && user.pictures.slice(1).map((picture, index) => (
                <Row gutter={16} justify="center" key={index} className="user-card-row">
                    <Col>
                        <UserPictureCard image={picture.image} />
                    </Col>
                </Row>
            ))}
        </div>
    );
};

export default UserProfileDisplay;
