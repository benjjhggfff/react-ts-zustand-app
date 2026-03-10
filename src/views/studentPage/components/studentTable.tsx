import React, { useState, useEffect } from 'react';
import { Table, message, Card, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import type { ColumnsType } from 'antd/es/table';
import styles from './studentTable.module.scss';

interface Student {
  id: string;
  studentNumber: string;
  name: string;
  gender: string;
  className: string;
  major: string;
  grade: string;
  birthday: string;
  phone: string;
}

interface StudentTableProps {
  onSelectStudent: (student: Student) => void;
}

const StudentTable: React.FC<StudentTableProps> = ({ onSelectStudent }) => {
  const navigate = useNavigate();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);

  // 模拟学生数据
  useEffect(() => {
    setLoading(true);
    // 模拟异步请求
    setTimeout(() => {
      const mockStudents: Student[] = [
        {
          id: '1',
          studentNumber: '2023001',
          name: '张三',
          gender: '男',
          className: '计算机科学与技术1班',
          major: '计算机科学与技术',
          grade: '2023级',
          birthday: '2005-01-01',
          phone: '13800138001'
        },
        {
          id: '2',
          studentNumber: '2023002',
          name: '李四',
          gender: '女',
          className: '计算机科学与技术1班',
          major: '计算机科学与技术',
          grade: '2023级',
          birthday: '2005-02-02',
          phone: '13800138002'
        },
        {
          id: '3',
          studentNumber: '2023003',
          name: '王五',
          gender: '男',
          className: '计算机科学与技术2班',
          major: '计算机科学与技术',
          grade: '2023级',
          birthday: '2005-03-03',
          phone: '13800138003'
        },
        {
          id: '4',
          studentNumber: '2023004',
          name: '赵六',
          gender: '女',
          className: '计算机科学与技术2班',
          major: '计算机科学与技术',
          grade: '2023级',
          birthday: '2005-04-04',
          phone: '13800138004'
        },
        {
          id: '5',
          studentNumber: '2023005',
          name: '钱七',
          gender: '男',
          className: '计算机科学与技术3班',
          major: '计算机科学与技术',
          grade: '2023级',
          birthday: '2005-05-05',
          phone: '13800138005'
        },
        {
          id: '6',
          studentNumber: '2023006',
          name: '孙八',
          gender: '女',
          className: '计算机科学与技术3班',
          major: '计算机科学与技术',
          grade: '2023级',
          birthday: '2005-06-06',
          phone: '13800138006'
        },
        {
          id: '7',
          studentNumber: '2023007',
          name: '周九',
          gender: '男',
          className: '软件工程1班',
          major: '软件工程',
          grade: '2023级',
          birthday: '2005-07-07',
          phone: '13800138007'
        },
        {
          id: '8',
          studentNumber: '2023008',
          name: '吴十',
          gender: '女',
          className: '软件工程1班',
          major: '软件工程',
          grade: '2023级',
          birthday: '2005-08-08',
          phone: '13800138008'
        },
        {
          id: '9',
          studentNumber: '2023009',
          name: '郑十一',
          gender: '男',
          className: '软件工程2班',
          major: '软件工程',
          grade: '2023级',
          birthday: '2005-09-09',
          phone: '13800138009'
        },
        {
          id: '10',
          studentNumber: '2023010',
          name: '王十二',
          gender: '女',
          className: '软件工程2班',
          major: '软件工程',
          grade: '2023级',
          birthday: '2005-10-10',
          phone: '13800138010'
        },
        {
          id: '11',
          studentNumber: '2023011',
          name: '陈十三',
          gender: '男',
          className: '软件工程3班',
          major: '软件工程',
          grade: '2023级',
          birthday: '2005-11-11',
          phone: '13800138011'
        },
        {
          id: '12',
          studentNumber: '2023012',
          name: '林十四',
          gender: '女',
          className: '软件工程3班',
          major: '软件工程',
          grade: '2023级',
          birthday: '2005-12-12',
          phone: '13800138012'
        },
        {
          id: '13',
          studentNumber: '2022001',
          name: '黄十五',
          gender: '男',
          className: '计算机科学与技术1班',
          major: '计算机科学与技术',
          grade: '2022级',
          birthday: '2004-01-01',
          phone: '13800138013'
        },
        {
          id: '14',
          studentNumber: '2022002',
          name: '杨十六',
          gender: '女',
          className: '计算机科学与技术1班',
          major: '计算机科学与技术',
          grade: '2022级',
          birthday: '2004-02-02',
          phone: '13800138014'
        },
        {
          id: '15',
          studentNumber: '2022003',
          name: '马十七',
          gender: '男',
          className: '计算机科学与技术2班',
          major: '计算机科学与技术',
          grade: '2022级',
          birthday: '2004-03-03',
          phone: '13800138015'
        }
      ];
      setStudents(mockStudents);
      setLoading(false);
    }, 500);
  }, []);

  const columns: ColumnsType<Student> = [
    {
      title: '学生信息',
      dataIndex: 'name',
      key: 'name',
      render: (_: any, record: Student) => (
        <div className={styles['user-info']}>
          <div className={`${styles['avatar']} ${record.gender === '男' ? styles['avatar-blue'] : styles['avatar-pink']}`}>
            {record.name.charAt(0)}
          </div>
          <div className={styles['info-text']}>
            <p className={styles['name']}>{record.name}</p>
            <p className={styles['student-number']}>{record.studentNumber}</p>
          </div>
        </div>
      ),
    },
    {
      title: '性别',
      dataIndex: 'gender',
      key: 'gender',
    },
    {
      title: '班级',
      dataIndex: 'className',
      key: 'className',
    },
    {
      title: '专业',
      dataIndex: 'major',
      key: 'major',
    },
    {
      title: '年级',
      dataIndex: 'grade',
      key: 'grade',
    },
    {
      title: '生日',
      dataIndex: 'birthday',
      key: 'birthday',
    },
    {
      title: '电话',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: Student) => (
        <div className={styles['action-buttons']}>
          <button 
            className={styles['btn-view']}
            onClick={() => {
              onSelectStudent(record);
              message.success(`已选择学生: ${record.name}`);
            }}
          >
            查看课表
          </button>
          <button 
            className={styles['btn-edit']}
            onClick={() => {
              // 清除localStorage中的菜单列表，强制重新获取
              localStorage.removeItem('menuList');
              localStorage.removeItem('privileges');
              // 跳转到课表编辑页面，并传递学生信息
              navigate('/schedule/edit', {
                state: {
                  student: record,
                  major: record.major,
                  className: record.className
                }
              });
            }}
          >
            编辑课表
          </button>
        </div>
      ),
    },
  ];

  return (
    <Card className={styles['student-table-container']}>
      <Table
        columns={columns}
        dataSource={students}
        loading={loading}
        rowKey="id"
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          pageSizeOptions: ['10', '20', '50'],
          showTotal: (total) => `共 ${total} 条记录`
        }}
        size="middle"
        scroll={{ x: 1000 }}
      />
    </Card>
  );
};

export default StudentTable;