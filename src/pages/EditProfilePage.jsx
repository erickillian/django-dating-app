import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchUserInfo } from "../actions/userActions";
import UserPicturesManager from "../components/UserPicturesManager";
import UserInfoManager from "../components/UserInfoManager";
import UserPromptsManager from "../components/UserPromptsManager";
import ProfileCompleteness from "../components/ProfileCompleteness";
import { Row, Col, Card } from "antd";

const ProfilePage = () => {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user.user_profile);
    const loading = useSelector((state) => state.user.loading);
    const error = useSelector((state) => state.user.error);

    useEffect(() => {
        if (!user) {
            dispatch(fetchUserInfo());
        }
    }, [dispatch, user]);

    if (!user) {
        return <div>Loading...</div>;
    } else if (error) {
        return <div>Error: {error}</div>;
    } else {
        return (
            <>
                <Row gutter={[16, 16]} justify="center">
                    <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                        <ProfileCompleteness
                            completeness={user.profile_completeness}
                        />
                    </Col>
                    <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                        <UserPicturesManager />
                    </Col>
                    <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                        <UserPromptsManager />
                    </Col>
                    <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                        <Card title="Edit Profile" bordered={false}>
                            <UserInfoManager
                                user={user}
                                loading={loading}
                                error={error}
                            />
                        </Card>
                    </Col>
                </Row>
            </>
        );
    }
};

export default ProfilePage;
