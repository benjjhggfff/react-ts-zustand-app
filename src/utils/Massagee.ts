
import { message } from 'antd';
const [messageApi] = message.useMessage();
 
export default  class Message{

  static success = (msg: string) => {
    messageApi.open({
      type: 'success',
        content: msg,
    });
  };

   static error = (msg: string) => {
    messageApi.open({
      type: 'error',
      content: msg,
    });
  };

  static warning = (msg: string) => {
    messageApi.open({
      type: 'warning',
      content: msg,
    });
  };

}

