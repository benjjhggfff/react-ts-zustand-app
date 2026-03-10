import React, { useState } from 'react'
import { Modal, Upload, message } from 'antd'
import { InboxOutlined } from '@ant-design/icons'
import * as XLSX from 'xlsx'

const { Dragger } = Upload

interface Props {
  visible: boolean
  onCancel: () => void
  onImport: (file: File) => Promise<{ success: boolean; message: string }>
}

const ExcelImportModal: React.FC<Props> = ({ visible, onCancel, onImport }) => {
  const [fileList, setFileList] = useState<any[]>([])
  const [uploading, setUploading] = useState(false)

  const handleUpload = async () => {
    if (fileList.length === 0) {
      message.warning('请选择文件')
      return
    }
    setUploading(true)
    const result = await onImport(fileList[0].originFileObj)
    setUploading(false)
    if (result.success) {
      message.success(result.message)
      setFileList([])
      onCancel()
    } else {
      message.error(result.message)
    }
  }

  const props = {
    name: 'file',
    multiple: false,
    accept: '.xlsx,.xls',
    fileList,
    beforeUpload: (file: File) => {
      // 检查文件扩展名
      const isExcel = file.name.endsWith('.xlsx') || file.name.endsWith('.xls')
      if (!isExcel) {
        message.error('只能上传 Excel 文件')
        return Upload.LIST_IGNORE
      }
      setFileList([{ originFileObj: file, name: file.name }])
      return false // 阻止自动上传
    },
    onRemove: () => setFileList([]),
  }

  return (
    <Modal
      title="Excel 导入课程"
      open={visible}
      onOk={handleUpload}
      onCancel={onCancel}
      confirmLoading={uploading}
      okText="导入"
      cancelText="取消"
    >
      <Dragger {...props}>
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">点击或拖拽文件到此区域上传</p>
        <p className="ant-upload-hint">
          支持 .xlsx, .xls 格式，模板列名：课程名称、教师、教师ID、教室、开始时间、结束时间、班级ID
        </p>
      </Dragger>
    </Modal>
  )
}

export default ExcelImportModal
