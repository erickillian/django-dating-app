import React from 'react';
import { Card, Row, Col, Typography, List } from 'antd';
import {
    UserOutlined,
    CalendarOutlined,
    HeartOutlined,
    GlobalOutlined,
    ColumnHeightOutlined,
    ManOutlined,
    WomanOutlined,
    TeamOutlined,
} from '@ant-design/icons';
import UserPictureCard from './UserPictureCard';
import "./UserProfileDisplay.css";

const { Title, Text } = Typography;

const infoFieldMappings = {
    location: { displayName: 'Location', icon: <GlobalOutlined /> },
    sexual_orientation: { displayName: 'Sexual Orientation', icon: <UserOutlined /> },
    gender: {
        displayName: 'Gender',
        icon: (value) => {
            if (value === 'Male') {
                return <ManOutlined />;
            } else if (value === 'Female') {
                return <WomanOutlined />;
            } else {
                // For other cases or unspecified gender, use a neutral icon
                return <TeamOutlined />;
            }
        },
    },
    age: { displayName: 'Age', icon: <CalendarOutlined /> },
    height: { displayName: 'Height', icon: <ColumnHeightOutlined /> },
};


const UserProfileDisplay = ({ user }) => {
    const displayUserInfo = (key, value) => {
        if (key === 'birth_date') {
            return new Date(value).toLocaleDateString();
        } else if (key === 'interests' || key === 'prompts') {
            return value.map((item, index) => <div key={index}>{item.name}</div>);
        }
        return value || 'Not Specified';
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
            {/* Display prompts between pictures 1 and 2, 3 and 4, 5 and 6 */}
            {(user.prompts && user.prompts.length > 0) && (
                <Row gutter={16} justify="center" style={{ width: '100%' }}>
                    {[1, 3, 5].map((index) => (
                        <Col key={index} span={24}>
                            {user.prompts[index - 1] && (
                                <Card style={{ width: '100%' }} title={<div style={{ textAlign: 'center' }}>{user.prompts[index - 1].prompt}</div>}>
                                    <Text style={{ textAlign: 'center', display: 'block' }}>{user.prompts[index - 1].response}</Text>
                                </Card>
                            )}
                        </Col>
                    ))}
                </Row>
            )}
            <Row gutter={16} justify="center" className="user-info-row" style={{ width: '100%' }}>
                <List
                    grid={{ gutter: 16, xs: 1, sm: 2, md: 4, lg: 4, xl: 4, xxl: 4 }}
                    dataSource={
                        Object.entries(user)
                            .filter(([key]) => infoFieldMappings.hasOwnProperty(key))
                            .map(([key, value]) => ({ key, value }))
                    }
                    renderItem={({ key, value }) => {
                        const { displayName, icon } = infoFieldMappings[key];
                        const IconComponent = typeof icon === 'function' ? icon(value) : icon;
                        return (
                            <List.Item key={key}>
                                <Card>
                                    <Text strong>{IconComponent}{` ${displayName}: `}</Text> {displayUserInfo(key, value)}
                                </Card>
                            </List.Item>
                        );
                    }}
                />

            </Row>
            <Row gutter={16} justify="center" className="user-card-row">
                {user && user.pictures && user.pictures.slice(1).map((picture, index) => (
                    <Col key={index}>
                        <UserPictureCard image={picture.image} />
                    </Col>
                ))}
            </Row>
        </div>
    );
};

export default UserProfileDisplay;
