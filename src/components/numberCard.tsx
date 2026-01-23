import React from 'react'
import { Card, Col, Row } from 'antd'
const NumberCard: React.FC = () => {
  return (
    <Row gutter={16}>
      <Col span={6}>
        <Card title="Card title" variant="borderless">
          Card content
        </Card>
      </Col>
    </Row>
  )
}
export default NumberCard
