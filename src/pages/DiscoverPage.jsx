import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getNextUserProfile, rateUserProfile } from "../actions/datingActions";
import UserProfileDisplay from "../components/UserProfileDisplay";
import { Button, Spin, Alert } from "antd";
import { DislikeOutlined, LikeOutlined } from "@ant-design/icons";

const DiscoverPage = () => {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.dating.next_user);
    const loading = useSelector((state) => state.dating.next_user_loading);
    const error = useSelector((state) => state.dating.next_user_error);

    useEffect(() => {
        dispatch(getNextUserProfile());
    }, [dispatch]);

    const handleRate = (action) => {
        if (user && user.id) {
            dispatch(rateUserProfile(user.id, action));
        }
    };

    if (loading) {
        return <Spin size="large" />;
    }

    if (error) {
        return <Alert message={error.message} type="error" />;
    }

    return (
        <div style={{ position: "relative", paddingBottom: "80px" }}>
            {user && <UserProfileDisplay user={user} />}
            <div
                style={{
                    position: "fixed",
                    left: "50%",
                    bottom: "20px",
                    transform: "translateX(-50%)",
                    zIndex: 1000,
                }}
            >
                <Button
                    icon={<DislikeOutlined />}
                    onClick={() => handleRate("dislike")}
                    type="primary"
                    shape="circle"
                    size="large"
                    style={{
                        marginRight: "10px",
                    }}
                />
                <Button
                    icon={<LikeOutlined />}
                    onClick={() => handleRate("like")}
                    type="primary"
                    shape="circle"
                    size="large"
                    style={{
                        marginLeft: "10px",
                    }}
                />
            </div>
        </div>
    );
};

export default DiscoverPage;
