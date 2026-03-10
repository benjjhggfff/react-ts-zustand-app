import React from 'react'
import { Row, Col } from 'antd'
import '../userPage.scss'
export interface item {
  itemName: string
  itemDescr: string
  isSet?: boolean
}
export default function BaseItem(props: item) {
  return (
    <div style={{ width: '98%', marginLeft: '1.25rem', marginTop: '2.78rem' }}>
      <Row gutter={16} className="base-item">
        <Col
          span={1.5}
          style={{
            color: 'rgba(78, 89, 105, 1)',
          }}
        >
          {props.itemName}
        </Col>
        <Col
          span={20}
          className={props.isSet ? ' base-item-decr' : 'base-item-decr base-item-noset'}
        >
          {props.itemDescr}
        </Col>
      </Row>
    </div>
  )
}
