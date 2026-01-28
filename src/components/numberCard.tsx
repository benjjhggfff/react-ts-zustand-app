import React from 'react'
import { Card, Col, Row } from 'antd'
import { createStaticStyles } from 'antd-style'
const classNames = createStaticStyles(({ css }) => ({
  statCard: css`
    border-radius: 12px;
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
  cardInfo: css`
   margin-left: 0.8rem;
  `,
  cardTitle: css`
    color: #606266;
    font-size: 0.875rem;
    justify-content: center;
  `,
  cardValue: css`
    font-size: 1.8rem;
    font-weight: 700;
    text-align: center;
  `,
  cardFooter: css`
    height: 1px;
    width: 100%;
    transform: scaleY(0.5);
    transform-origin: 0 0;
    background-color: #ededed;
  `,
  compareData: css`
  margin-top: 0.8rem;
  font-size: 0.75rem;
 
  `,
compareStr:css`
 color: #909399;
`,
green:css` color: #67C23A;
`,
red:css`
 color: #F56C6C;
`,

}))

export interface NumberCardProps {
  cardIcon: React.ReactNode;
  title: string ;
  value: number;
  compareText: string;
  compareValue: number;
}

const NumberCard: React.FC<NumberCardProps> = (props) => {
  return (
   
        <Card className={classNames.statCard} variant="borderless">
          <div className={classNames.cardContent}>
            <div className={classNames.cardIcon}>
              {props.cardIcon||<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"></svg>}
            </div>
            <div className={classNames.cardInfo}>
              <div className={classNames.cardTitle}>
                {props.title||'总量'}
              </div>
              <div className={classNames.cardValue}>
            {props.value||'50'}
              </div>
            </div>
          </div>
          <div className={classNames.cardFooter}></div>
          <div className={ classNames.compareData}>
            <span className={classNames.compareStr}>{props.compareText||'较上月增长'}</span>
             &nbsp;
            <span className={props.compareValue > 0 ? classNames.green : classNames.red}>
  {props.compareValue}&nbsp;%
</span>

            
          </div>
        </Card>
    
  )
}
export default NumberCard
