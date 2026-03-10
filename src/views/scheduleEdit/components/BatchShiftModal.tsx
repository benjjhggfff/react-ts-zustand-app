import React, { useState } from 'react'
import { Modal, Form, InputNumber, Radio, message } from 'antd'

interface Props {
  visible: boolean
  onCancel: () => void
  onConfirm: (days: number, targetType: 'class' | 'teacher', targetId: string) => Promise<boolean>
  targetType: 'class' | 'teacher'
  targetId: string
  targetName: string
}

const BatchShiftModal: React.FC<Props> = ({
  visible,
  onCancel,
  onConfirm,
  targetType,
  targetId,
  targetName,
}) => {
  const [days, setDays] = useState<number>(1)
  const [loading, setLoading] = useState(false)

  const handleOk = async () => {
    if (!days || days === 0) {
      message.warning('请输入偏移天数')
      return
    }
    setLoading(true)
    const success = await onConfirm(days, targetType, targetId)
    setLoading(false)
    if (success) {
      onCancel()
    }
  }

  return (
    <Modal
      title={`批量调整课程 - ${targetName}`}
      open={visible}
      onOk={handleOk}
      onCancel={onCancel}
      confirmLoading={loading}
      destroyOnClose
    >
      <Form layout="vertical">
        <Form.Item label="偏移天数" required>
          <InputNumber
            value={days}
            onChange={value => setDays(value || 0)}
            min={-30}
            max={30}
            style={{ width: '100%' }}
            placeholder="输入正数表示向后移，负数表示向前移"
          />
          <div style={{ marginTop: 8, color: '#666' }}>
            {days > 0
              ? `所有课程向后移 ${days} 天`
              : days < 0
                ? `所有课程向前移 ${-days} 天`
                : '无变化'}
          </div>
        </Form.Item>
        <Form.Item>
          <div style={{ color: '#888' }}>
            注意：系统会自动跳过周末（周六、周日），并检查冲突和过去日期。
          </div>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default BatchShiftModal
