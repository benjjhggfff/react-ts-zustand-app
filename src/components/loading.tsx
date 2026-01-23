import React from 'react'
import { Flex, Spin } from 'antd'
import type { SpinProps } from 'antd'
import { createStaticStyles } from 'antd-style'

const classNames = createStaticStyles(({ css }) => ({
  root: css`
    padding: 8px;
  `,
}))

const stylesObject: SpinProps['styles'] = {
  indicator: {
    color: '#97B5CB',
  },
}

const Loading: React.FC = () => {
  const sharedProps: SpinProps = {
    spinning: true,
    percent: 0,
    classNames: { root: classNames.root },
  }

  return (
    <Flex align="center" gap="middle" justify="center" style={{ height: '100%' }}>
      <Spin {...sharedProps} size="large" styles={stylesObject} />
    </Flex>
  )
}

export default Loading
