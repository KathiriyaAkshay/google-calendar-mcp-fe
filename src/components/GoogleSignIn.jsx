import React from 'react'
import { Button } from 'antd'
import { GoogleOutlined } from '@ant-design/icons'

// A simple wrapper for Google sign-in button
export default function GoogleSignIn({ text = 'Sign in with Google', loading = false, onSuccess }) {
  return (
    <Button
      icon={<GoogleOutlined />}
      onClick={onSuccess}
      className='google-sign-in-button'
      block
      loading={loading}
    >
      {text}
    </Button>
  )
}
