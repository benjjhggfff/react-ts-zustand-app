import React from "react";

// 导入404图片
import Icon404Img from '../assets/img/404错误.png';
import '../common/eroor.scss';

export default function Error404Page() {
  return (
    <>
      <div className="error-container">
        <div className="error-content">   
            <div className="back-img" style={{background:`url(${Icon404Img}) no-repeat center`,backgroundSize: 'contain'}} />
          <p className="error-text">页面找不到啦~</p>
        </div>
      </div>
    </>
  );
}

