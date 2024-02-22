import React, { useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../actions/userActions';
import { Form, Input, Button, Spin, Card, Alert } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { LoadingOutlined } from '@ant-design/icons';
import "./LoginPage.css";
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const LoginPage = () => {
    const dispatch = useDispatch();
    const loading = useSelector(state => state.user.auth_loading);
    const errors = useSelector(state => state.user.auth_errors);
    const captchaRef = useRef(null);

    const navigate = useNavigate(); // Create navigate function

    // Function to handle back navigation
    const handleBack = () => {
        navigate('/'); // Navigate to the homepage or any other route
    };

    useEffect(() => {
        if (window.hcaptcha) {
            window.hcaptcha.render(captchaRef.current);
        }
    }, []);

    const onFinish = async (values) => {
        const captchaResponse = 'test'; // Replace with actual captcha response
        dispatch(loginUser(values.phone_number, values.password, captchaResponse));
    };

    // Helper function to display the first error for a field
    const getError = (field) => {
        return errors && errors[field] ? errors[field] : undefined;
    };


    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <Card title="Login" style={{ width: 400 }} extra={<Button icon={<ArrowLeftOutlined />} onClick={handleBack} />}>
                <Form
                    name="login"
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                >
                    <Form.Item
                        name="phone_number"
                        rules={[{ required: true, message: 'Phone number required' }]}
                        help={getError('phone_number')}
                        validateStatus={getError('phone_number') ? 'error' : undefined}
                    >
                        <Input placeholder="Phone Number" />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        rules={[{ required: true, message: 'Password required' }]}
                        help={getError('password')}
                        validateStatus={getError('password') ? 'error' : undefined}
                    >
                        <Input.Password placeholder="Password" />
                    </Form.Item>

                    <Form.Item
                        name="captcha"
                        help={getError('captcha')}
                        validateStatus={getError('captcha') ? 'error' : undefined}
                        className="captcha-container"
                    >
                        <div ref={captchaRef} className="h-captcha" data-sitekey="0951ef00-8bbd-460b-8325-f2113addb774"></div>
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" block loading={loading}>
                            Log In
                        </Button>
                    </Form.Item>
                </Form>
                {getError("non_field_errors") && <Alert message={getError("non_field_errors")} type="error" showIcon />}
            </Card>

        </div>
    );
};

export default LoginPage;
