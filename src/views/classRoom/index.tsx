import React, { useState } from 'react'
import NumberCard from '../../components/numberCard'
import { Row, Col, Card } from 'antd'
import LineChart from './components/lineChart'
import RadarChart from './components/radarChart'
import BarChart from './components/barChart'
import SearchInput from '../../components/searchInput'
import SelectInput from '../../components/selectInput'
import RoomTable from './components/roomTable'
import styles from './classRoom.module.scss'
// 引入本地缓存

const ClassRoom: React.FC = () => {
  // 筛选状态
  const [searchText, setSearchText] = useState('')
  const [typeFilter, setTypeFilter] = useState<number | undefined>(undefined)
  const [statusFilter, setStatusFilter] = useState<number | undefined>(undefined)
  const [timeFilter, setTimeFilter] = useState<string | undefined>(undefined)

  // 👇👇👇 卡片真实数据状态（关键）
  const [totalRooms, setTotalRooms] = useState(0)
  const [usableRooms, setUsableRooms] = useState(0)
  const [todayApplies, setTodayApplies] = useState(0)
  const [totalApplies, setTotalApplies] = useState(0)

  // 下拉选项
  const typeOptions = [
    { label: '普通教室', value: 1 },
    { label: '实训车间', value: 2 },
    { label: '实验室', value: 3 },
    { label: '机房', value: 4 },
    { label: '艺术教室', value: 5 },
    { label: '会议室', value: 6 },
  ]

  const statusOptions = [
    { label: '可用', value: 1 },
    { label: '不可用', value: 0 },
  ]

  const timeOptions = [
    { label: '本周', value: 'week' },
    { label: '本月', value: 'month' },
    { label: '本学期', value: 'term' },
  ]

  // 👇👇👇 卡片数据（已替换成真实动态值）
  let cardData = [
    {
      title: '教室总数',
      value: totalRooms,
      compareText: '较上月',
      compareValue: 0,
      cardIcon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-6 h-6"
        ></svg>
      ),
    },
    {
      title: '可用教室',
      value: usableRooms,
      compareText: '较上月',
      compareValue: 0,
      cardIcon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-6 h-6"
        ></svg>
      ),
    },
    {
      title: '今日预约',
      value: todayApplies,
      compareText: '较昨日',
      compareValue: 0,
      cardIcon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-6 h-6"
        ></svg>
      ),
    },
    {
      title: '总预约',
      value: totalApplies,
      compareText: '较上周',
      compareValue: 0,
      cardIcon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-6 h-6"
        ></svg>
      ),
    },
  ]

  return (
    <>
      <div className={styles.classRoom}>
        {/* 数据卡片 */}
        <Row gutter={10}>
          {cardData.map((item, index) => (
            <Col span={6} key={index + item.title}>
              <NumberCard
                cardIcon={item.cardIcon}
                title={item.title}
                value={item.value}
                compareText={item.compareText}
                compareValue={item.compareValue}
              />
            </Col>
          ))}
        </Row>

        {/* 图表 */}
        <Row gutter={10} style={{ marginTop: '20px', height: '300px' }}>
          <Col span={6}>
            <Card>
              <RadarChart />
            </Card>
          </Col>
          <Col span={12}>
            <Card>
              <LineChart />
            </Card>
          </Col>
          <Col span={6}>
            <Card style={{ height: '90%' }}>
              <BarChart />
            </Card>
          </Col>
        </Row>

        {/* 筛选栏 */}
        <Row gutter={10} style={{ marginTop: '60px' }}>
          <Col span={6}>
            <SelectInput
              options={typeOptions}
              title="请选择教室类型"
              value={typeFilter}
              onChange={val => setTypeFilter(Number(val))}
            />
          </Col>
          <Col span={6}>
            <SelectInput
              options={statusOptions}
              title="请选择状态"
              value={statusFilter}
              onChange={val => setStatusFilter(Number(val))}
            />
          </Col>
          <Col span={6}>
            <SelectInput
              options={timeOptions}
              title="请选择时间"
              value={timeFilter}
              onChange={val => setTimeFilter(val)}
            />
          </Col>
          <Col span={6}>
            <SearchInput
              title="请输入搜索内容"
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
            />
          </Col>
        </Row>

        {/* 表格（已传入更新函数） */}
        <Row>
          <Col span={24}>
            <RoomTable
              searchText={searchText}
              typeFilter={typeFilter}
              statusFilter={statusFilter}
              timeFilter={timeFilter}
              // 👇 关键：把状态设置函数传给表格
              setTotalRooms={setTotalRooms}
              setUsableRooms={setUsableRooms}
              setTodayApplies={setTodayApplies}
              setTotalApplies={setTotalApplies}
            />
          </Col>
        </Row>
      </div>
    </>
  )
}

export default ClassRoom
