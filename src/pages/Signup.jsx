import React, { useState } from "react";
import { Form, Input, Typography, Divider, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import SubmitBtn from "../components/SubmitBtn";
import GoogleSignIn from "../components/GoogleSignIn";
import { useTheme } from '../contexts/ThemeContext';
import userAuthentication from "../service/userAuthentication";
import { useMutation } from "@tanstack/react-query";
import { USER_AUTHENTICATION_MESSAGE } from "../constant/api.constant";
import  PAGE_ROUTE  from "../constant/page.constant";
import { auth, provider, signInWithPopup } from "../config/firebaseconfig";
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
const { Title, Text } = Typography;

export default function Signup() {
  const navigate = useNavigate();
  const [isSignUpLoading, setIsSignUpLoading] = useState(false);
  const { theme } = useTheme();

  // Register user mutation
  const { mutateAsync: registerUser, isPending: loading } = useMutation({
    mutationFn: (values) => userAuthentication.register(values),
    onSuccess: (response, variables) => {
      if (variables.is_google_signup) {
        message.success(USER_AUTHENTICATION_MESSAGE.SIGNUP_SUCCESSFULLY);
        navigate(PAGE_ROUTE.HOME_ROUTE);
      }
    },
    onError: (error) => {
      message.error(error?.message || USER_AUTHENTICATION_MESSAGE.COMMON_ERROR_MESSAGE);
    },
  });
  

  // Check User email 
  const { mutateAsync: checkUserEmail, isPending: checkingEmail } = useMutation({
    mutationFn: (email) => userAuthentication.checkUserEmail(email),
    onSuccess: (response) => {
      console.log(response);
      return response;
    },
    onError: (error) => {
      message.error(error?.message || USER_AUTHENTICATION_MESSAGE.COMMON_ERROR_MESSAGE);
    },
  });

  // Signup with email and password related functionality handler
  const onSignupFinish = async (values) => {
    try {
      // Check user email 
      const userEmail = await checkUserEmail(values.email);
      if (userEmail.data.exists) {
        message.error(USER_AUTHENTICATION_MESSAGE.USER_ALREADY_EXISTS);
        return;
      } else {
        setIsSignUpLoading(true) ; 
        const userCredential = await createUserWithEmailAndPassword(auth, values.email, values.password);
        await registerUser({
          email: values.email
        });
        setIsSignUpLoading(false) ; 
        message.success(USER_AUTHENTICATION_MESSAGE.VERIFICATION_EMAIL_SENT);
      }
    } catch (error) {
      message.error(error?.message || USER_AUTHENTICATION_MESSAGE.COMMON_ERROR_MESSAGE);
    } finally {
      setIsSignUpLoading(false) ; 
    }
  };

  // Signup with google related functionality handler 
  const SignupWithGoogle = async () => {
    const result = await signInWithPopup(auth, provider);
    
    // Reterive email, token related information 
    const email = result.user.email ; 

    // Register this user in database
    await registerUser({
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
              <Title level={3} className="form-title">Create your account</Title>
              <Text className="form-subtitle">Start your finance management journey today.</Text>
            </div>

            <Form layout="vertical" className="auth-form" onFinish={onSignupFinish}>

              <Form.Item
                name="email"
                label="Email address"
                rules={[{ required: true, message: "Please enter email address" }]}
              >
                <Input placeholder="Enter your email address" className="auth-input" autoComplete="new-email" />
              </Form.Item>

              <Form.Item
                name="password"
                label="Password"
                rules={[{ required: true, message: "Please enter your password" }]}
              >
                <Input.Password placeholder="Enter your password" className="auth-input" autoComplete="new-password" />
              </Form.Item>

              <Form.Item>
                <SubmitBtn label="Create Account" isLoading={isSignUpLoading} htmlType="submit" />
              </Form.Item>

              <Divider className="authentication-divider-section">OR</Divider>

              <Form.Item className="google-sign-in">
                <GoogleSignIn
                  text="Sign up with Google"
                  onSuccess={SignupWithGoogle}
                />
              </Form.Item>

              <div className="auth-footer">
                <Text>Already have an account? </Text>
                <Link to="/login">Sign in</Link>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}
