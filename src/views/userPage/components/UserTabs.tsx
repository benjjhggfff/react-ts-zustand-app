// UserTabs.tsx
import React from 'react'
import { Tabs } from 'antd'

export default function UserTabs({ activeTab, onChange, tabItems }: any) {
  return <Tabs items={tabItems} activeKey={activeTab} onChange={onChange} animated />
}
