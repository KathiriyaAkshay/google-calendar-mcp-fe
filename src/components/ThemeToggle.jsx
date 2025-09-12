import React from 'react'
import { Button } from 'antd'
import { SunOutlined, MoonOutlined } from '@ant-design/icons'
import { useTheme } from '../contexts/ThemeContext'

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <Button
      className="theme-toggle"
      onClick={toggleTheme}
      icon={theme === 'dark' ? <MoonOutlined /> : <SunOutlined />}
      size="small"
    >
      {theme === 'dark' ? 'Dark' : 'Light'}
    </Button>
  )
}
