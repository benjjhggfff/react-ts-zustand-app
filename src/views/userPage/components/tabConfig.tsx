import React from 'react'
import { Space, Button } from 'antd'
import {
  LockOutlined,
  QuestionCircleOutlined,
  PhoneOutlined,
  MailOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons'
import styles from '../userPage.module.scss'

export const getTabItems = (userInfo: any) => [
  {
    key: 'security',
    label: '安全设置',
    children: (
      <div className={styles.baseInfoGrid}>
        <div className={styles.baseInfoColumn}>
          <div className={styles.securityItem}>
            <div className={styles.securityItemHeader}>
              <Space>
                <LockOutlined />
                <span className={styles.securityItemName}>登录密码</span>
              </Space>
              <span className={styles.securityItemStatus}>已设置</span>
            </div>
            <div className={styles.securityItemDesc}>
              密码至少6位字符，支持数字、字母和除空格外的特殊字符，且必须同时包含数字和大小写字母。
            </div>
            <Button type="link">修改密码</Button>
          </div>

          <div className={styles.securityItem}>
            <div className={styles.securityItemHeader}>
              <Space>
                <QuestionCircleOutlined />
                <span className={styles.securityItemName}>密保问题</span>
              </Space>
              <span className={styles.securityItemStatus}>未设置</span>
            </div>
            <div className={styles.securityItemDesc}>
              请定期更换密保问题，并确保问题答案的保密性，以防账号被盗用。
            </div>
            <Button type="link">设置密保问题</Button>
          </div>
        </div>

        <div className={styles.baseInfoColumn}>
          <div className={styles.securityItem}>
            <div className={styles.securityItemHeader}>
              <Space>
                <PhoneOutlined />
                <span className={styles.securityItemName}>安全手机</span>
              </Space>
              <span className={styles.securityItemStatus}>
                {userInfo?.phone ? '已绑定' : '未绑定'}
              </span>
            </div>
            <div className={styles.securityItemDesc}>
              {userInfo?.phone ? `已绑定：${userInfo.phone}` : '绑定手机可以提高账号安全性'}
            </div>
            <Button type="link">{userInfo?.phone ? '修改绑定' : '绑定手机'}</Button>
          </div>

          <div className={styles.securityItem}>
            <div className={styles.securityItemHeader}>
              <Space>
                <MailOutlined />
                <span className={styles.securityItemName}>安全邮箱</span>
              </Space>
              <span className={styles.securityItemStatus}>已绑定</span>
            </div>
            <div className={styles.securityItemDesc}>已绑定：{userInfo?.email || '未设置'}</div>
            <Button type="link">修改绑定</Button>
          </div>
        </div>
      </div>
    ),
  },
  {
    key: 'verification',
    label: '实名认证',
    children: (
      <div className={styles.baseInfoGrid}>
        <div className={styles.baseInfoColumn} style={{ flex: '1 1 100%' }}>
          <div className={styles.verificationContent}>
            <div className={styles.verificationStatus}>
              <span className={styles.statusLabel}>实名认证状态：</span>
              <span
                className={`${styles.statusValue} ${userInfo?.verified ? styles.verified : styles.unverified}`}
              >
                {userInfo?.verified ? (
                  <>
                    <CheckCircleOutlined /> 已认证
                  </>
                ) : (
                  <>
                    <CloseCircleOutlined /> 未认证
                  </>
                )}
              </span>
            </div>
          </div>
        </div>
      </div>
    ),
  },
]
