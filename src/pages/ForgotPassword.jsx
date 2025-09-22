import React, { useState } from "react";
import { Form, Input, Typography, Button, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import SubmitBtn from "../components/SubmitBtn";
import { useTheme } from "../contexts/ThemeContext";
import { useMutation } from "@tanstack/react-query";
import userAuthentication from "../service/userAuthentication";
import { USER_AUTHENTICATION_MESSAGE } from "../constant/api.constant";

const { Title, Text } = Typography;

function ForgotPassword() {
  const [emailSent, setEmailSent] = useState(true);
  const navigate = useNavigate();
  const { theme } = useTheme();

  const { mutate, isPending: loading } = useMutation({
    mutationFn: (values) => userAuthentication.forgetPasword(values),
    onSuccess: (response) => {
      message.success(USER_AUTHENTICATION_MESSAGE.PASSWORD_FORGOT_SUCCESSFULLY);
      setEmailSent(true);
    },
    onError: (error) => {
      message.error(error?.message || USER_AUTHENTICATION_MESSAGE.COMMON_ERROR_MESSAGE);
    },
  });

  const onFinish = (values) => {
    mutate(values);
  };

  if (emailSent) {
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
                  Check Your Email
                </Title>
                <Text className="visual-subtitle">
                  We've sent password reset instructions to your email address.
                </Text>
              </div>
            </div>
          </div>

          {/* Right Side - Success Message */}
          <div className="auth-form-section">
            <div className="auth-form-wrapper">
              <div className="auth-header">
                <Title level={3} className="form-title">Email Sent!</Title>
                <Text className="form-subtitle">
                  Please check your email and follow the instructions to reset your password.
                </Text>
              </div>

              <div className="forgot-password-success">
                <div className="success-content">
                  <div className="success-icon-container">
                    <div className="success-icon-circle">
                      <svg viewBox="0 0 24 24" fill="none" className="success-icon-svg">
                        <path d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                          stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  </div>
                  <Text className="success-text">
                    If an account with that email exists, you'll receive password reset instructions shortly.
                  </Text>
                </div>

                <div className="success-actions">
                  <Button 
                    type="primary" 
                    block
                    onClick={() => navigate("/login")}
                    className="back-to-login-btn"
                  >
                    Back to Sign In
                  </Button>
                  
                  <div className="try-again-btn"
                    onClick={() => setEmailSent(false)}
                  >
                    Didn't receive the email? Try again
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
                Reset Your Password
              </Title>
              <Text className="visual-subtitle">
                Enter your email address and we'll send you instructions to reset your password.
              </Text>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="auth-form-section">
          <div className="auth-form-wrapper">
            <div className="auth-header">
              <Title level={3} className="form-title">Forgot Password</Title>
              <Text className="form-subtitle">
                No worries, we'll send you reset instructions.
              </Text>
            </div>

            <Form layout="vertical" onFinish={onFinish} className="auth-form">
              <Form.Item
                name="email"
                label="Email"
                rules={[
                  { required: true, message: "Please enter your email" },
                  { type: "email", message: "Please enter a valid email" }
                ]}
              >
                <Input
                  placeholder="Enter your email"
                  className="auth-input"
                  autoComplete="email"
                />
              </Form.Item>

              <Form.Item>
                <SubmitBtn label="Send Reset Instructions" isLoading={loading} htmlType="submit" />
              </Form.Item>

              <div className="auth-footer">
                <Text>Remember your password? </Text>
                <Link to="/login">Back to sign in</Link>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
