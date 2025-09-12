import React, { useState } from "react";
import { Form, Input, Typography, Button } from "antd";
import { Link, useNavigate } from "react-router-dom";
import SubmitBtn from "../components/SubmitBtn";
import { useTheme } from "../contexts/ThemeContext";

const { Title, Text } = Typography;

function ForgotPassword() {
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const navigate = useNavigate();
  const { theme } = useTheme();

  const onFinish = (values) => {
    setLoading(true);
    // TODO: call your forgot password API
    setTimeout(() => {
      setLoading(false);
      setEmailSent(true);
    }, 1000);
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
                  <div className="success-icon">✓</div>
                  <Text className="success-text">
                    If an account with that email exists, you'll receive password reset instructions shortly.
                  </Text>
                </div>

                <div className="auth-footer">
                  <Text>Remember your password? </Text>
                  <Link to="/login">Back to sign in</Link>
                </div>

                <div className="auth-footer">
                  <Text>Didn't receive the email? </Text>
                  <Button 
                    type="link" 
                    onClick={() => setEmailSent(false)}
                    className="resend-link"
                  >
                    Try again
                  </Button>
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
                <SubmitBtn label="Send Reset Instructions" isLoading={loading} />
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
