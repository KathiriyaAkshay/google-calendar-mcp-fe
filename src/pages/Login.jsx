import React, { useState } from "react";
import {
  Card,
  Form,
  Input,
  Button,
  Checkbox,
  Row,
  Col,
  Typography,
  Divider,
  message
} from "antd";
import { Link, useNavigate } from "react-router-dom";
import SubmitBtn from "../components/SubmitBtn";
import GoogleSignIn from "../components/GoogleSignIn";
import { useTheme } from "../contexts/ThemeContext";
import userAuthentication from "../service/userAuthentication";
import { useMutation } from "@tanstack/react-query";
import { USER_AUTHENTICATION_MESSAGE } from "../constant/api.constant";
import { auth, provider, signInWithPopup } from "../config/firebaseconfig";
import PAGE_ROUTE from "../constant/page.constant";

const { Title, Text } = Typography;

export default function Login() {
  const navigate = useNavigate();
  const { theme } = useTheme();

  const { mutate: userLogin, isPending: loading } = useMutation({
    mutationFn: (values) => userAuthentication.login(values),
    onSuccess: (response) => {
      message.success(USER_AUTHENTICATION_MESSAGE.USER_LOGIN_SUCCESSFULLY);
      localStorage.setItem('auth_token', response.data.access_token);
      navigate(PAGE_ROUTE.HOME_ROUTE);
    },
    onError: (error) => {
      message.error(error?.message || USER_AUTHENTICATION_MESSAGE.COMMON_ERROR_MESSAGE);
    },
  });

  const onFinish = async (values) => {
    userLogin(values);
  };

  // Google signin related functionality 
  const LoginWithGoogle = async () => {
    const result = await signInWithPopup(auth, provider);
    
    // Reterive email, token related information 
    const email = result.user.email ; 

    userLogin({
      email: email,
      is_google_signup: true
    });
    
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
                Welcome to Google Calendar MCP
              </Title>
              <Text className="visual-subtitle">
                Simplify scheduling and collaboration with AI-powered automation, smart reminders, and seamless calendar management.
              </Text>
            </div>

          </div>
        </div>

        {/* Right Side - Form */}
        <div className="auth-form-section">
          <div className="auth-form-wrapper">
            <div className="auth-header">
              <Title level={3} className="form-title">Sign in</Title>
              <Text className="form-subtitle">Welcome back! Please enter your details.</Text>
            </div>

            <Form layout="vertical" onFinish={onFinish} className="auth-form">
              <Form.Item
                name="email"
                label="Email address"
                rules={[{ required: true, message: "Please enter email" }]}
              >
                <Input
                  placeholder="Enter your email"
                  className="auth-input"
                  autoComplete="email"
                />
              </Form.Item>

              <div style={{
                marginTop: "20px"
              }}>
                <Form.Item
                  name="password"
                  label="Password"
                  rules={[{ required: true, message: "Please enter password" }]}
                >
                  <Input.Password
                    placeholder="Enter your password"
                    className="auth-input"
                    autoComplete="current-password"
                  />
                </Form.Item>
              </div>

              <div className="form-options">
                <Checkbox>Keep me logged in</Checkbox>
                <Link to="/forgot-password" className="forgot-link">
                  Forgot password?
                </Link>
              </div>

              <Form.Item style={{
                marginTop: "15px"
              }}>
                <SubmitBtn label="Sign in" isLoading={loading} htmlType="submit" />
              </Form.Item>

              <Divider className="authentication-divider-section">OR</Divider>

              <Form.Item className="google-sign-in">
                <GoogleSignIn
                  text="Sign in with Google"
                  onSuccess={LoginWithGoogle}
                />
              </Form.Item>

              <div className="auth-footer">
                <Text>Don&apos;t have an account? </Text>
                <Link to="/signup">Sign up for free</Link>
              </div>
            </Form>
          </div>
        </div>

      </div>
    </div>
  );
}
