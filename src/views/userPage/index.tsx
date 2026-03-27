import React, { useState, useEffect } from 'react'
import { Row, Col, Card, Button, Skeleton, message } from 'antd'
import { EditOutlined } from '@ant-design/icons'
import { useAppSelector, useAppDispatch } from '../../store/index'
import { fetchUserInfo } from '../../store/modules/userStore'
import { updateUserProfileApi } from '../../api/user'
import { Form } from 'antd'
import styles from './userPage.module.scss'

import UserAvatar from './components/UserAvatar'
import UserInfoList from './components/UserInfoList'
import UserEditModal from './components/UserEditModal'
import UserTabs from './components/UserTabs'
import { getTabItems } from './components/tabConfig'

export default function UserPage() {
  const dispatch = useAppDispatch()
  const { userInfo } = useAppSelector(state => state.user)
  const [activeTab, setActiveTab] = useState('security')
  const [isEditing, setIsEditing] = useState(false)
  const [form] = Form.useForm()
  const [avatar, setAvatar] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!userInfo) {
      dispatch(fetchUserInfo()).finally(() => setLoading(false))
    } else {
      setAvatar(userInfo.avatar || '')
      setLoading(false)
    }
  }, [dispatch, userInfo])

  const handleEdit = () => {
    setIsEditing(true)
    form.setFieldsValue({ ...userInfo })
  }

  const handleSave = async () => {
    try {
      const values = await form.validateFields()
      await updateUserProfileApi(values)
      message.success('更新成功')
      dispatch(fetchUserInfo())
      setIsEditing(false)
    } catch (e) {
      message.error('失败')
    }
  }

  if (loading) {
    return (
      <Card>
        <Skeleton active />
      </Card>
    )
  }

  // 生成标签页项
  const tabItems = getTabItems(userInfo)

  return (
    <div className={styles.userPage}>
      <Card className={styles.profileCard}>
        <Row gutter={[24, 24]} align="middle">
          <Col xs={24} sm={8} md={4} className={styles.avatarCol}>
            <UserAvatar
              avatar={avatar}
              isEditing={isEditing}
              form={form}
              onAvatarChange={setAvatar}
            />
            <div className={styles.editButtonWrap}>
              <Button
                type="primary"
                icon={<EditOutlined />}
                onClick={handleEdit}
                className={styles.editBtn}
              >
                修改资料
              </Button>
            </div>
          </Col>
          <Col xs={24} sm={16} md={18}>
            <UserInfoList userInfo={userInfo} />
          </Col>
        </Row>
      </Card>

      <UserEditModal
        isEditing={isEditing}
        form={form}
        onCancel={() => setIsEditing(false)}
        onSave={handleSave}
      />

      <Card className={styles.tabCard}>
        <UserTabs activeTab={activeTab} onChange={setActiveTab} tabItems={tabItems} />
      </Card>
    </div>
  )
}
