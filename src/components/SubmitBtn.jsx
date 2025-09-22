import React from 'react'
import { Button } from 'antd'

  const SubmitBtn = ({ label = 'Submit', isLoading = false,  onClick, ...rest }) => {
  return (
    <Button type="primary" loading={isLoading} block {...rest} onClick={onClick}>
      {label}
    </Button>
  )
}

export default SubmitBtn
