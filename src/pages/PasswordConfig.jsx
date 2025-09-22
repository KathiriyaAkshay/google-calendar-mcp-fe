import React from "react";
import { Form, Input, Typography, Card, message, Alert } from "antd";
import { useNavigate, useSearchParams } from "react-router-dom";
import SubmitBtn from "../components/SubmitBtn";
import { useTheme } from '../contexts/ThemeContext';
import userAuthentication from "../service/userAuthentication";
import { useMutation } from "@tanstack/react-query";
import { LockOutlined, CheckCircleOutlined } from "@ant-design/icons";
import { USER_AUTHENTICATION_MESSAGE } from "../constant/api.constant";

const { Title, Text } = Typography;

export default function PasswordConfig() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const { theme } = useTheme();

    // Set New Password Mutation
    const setPasswordMutation = useMutation({
        mutationFn: (values) => userAuthentication.verifyEmail(values),
        onSuccess: () => {
            message.success(USER_AUTHENTICATION_MESSAGE.PASSWORD_SET_SUCCESSFULLY);
        },
        onError: (error) => {
            message.error(error?.message || USER_AUTHENTICATION_MESSAGE.COMMON_ERROR_MESSAGE);
        },
    });

    // Handle Set Password Form Submit
    const onSetPasswordFinish = (values) => {
        setPasswordMutation.mutate({
            token: token,
            password: values.password,
        });
    };

    return (
        <div className="auth-page-split" data-theme={theme}>
            <div className="auth-split-container">
                {/* Left Side - Illustration */}
                <div className="auth-visual-section">
                    <div className="auth-visual-content">
                        <div className="auth-illustration">
                            <img
                                src="https://bs-uploads.toptal.io/blackfish-uploads/portfolio_item_attachment/662681/image/original/optimized-front-0157c9f15302f6c329f16d7a11f06e32.jpg"
                                alt="Google Calendar MCP Interface"
                                className="calendar-illustration-img"
                            />
                        </div>
                        <div className="auth-visual-text">
                            <Title level={2} className="visual-title">
                                Set Your Password
                            </Title>
                            <Text className="visual-subtitle">
                                Create a strong password to secure your account and protect your data.
                            </Text>
                        </div>
                    </div>
                </div>

                {/* Right Side - Form */}
                <div className="auth-form-section">
                    <div className="auth-form-wrapper">
                        <div className="auth-header">
                            <Title level={3} className="form-title">Set New Password</Title>
                            <Text className="form-subtitle">Choose a strong, unique password for your account.</Text>
                        </div>

                        <Form
                            layout="vertical"
                            onFinish={onSetPasswordFinish}
                            className="auth-form password-form"
                        >
                            <Form.Item
                                name="password"
                                label="New Password"
                                rules={[
                                    { required: true, message: "Please enter your new password" },
                                    { min: 8, message: "Password must be at least 8 characters" },
                                    {
                                        pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
                                        message: "Password must meet all requirements"
                                    }
                                ]}
                            >
                                <Input.Password
                                    prefix={<LockOutlined />}
                                    placeholder="Enter your new password"
                                    className="auth-input"
                                    autoComplete="new-password"
                                />
                            </Form.Item>

                            <Form.Item
                                name="confirmPassword"
                                label="Confirm Password"
                                dependencies={['password']}
                                rules={[
                                    { required: true, message: "Please confirm your password" },
                                    ({ getFieldValue }) => ({
                                        validator(_, value) {
                                            if (!value || getFieldValue('password') === value) {
                                                return Promise.resolve();
                                            }
                                            return Promise.reject(new Error('The two passwords do not match'));
                                        },
                                    }),
                                ]}
                            >
                                <Input.Password
                                    prefix={<LockOutlined />}
                                    placeholder="Confirm your password"
                                    className="auth-input"
                                    autoComplete="new-password"
                                />
                            </Form.Item>

                            <Alert
                                message="Password must be at least 8 characters long and include uppercase, lowercase, number, and special character."
                                type="info"
                                showIcon
                                icon={<LockOutlined />}
                                className="password-requirements-alert"
                            />

                            <Form.Item className="submit-button-container">
                                <SubmitBtn
                                    label="Set Password"
                                    isLoading={setPasswordMutation.isPending}
                                    htmlType="submit"
                                />
                            </Form.Item>
                        </Form>
                    </div>
                </div>
            </div>
        </div>
    );
}
