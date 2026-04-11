import React, { useState, useMemo, useEffect } from 'react'
import NumberCard from '../../components/numberCard'
import { Row, Col, Card } from 'antd'
import LineChart from './components/lineChart'
import RadarChart, { type RadarChartProps } from './components/radarChart'
import BarChart from './components/barChart'
import SearchInput from '../../components/searchInput'
import SelectInput from '../../components/selectInput'
import RoomTable from './components/roomTable'
import styles from './classRoom.module.scss'
// 引入本地缓存
// #region Sample data

const ClassRoom: React.FC = () => {
  // 筛选状态
  const [searchText, setSearchText] = useState('')
  const [typeFilter, setTypeFilter] = useState<number | undefined>(undefined)
  const [statusFilter, setStatusFilter] = useState<number | undefined>(undefined)
  const [timeFilter, setTimeFilter] = useState<string | undefined>(undefined)
  // const [RadarChartData, setDataRadarChartData] = useState<RadarChartProps[]>([])

  // 👇👇👇 卡片真实数据状态（关键）
  const [totalRooms, setTotalRooms] = useState(0)
  const [usableRooms, setUsableRooms] = useState(0)
  const [todayApplies, setTodayApplies] = useState(0)
  const [totalApplies, setTotalApplies] = useState(0)

  const [RadarChartData, setDataRadarChartData] = useState<RadarChartProps[]>([])
  const dataRadarChart = useMemo(
    () => [
      { subject: 'Math', A: 120, B: 110, fullMark: 150 },
      { subject: 'Chinese', A: 98, B: 130, fullMark: 150 },
      { subject: 'English', A: 86, B: 130, fullMark: 150 },
      { subject: 'Geography', A: 99, B: 100, fullMark: 150 },
      { subject: 'Physics', A: 85, B: 90, fullMark: 150 },
      { subject: 'History', A: 65, B: 85, fullMark: 150 },
    ],
    []
  )
  const barChartData = useMemo(
    () => [
      {
        name: '2026-01-21',
        uv: 4000,
        利用率: 2400,
        amt: 2400,
      },
      {
        name: '2026-01-22',
        uv: 3000,
        利用率: 1398,
        amt: 2210,
      },
      {
        name: '2026-01-23',
        uv: 2000,
        利用率: 9800,
        amt: 2290,
      },
      {
        name: '2026-01-24',
        uv: 2780,
        利用率: 3908,
        amt: 2000,
      },
      {
        name: '2026-01-25',
        uv: 1890,
        利用率: 4800,
        amt: 2181,
      },
      {
        name: '2026-01-26',
        uv: 2390,
        利用率: 3800,
        amt: 2500,
      },
      {
        name: '2026-01-27',
        uv: 3490,
        利用率: 4300,
        amt: 2100,
      },
    ],
    []
  )
  const dataLineChart = useMemo(
    () => [
      {
        name: '2026-01-21', // 替换原空字符串为日期
        uv: 400,
        pv: 240,
        amt: 240,
      },
      {
        name: '2026-01-22', // 替换Page B为日期
        uv: 300,
        pv: 139,
        amt: 220,
      },
      {
        name: '2026-01-23', // 替换Page C为日期
        uv: 200,
        pv: 560,
        amt: 220,
      },
      {
        name: '2026-01-24', // 替换Page D为日期
        uv: 270,
        pv: 398,
        amt: 200,
      },
      {
        name: '2026-01-25', // 替换Page E为日期
        uv: 189,
        pv: 480,
        amt: 211,
      },
      {
        name: '2026-01-26', // 替换Page F为日期
        uv: 239,
        pv: 380,
        amt: 250,
      },
      {
        name: '2026-01-27', // 替换Page G为日期
        uv: 340,
        pv: 430,
        amt: 210,
      },
    ],
    []
  )

  useEffect(() => {
    // 模拟接口请求
    setTimeout(() => {
      setDataRadarChartData(dataRadarChart)
    }, 500)
  }, [])

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
              <RadarChart data={RadarChartData} />
            </Card>
          </Col>
          <Col span={12}>
            <Card>
              <LineChart data={dataLineChart} />
            </Card>
          </Col>
          <Col span={6}>
            <Card style={{ height: '90%' }}>
              <BarChart data={barChartData} />
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
