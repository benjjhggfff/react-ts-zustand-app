import React from "react";

// 导入404图片
import Icon505Img from '../assets/img/500错误.png';
import '../common/eroor.scss';

export default function Error505Page() {
  return (
    <>
      <div className="error-container">
        <div className="error-content">   
            <div className="back-img" style={{background:`url(${Icon505Img}) no-repeat center`,backgroundSize: 'contain'}} />
          <p className="error-text">服务器内部错误，请稍后再试~</p>
        </div>
      </div>
    </>
  );
}

