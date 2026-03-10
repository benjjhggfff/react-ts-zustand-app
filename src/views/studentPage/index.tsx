import React, { useState } from 'react'
import { Row, Col, Card, Radio, Button } from 'antd'
import { Link, useNavigate } from 'react-router-dom'
import SearchInput from '../../components/searchInput'
import SelectInput from '../../components/selectInput'
import NumberCard from '../../components/numberCard'
import StudentTable from './components/studentTable'
import StudentSchedule from './components/studentSchedule'
import GenderChart from './components/genderChart'
import ClassDistributionChart from './components/classDistributionChart'
import styles from './studentPage.module.scss'

export default function StudentPage() {
  const navigate = useNavigate()
  const [studentNumber, setStudentNumber] = useState('')
  const [studentName, setStudentName] = useState('')
  const [major, setMajor] = useState('')
  const [className, setClassName] = useState('')
  const [selectedStudent, setSelectedStudent] = useState<any>(null)

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setState: React.Dispatch<React.SetStateAction<string>>
  ) => {
    setState(e.target.value)
  }

  const handleStudentSelect = (student: any) => {
    setSelectedStudent(student)
  }

  return (
    <div className={styles['student-management']}>
      {/* 统计卡片 */}
      <Row gutter={10}>
        <Col span={6}>
          <NumberCard
            cardIcon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-6 h-6"
              />
            }
            title={'学生总数'}
            value={150}
            compareText={'较上月'}
            compareValue={10}
          />
        </Col>
        <Col span={6}>
          <NumberCard
            cardIcon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-6 h-6"
              />
            }
            title={'男生人数'}
            value={85}
            compareText={'较上月'}
            compareValue={5}
          />
        </Col>
        <Col span={6}>
          <NumberCard
            cardIcon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-6 h-6"
              />
            }
            title={'女生人数'}
            value={65}
            compareText={'较上月'}
            compareValue={5}
          />
        </Col>
        <Col span={6}>
          <NumberCard
            cardIcon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-6 h-6"
              />
            }
            title={'班级数量'}
            value={6}
            compareText={'较上月'}
            compareValue={0}
          />
        </Col>
      </Row>

      {/* 搜索区域 */}
      <Card style={{ marginTop: '20px' }}>
        <Row>
          <Col span={6}>
            <SearchInput title="学生编号" />
          </Col>
          <Col span={6}>
            <SearchInput title="学生姓名" />
          </Col>
          <Col span={6}>
            <SelectInput
              title="专业"
              options={[
                { value: '计算机科学与技术', label: '计算机科学与技术' },
                { value: '软件工程', label: '软件工程' },
              ]}
              value={major}
              onChange={value => {
                setMajor(value)
                setClassName('')
              }}
            />
          </Col>
          <Col span={6}>
            <SelectInput
              title="班级"
              options={
                major === '计算机科学与技术'
                  ? [
                      { value: '计算机科学与技术1班', label: '计算机科学与技术1班' },
                      { value: '计算机科学与技术2班', label: '计算机科学与技术2班' },
                      { value: '计算机科学与技术3班', label: '计算机科学与技术3班' },
                    ]
                  : major === '软件工程'
                    ? [
                        { value: '软件工程1班', label: '软件工程1班' },
                        { value: '软件工程2班', label: '软件工程2班' },
                        { value: '软件工程3班', label: '软件工程3班' },
                      ]
                    : []
              }
              value={className}
              onChange={value => setClassName(value)}
              disabled={!major}
            />
          </Col>
        </Row>
        <Row style={{ marginTop: '15px' }}>
          <Col span={24}>
            <Radio.Group
              className={styles['radio-group']}
              name="radiogroup"
              defaultValue={1}
              options={[
                { value: 1, label: '男' },
                { value: 2, label: '女' },
              ]}
            />
          </Col>
        </Row>
        <Row style={{ marginTop: '15px', justifyContent: 'flex-end' }}>
          <Button
            type="primary"
            onClick={() => {
              // 清除localStorage中的菜单列表，强制重新获取
              localStorage.removeItem('menuList')
              localStorage.removeItem('privileges')
              // 跳转到课表编辑页面，并传递专业和班级信息
              navigate('/schedule/edit', {
                state: {
                  major: major,
                  className: className,
                },
              })
            }}
            disabled={!className}
          >
            编辑课表
          </Button>
        </Row>
      </Card>

      {/* 主要内容区域 */}
      <Row style={{ marginTop: '20px' }}>
        {/* 学生表格 */}
        <Col span={16}>
          <StudentTable onSelectStudent={handleStudentSelect} />
        </Col>

        {/* 右侧图表和课表 */}
        <Col span={8}>
          <Card title="学生课表" style={{ marginBottom: '15px' }}>
            <StudentSchedule student={selectedStudent} />
          </Card>
          <Card title="性别比例" style={{ marginBottom: '15px' }}>
            <GenderChart />
          </Card>
          <Card title="班级分布">
            <ClassDistributionChart />
          </Card>
        </Col>
      </Row>
    </div>
  )
}
