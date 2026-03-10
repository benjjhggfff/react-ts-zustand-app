import React, { useState, useEffect } from 'react';
import { Table, Empty } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import styles from './studentSchedule.module.scss';

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

interface Course {
  id: string;
  courseName: string;
  teacher: string;
  time: string;
  location: string;
  day: string;
}

interface StudentScheduleProps {
  student: Student | null;
}

const StudentSchedule: React.FC<StudentScheduleProps> = ({ student }) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (student) {
      setLoading(true);
      // 模拟异步请求获取课程数据
      setTimeout(() => {
        const mockCourses: Course[] = [
          {
            id: '1',
            courseName: '高等数学',
            teacher: '王老师',
            time: '08:00-09:40',
            location: 'A101',
            day: '周一'
          },
          {
            id: '2',
            courseName: '大学英语',
            teacher: '李老师',
            time: '10:00-11:40',
            location: 'B202',
            day: '周一'
          },
          {
            id: '3',
            courseName: '数据结构',
            teacher: '张老师',
            time: '14:00-15:40',
            location: 'C303',
            day: '周二'
          },
          {
            id: '4',
            courseName: '算法分析',
            teacher: '周老师',
            time: '16:00-17:40',
            location: 'D404',
            day: '周二'
          },
          {
            id: '5',
            courseName: '操作系统',
            teacher: '刘老师',
            time: '08:00-09:40',
            location: 'E505',
            day: '周三'
          },
          {
            id: '6',
            courseName: '计算机网络',
            teacher: '陈老师',
            time: '10:00-11:40',
            location: 'F606',
            day: '周三'
          },
          {
            id: '7',
            courseName: '数据库原理',
            teacher: '赵老师',
            time: '14:00-15:40',
            location: 'G707',
            day: '周四'
          },
          {
            id: '8',
            courseName: '计算机组成原理',
            teacher: '吴老师',
            time: '16:00-17:40',
            location: 'H808',
            day: '周四'
          },
          {
            id: '9',
            courseName: '软件工程',
            teacher: '钱老师',
            time: '08:00-09:40',
            location: 'I909',
            day: '周五'
          },
          {
            id: '10',
            courseName: '程序设计实践',
            teacher: '孙老师',
            time: '10:00-11:40',
            location: 'J1010',
            day: '周五'
          }
        ];
        setCourses(mockCourses);
        setLoading(false);
      }, 500);
    } else {
      setCourses([]);
    }
  }, [student]);

  const columns: ColumnsType<Course> = [
    {
      title: '课程名称',
      dataIndex: 'courseName',
      key: 'courseName',
    },
    {
      title: '任课教师',
      dataIndex: 'teacher',
      key: 'teacher',
    },
    {
      title: '上课时间',
      dataIndex: 'time',
      key: 'time',
    },
    {
      title: '上课地点',
      dataIndex: 'location',
      key: 'location',
    },
    {
      title: '星期',
      dataIndex: 'day',
      key: 'day',
    },
  ];

  if (!student) {
    return (
      <div className={styles['empty-state']}>
        <div className={styles['empty-icon']}>📅</div>
        <div className={styles['empty-text']}>请选择一个学生查看课表</div>
      </div>
    );
  }

  return (
    <div className={styles['student-schedule-container']}>
      <div className={styles['student-info']}>
        <div className={styles['student-name']}>
          学生: {student.name} ({student.studentNumber})
        </div>
        <div className={styles['student-detail']}>
          班级: {student.className} | 专业: {student.major}
        </div>
      </div>
      <Table
        columns={columns}
        dataSource={courses}
        loading={loading}
        rowKey="id"
        pagination={{
          pageSize: 5,
          showSizeChanger: true,
          pageSizeOptions: ['5', '10', '20'],
          showTotal: (total) => `共 ${total} 门课程`
        }}
        size="small"
        scroll={{ x: 400 }}
      />
    </div>
  );
};

export default StudentSchedule;