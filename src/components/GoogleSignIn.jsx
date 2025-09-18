import React from 'react'
import { Button } from 'antd'
import { GoogleOutlined } from '@ant-design/icons'

// A simple wrapper for Google sign-in button
export default function GoogleSignIn({ onSuccess, onError, text = 'Sign in with Google' }) {
  const handleClick = () => {
    if (onSuccess) onSuccess({ credential: 'mock-credential' })
  }

  return (
    <Button
      icon={<GoogleOutlined />}
      onClick={handleClick}
      className='google-sign-in-button'
      block
    >
      {text}
    </Button>
  )
}
