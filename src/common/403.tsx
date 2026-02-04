import React from "react";

// 导入404图片
import Icon403Img from '../assets/img/权限不足.png';
import '../common/eroor.scss';

export default function Error403Page() {
  return (
    <>
      <div className="error-container">
        <div className="error-content">   
            <div className="back-img" style={{background:`url(${Icon403Img}) no-repeat center`,backgroundSize: 'contain'}} />
          <p className="error-text">权限不足，请联系管理员~</p>
        </div>
      </div>
    </>
  );
}

