// UserAvatar.tsx
import React from 'react'
import { Avatar, Tooltip } from 'antd'
import { UserOutlined, CameraOutlined } from '@ant-design/icons'
import styles from '../userPage.module.scss'
import { chooseAndUploadWebImage } from './../../../utils/upload'
import { updateUserProfileApi } from './../../../api/user'
import { message } from 'antd'

interface Props {
  avatar: string
  isEditing: boolean
  form: any
  onAvatarChange: (url: string) => void
}

export default function UserAvatar({ avatar, isEditing, form, onAvatarChange }: Props) {
  const handleUpload = async (file: File) => {
    try {
      const res = await chooseAndUploadWebImage(file)
      if (!res.success || !res.url) {
        message.error('上传失败')
        return
      }

      await updateUserProfileApi({ avatar: res.url })
      console.log(res)
      onAvatarChange(res.url)
      message.success('头像更新成功')

      if (isEditing) {
        form.setFieldsValue({ avatar: res.url })
      }
    } catch (err) {
      message.error('头像更新失败')
    }
  }

  return (
    <div className={styles.avatarContainer}>
      <Avatar size={120} src={avatar || null} icon={<UserOutlined />} className={styles.avatar} />
      <Tooltip title="更换头像">
        <div
          className={styles.avatarUpload}
          onClick={() => {
            const input = document.createElement('input')
            input.type = 'file'
            input.accept = 'image/*'
            input.onchange = (e: any) => {
              const file = e.target.files?.[0]
              file && handleUpload(file)
            }
            input.click()
          }}
        >
          <CameraOutlined />
        </div>
      </Tooltip>
    </div>
  )
}
