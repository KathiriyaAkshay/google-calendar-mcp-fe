import React from 'react'
import { Button } from 'antd'

const SubmitBtn = ({ label = 'Submit', isLoading = false, ...rest }) => {
  return (
    <Button type="primary" loading={isLoading} block {...rest}>
      {label}
    </Button>
  )
}

export default SubmitBtn
