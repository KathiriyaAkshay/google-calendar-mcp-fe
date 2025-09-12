import React from 'react'
import { GoogleLogin } from '@react-oauth/google'
import { Button } from 'antd'
import { GoogleOutlined } from '@ant-design/icons'

// A simple wrapper that shows Google sign-in and calls onSuccess with credential
export default function GoogleSignIn({ onSuccess, onError, text = 'Sign in with Google' }) {
  return (
    <GoogleLogin
      onSuccess={(credentialResponse) => {
        // credentialResponse.credential is a JWT you can send to backend
        if (onSuccess) onSuccess(credentialResponse)
      }}
      onError={(err) => onError && onError(err)}
      size="large"
      useOneTap={false}
      render={({ onClick, disabled }) => (
        <Button
          icon={<GoogleOutlined />}
          onClick={onClick}
          disabled={disabled}
          block
        >
          {text}
        </Button>
      )}
    />
  )
}
