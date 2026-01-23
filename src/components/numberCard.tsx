import React from 'react'
import { Card, Col, Row } from 'antd'
import { createStaticStyles } from 'antd-style'
const classNames = createStaticStyles(({ css }) => ({
  statCard: css`
    border-radius: 12px;
    height: 10rem;
    display: flex;
    flex-direction: column;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
    overflow: hidden;
  `,
  cardContent: css`
    display: flex;
  `,
  cardIcon: css`
    width: 3.8rem;
    height: 3.8rem;
    margin-left: 0.8rem;
    border-radius: 50%;
    display: flex;
    align-items: center;
    font-size: 1.5rem;
    background: rgba(64, 158, 255, 0.1);
  `,
  cardInfo: css``,
  cardTitle: css`
    color: #606266;
    font-size: 0.8rem;
    padding-left: 0.8rem;
  `,
  cardValue: css`
    font-size: 2rem;
  `,
}))
const NumberCard: React.FC = () => {
  return (
    <Row gutter={16}>
      <Col span={6}>
        <Card className={classNames.statCard} variant="borderless">
          <div className={classNames.cardContent}>
            <div className={classNames.cardIcon}>
              <slot name="Icons">5555</slot>
            </div>
            <div className={classNames.cardInfo}>
              <div className={classNames.cardTitle}>
                <slot name="cardTitle">总教室数</slot>
              </div>
              <div className={classNames.cardValue}>
                <slot name="cardValue"></slot>
              </div>
            </div>
          </div>
        </Card>
      </Col>
    </Row>
  )
}
export default NumberCard
