import React, { useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../actions/userActions';
import { Form, Input, Button, Spin, Card, Alert } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import "./RegistrationPage.css";
import { useNavigate } from 'react-router-dom';

const RegistrationPage = () => {
    const dispatch = useDispatch();
    const loading = useSelector(state => state.user.register_loading);
    const errors = useSelector(state => state.user.register_errors);
    const captchaRef = useRef(null);

    const navigate = useNavigate();

    const handleBack = () => {
        navigate('/');
    };

    useEffect(() => {
        if (window.hcaptcha) {
            window.hcaptcha.render(captchaRef.current);
        }
    }, []);

    const onFinish = async (values) => {
        const captchaResponse = 'test'; // Replace with actual captcha response
        dispatch(registerUser(values.phone_number, values.password, captchaResponse));
    };

    const getError = (field) => {
        return errors && errors[field] ? errors[field] : undefined;
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <Card title="Create Account" style={{ width: 400 }} extra={<Button icon={<ArrowLeftOutlined />} onClick={handleBack} />}>
                <Form
                    name="register"
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
                        hasFeedback
                        help={getError('password')}
                        validateStatus={getError('password') ? 'error' : undefined}
                    >
                        <Input.Password placeholder="Password" />
                    </Form.Item>

                    <Form.Item
                        name="confirm_password"
                        dependencies={['password']}
                        hasFeedback
                        rules={[
                            { required: true, message: 'Please confirm your password!' },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('password') === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error('The two passwords do not match!'));
                                },
                            }),
                        ]}
                    >
                        <Input.Password placeholder="Confirm Password" />
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
                            Create Account
                        </Button>
                    </Form.Item>
                </Form>
                {getError("non_field_errors") && <Alert message={getError("non_field_errors")} type="error" showIcon />}
            </Card>
        </div>
    );
};

export default RegistrationPage;
