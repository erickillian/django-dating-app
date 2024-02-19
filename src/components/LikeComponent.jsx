import React from 'react';
import UserPictureCard from './UserPictureCard';

import { Row, Col, Typography } from 'antd';
const { Title } = Typography;

const LikeComponent = ({ like }) => {
    return (
        <div style={{ maxWidth: 800, margin: 'auto' }} key={like.rater.id}>
            <Title level={2} style={{ textAlign: 'center' }}>{like.rater.full_name}</Title>
            <Row gutter={16} justify="center" className="user-card-row">
                <Col>
                    {like && like.rater.pictures && like.rater.pictures.length > 0 && (
                        <UserPictureCard image={like.rater.pictures[0].image} />
                    )}
                </Col>
            </Row>
        </div>
    );
};

export default LikeComponent;
