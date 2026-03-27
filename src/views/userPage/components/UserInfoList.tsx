// UserInfoList.tsx
import React from 'react'
import styles from '../userPage.module.scss'
import {
  UserOutlined,
  IdcardOutlined,
  CalendarOutlined,
  SafetyCertificateOutlined,
  PhoneOutlined,
  MailOutlined,
} from '@ant-design/icons'

const InfoItem = ({ icon, label, value, extra }: any) => (
  <div className={styles.infoItem}>
    <div className={styles.infoIcon}>{icon}</div>
    <div className={styles.infoContent}>
      <span className={styles.infoLabel}>{label}</span>
      <span className={styles.infoValue}>{value || '未设置'}</span>
      {extra && <div className={styles.infoExtra}>{extra}</div>}
    </div>
  </div>
)

export default function UserInfoList({ userInfo }: any) {
  return (
    <div className={styles.infoGrid}>
      <div className={styles.infoColumn}>
        <InfoItem icon={<UserOutlined />} label="用户名" value={userInfo?.name} />
        <InfoItem icon={<IdcardOutlined />} label="账号ID" value={userInfo?.id} />
        <InfoItem
          icon={<CalendarOutlined />}
          label="注册时间"
          value={userInfo?.created_at ? new Date(userInfo.created_at).toLocaleString() : null}
        />
      </div>
      <div className={styles.infoColumn}>
        <InfoItem
          icon={<SafetyCertificateOutlined />}
          label="实名认证"
          value={
            <span
              className={`${styles.statusTag} ${userInfo?.verified ? styles.verified : styles.unverified}`}
            >
              {userInfo?.verified ? '已认证' : '未认证'}
            </span>
          }
        />
        <InfoItem icon={<PhoneOutlined />} label="手机号码" value={userInfo?.phone} />
        <InfoItem icon={<MailOutlined />} label="邮箱" value={userInfo?.email} />
      </div>
    </div>
  )
}
