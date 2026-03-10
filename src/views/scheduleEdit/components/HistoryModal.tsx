import React from 'react'
import { Modal, List, Button, Tag } from 'antd'
import dayjs from 'dayjs'

interface Props {
  visible: boolean
  onCancel: () => void
  history: any[][] // 课程列表的数组
  currentIndex: number
  onRollback: (index: number) => void
}

const HistoryModal: React.FC<Props> = ({
  visible,
  onCancel,
  history,
  currentIndex,
  onRollback,
}) => {
  return (
    <Modal title="历史版本" open={visible} onCancel={onCancel} footer={null} width={600}>
      <List
        dataSource={history}
        renderItem={(version, index) => (
          <List.Item
            actions={[
              <Button
                type="link"
                disabled={index === currentIndex}
                onClick={() => onRollback(index)}
              >
                {index === currentIndex ? '当前版本' : '回滚到此版本'}
              </Button>,
            ]}
          >
            <List.Item.Meta
              title={`版本 ${index + 1}`}
              description={`课程数量：${version.length} | ${index === 0 ? '初始版本' : dayjs().format('YYYY-MM-DD HH:mm')}`}
            />
            {index === currentIndex && <Tag color="blue">当前</Tag>}
          </List.Item>
        )}
      />
    </Modal>
  )
}

export default HistoryModal
