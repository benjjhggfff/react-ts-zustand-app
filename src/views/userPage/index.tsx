import React, { useState } from 'react'
import { Row, Col } from 'antd'
import BaseItem from './components/BaseItem'
import type { item } from './components/BaseItem'
import './userPage.scss'

export default function UserPage() {
  const itemList: item[] = [
    {
      itemName: '登录密码',
      itemDescr:
        '已设置。密码至少6位字符，支持数字、字母和除空格外的特殊字符，且必须同时包含数字和大小写字母。',
      isSet: true,
    },
    {
      itemName: '密保问题',
      itemDescr: '未设置。请定期更换密保问题，并确保问题答案的保密性，以防账号被盗用。',
      isSet: false,
    },
    {
      itemName: '安全手机',
      itemDescr: '已绑定：150******50',
      isSet: true,
    },
    {
      itemName: '安全邮箱',
      itemDescr: '已绑定：150******50',
      isSet: true,
    },
  ]
  return (
    <>
      <Row style={{ width: '97%', margin: '0 auto' }}>
        <Col span={24}>
          <div className="base-info-box">
            <div className="user-avator">
              <img
                src="https://ts1.tc.mm.bing.net/th/id/OIP-C.SWWmUtJk_k7PS8U6DyrxQQAAAA?w=204&h=211&c=8&rs=1&qlt=90&o=6&dpr=1.9&pid=3.1&rm=2"
                alt=""
              />
            </div>
            <div className="user-info">
              <div className="">
                <div className="tagname">用户名：</div>
                <div className="tagname">账号ID：</div>
                <div className="tagname">注册时间：</div>
              </div>
              <div className="">
                <div className="tagname"> 实名认证：</div>
                <div className="tagname"> 手机号码：</div>
              </div>
            </div>
          </div>
        </Col>
      </Row>
      <div
        style={{
          width: '98%',
          height: '36.19rem',
          background: 'rgba(255, 255, 255, 1)',
          margin: '1rem auto',
        }}
      >
        <Row
          gutter={16}
          style={{
            width: '17.25rem',
            height: '1.88rem',
            marginLeft: '1.25rem',
            marginTop: '1.31rem',
          }}
        >
          <Col className="item-name" span={8}>
            基础信息
          </Col>
          <Col className="item-name active" span={8}>
            安全设置
          </Col>
          <Col className="item-name" span={8}>
            实名认证
          </Col>
        </Row>

        {itemList.map(item => {
          return (
            <BaseItem
              itemDescr={item.itemDescr}
              itemName={item.itemName}
              isSet={item.isSet}
            ></BaseItem>
          )
        })}
      </div>
    </>
  )
}
