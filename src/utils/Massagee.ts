// Message.ts
import { message } from 'antd'

// 直接导出 antd 的 message 方法
const Message = {
  success: (msg: string) => message.success(msg),
  error: (msg: string) => message.error(msg),
  warning: (msg: string) => message.warning(msg),
  info: (msg: string) => message.info(msg),
}

export default Message
