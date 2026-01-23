import React from 'react'
import { Breadcrumb } from 'antd'

const ContentBreadcrumb: React.FC = () => (
  <Breadcrumb
    style={{
      padding: '0.8rem',
    }}
    separator=">"
    items={[
      {
        title: 'Home',
      },
      {
        title: 'Application Center',
        href: '',
      },
      {
        title: 'Application List',
        href: '',
      },
      {
        title: 'An Application',
      },
    ]}
  />
)

export default ContentBreadcrumb
