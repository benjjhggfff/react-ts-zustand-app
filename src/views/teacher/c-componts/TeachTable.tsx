import React from "react";
import styled from "styled-components";

export default function TeachTable() {
  const teachers = [
    {
      id: 1,
      name: "张三",
      email: "zhangsan@school.com",
      teacherId: "T2024001",
      gender: 1,
      department: "计算机科学与技术学院",
      nation: "汉族",
      isExternal: "是",
    },
    {
      id: 2,
      name: "李四",
      email: "lisi@school.com",
      teacherId: "T2024002",
      gender: 0,
      department: "文学院",
      nation: "满族",
      isExternal: "是",
    },
    {
      id: 3,
      name: "王五",
      email: "wangwu@school.com",
      teacherId: "T2024003",
      gender: 1,
      department: "理学院",
      nation: "回族",
      isExternal: "否",
    },
    {
      id: 4,
      name: "赵六",
      email: "zhaoliu@school.com",
      teacherId: "T2024004",
      gender: 0,
      department: "外国语学院",
      nation: "汉族",
      isExternal: "否",
    },{
        id: 5,
      name: "钱七",
      email: "qianqi@school.com",
      teacherId: "T2024005",
      gender: 1,
      department: "经济与管理学院",
      nation: "壮族",
      isExternal: "是",
    },
    {
        id: 6,
      name: "孙八",
      email: "sunba@school.com",
      teacherId: "T2024006",
      gender: 0,
      department: "艺术设计学院",
      nation: "汉族",
      isExternal: "否",
    }
  ];

  const getGenderText = (gender:number) => {
    return gender === 1 ? "男" : "女";
  };

  return (
    <StyledWrapper>
      <div className="page-container">
        {/* 顶部工具栏 */}
        <div className="toolbar">
          <div className="left-tool">
            <span>显示</span>
            <select className="form-select form-select-sm">
              <option>10</option>
              <option>25</option>
              <option>50</option>
              <option>100</option>
            </select>
            <span>条记录</span>
          </div>
          <div className="right-tool">
            <input
              type="text"
              placeholder="搜索..."
              className="search-input"
            />
            <button className="btn-add">+ 新增教师</button>
          </div>
        </div>

        {/* 表格区域 */}
        <table className="teach-table">
          <thead>
            <tr>
              <th>教师姓名</th>
              <th>教师编号</th>
              <th>性别</th>
              <th>所属部门</th>
              <th>民族</th>
              <th>是否外聘</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {teachers.map((teacher) => (
              <tr key={teacher.id} className="table-row">
                <td>
                  <div className="user-info">
                    <div
                      className={`avatar ${
                        teacher.gender === 1 ? "avatar-blue" : "avatar-pink"
                      }`}
                    >
                      {teacher.name.charAt(0)}
                    </div>
                    <div className="info-text">
                      <p className="name">{teacher.name}</p>
                      <p className="email">{teacher.email}</p>
                    </div>
                  </div>
                </td>
                <td>{teacher.teacherId}</td>
                <td>{getGenderText(teacher.gender)}</td>
                <td>{teacher.department}</td>
                <td>{teacher.nation}</td>
                <td className="external-text">{teacher.isExternal}</td>
                <td>
                  <div className="action-buttons">
                    <button className="btn-edit">编辑</button>
                    <button className="btn-delete">删除</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* 底部分页栏 */}
        <div className="pagination-bar">
          <div className="record-info">
            显示 1 到 {teachers.length} 条，共 {teachers.length} 条记录
          </div>
          <div className="pagination-nav">
            <button className="page-btn" disabled>上一页</button>
            <button className="page-btn active">1</button>
            <button className="page-btn">下一页</button>
          </div>
        </div>
      </div>


    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  background-color: #f8f9fa;
  min-height: 100vh;
  padding: 2rem 1rem;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  .page-container {
    background-color: #ffffff;
    border-radius: 8px;
    padding: 1.5rem;
    max-width: 1200px;
    margin: 0 auto;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  }

  .toolbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
    flex-wrap: wrap;
    gap: 1rem;
  }

  .left-tool {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.9rem;
  }

  .right-tool {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .search-input {
    padding: 0.375rem 0.75rem;
    border: 1px solid #dee2e6;
    border-radius: 4px;
    width: 220px;
    font-size: 0.9rem;
  }

  .btn-add {
    background-color: #8ca6c2;
    color: #fff;
    border: none;
    border-radius: 4px;
    padding: 0.375rem 0.75rem;
    font-size: 0.9rem;
    cursor: pointer;
  }

  .btn-add:hover {
    background-color: #7ea2c7;
  }

  /* 表格核心样式 */
  .teach-table {
    width: 100%;
    border-collapse: separate;
    border-spacing: 0 0.75rem;
  }

  .teach-table thead th {
    padding: 0.75rem 1rem;
    background-color: #f8f9fa;
    font-size: 0.85rem;
    font-weight: 600;
    text-align: center;
    border: none;
  }

  /* 关键修复：整行作为卡片 */
  .table-row {
    background-color: #ffffff;
    border-radius: 8px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  }

  .teach-table tbody td {
    padding: 1rem;
    border: none;
    vertical-align: middle;
    font-size: 0.9rem;
  }

  /* 关键修复：教师姓名列左对齐，其他列居中 */
  .teach-table tbody td:first-child {
    text-align: left;
    border-top-left-radius: 8px;
    border-bottom-left-radius: 8px;
  }

  .teach-table tbody td:not(:first-child) {
    text-align: center;
  }

  .teach-table tbody td:last-child {
    border-top-right-radius: 8px;
    border-bottom-right-radius: 8px;
  }

  /* 用户信息区域 */
  .user-info {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .avatar {
    width: 2.25rem;
    height: 2.25rem;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    font-size: 1rem;
  }

  .avatar-blue {
    background-color: #e3f2fd;
    color: #a6cef9;
  }

  .avatar-pink {
    background-color: #fce4ec;
    color: #eaccda;
  }

  .info-text .name {
    margin: 0;
    font-weight: 600;
    font-size: 0.95rem;
  }

  .info-text .email {
    margin: 0;
    font-size: 0.8rem;
    color: #6c757d;
  }

  /* 是否外聘文本 */
  .external-text {
    font-size: 0.9rem;
    font-weight: 500;
  }

  /* 操作按钮 */
  .action-buttons {
    display: flex;
    justify-content: center;
    gap: 0.5rem;
  }

  .btn-edit {
    background-color: #a6ccee;
    color: #ffffff;
    border: none;
    border-radius: 4px;
    padding: 0.25rem 0.75rem;
    font-size: 0.85rem;
    cursor: pointer;
  }

  .btn-edit:hover {
    background-color: #99d1ff;
  }

  .btn-delete {
    background-color: #e5c5c8;
  color: #ffffff;
    border: none;
    border-radius: 4px;
    padding: 0.25rem 0.75rem;
    font-size: 0.85rem;
    cursor: pointer;
  }

  .btn-delete:hover {
    background-color: #f1b0b7;
  }

  /* 分页栏 */
  .pagination-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 1.5rem;
    padding-top: 1rem;
    border-top: 1px solid #dee2e6;
  }

  .record-info {
    font-size: 0.85rem;
    color: #6c757d;
  }

  .pagination-nav {
    display: flex;
    gap: 0.25rem;
  }

  .page-btn {
    padding: 0.25rem 0.75rem;
    border: 1px solid #dee2e6;
    border-radius: 4px;
    background-color: #fff;
    color: #007bff;
    cursor: pointer;
    font-size: 0.85rem;
  }

  .page-btn.active {
    background-color: #007bff;
    color: #fff;
    border-color: #007bff;
  }

  .page-btn:disabled {
    color: #6c757d;
    cursor: not-allowed;
  }

  .footer-note {
    text-align: center;
    margin-top: 1rem;
    font-size: 0.85rem;
    color: #6c757d;
  }
`;