import React, { useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../actions/userActions';
import { Form, Input, Button, Spin, Card, Alert } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import "./LoginPage.css";

const LoginPage = () => {
    const dispatch = useDispatch();
    const loading = useSelector(state => state.user.auth_loading);
    const errors = useSelector(state => state.user.auth_errors);
    const captchaRef = useRef(null);

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
            <Card title="Login" style={{ width: 400 }}>
                <Form
                    name="login"
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                >
                    <Form.Item
                        name="phone_number"
                        rules={[{ required: true, message: 'Please input your phone number!' }]}
                        help={getError('phone_number')}
                        validateStatus={getError('phone_number') ? 'error' : undefined}
                    >
                        <Input placeholder="Phone Number" />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        rules={[{ required: true, message: 'Please input your password!' }]}
                        help={getError('password')}
                        validateStatus={getError('password') ? 'error' : undefined}
                    >
                        <Input.Password placeholder="Password" />
                    </Form.Item>

                    <div className="captcha-container">
                        <div ref={captchaRef} className="h-captcha" data-sitekey="0951ef00-8bbd-460b-8325-f2113addb774"></div>
                    </div>

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
