import React, { useState } from 'react'
import NumberCard from '../../components/numberCard'
import { Row, Col, Card, Button, Space, Input, Select, DatePicker, Tabs, Checkbox } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import ScheduleTable from './components/scheduleTable'
import styles from './scheduleStatistics.module.scss'
import LineChart from './components/lineChart'
import PieChart from './components/pieChart'
import BarChart from './components/barChart'

const { TabPane } = Tabs

const { RangePicker } = DatePicker

const ScheduleStatistics: React.FC = () => {
  const [searchKeyword, setSearchKeyword] = useState('')
  const [filterType, setFilterType] = useState('')
  const [dateRange, setDateRange] = useState<any>(null)

  const handleSearch = () => {
    // 搜索逻辑
    console.log('搜索', { searchKeyword, filterType, dateRange })
  }

  return (
    <div className={styles.scheduleStatistics}>
      {/* 页面头部 */}
      <div className={styles.pageHeader}>
        {/* 搜索栏 */}
        <div className={styles.searchBar}>
          <Input
            placeholder="搜索课程名称/教师/教室"
            value={searchKeyword}
            onChange={e => setSearchKeyword(e.target.value)}
            suffix={<SearchOutlined />}
            allowClear
            onClear={handleSearch}
            onPressEnter={handleSearch}
            style={{ width: 300 }}
          />
          <Button type="default" style={{ marginLeft: 10 }} onClick={handleSearch}>
            搜索
          </Button>
        </div>

        {/* 筛选栏 */}
        <div className={styles.filterBar}>
          <Select
            placeholder="选择排课状态"
            value={filterType}
            onChange={setFilterType}
            allowClear
            style={{ width: 150, marginRight: 10 }}
            options={[
              { label: '全部', value: '' },
              { label: '正常', value: 'normal' },
              { label: '冲突', value: 'conflict' },
              { label: '已完成', value: 'completed' },
              { label: '未开课', value: 'notStarted' },
            ]}
          />
          <RangePicker
            placeholder={['开始日期', '结束日期']}
            value={dateRange}
            onChange={setDateRange}
            allowClear
            style={{ marginRight: 10 }}
          />
          <Select
            placeholder="选择教室"
            allowClear
            style={{ width: 150, marginRight: 10 }}
            options={[
              { label: '全部', value: '' },
              { label: 'CJ1-101', value: 'CJ1-101' },
              { label: 'CJ1-102', value: 'CJ1-102' },
              { label: 'CJ2-201', value: 'CJ2-201' },
              { label: 'CJ2-202', value: 'CJ2-202' },
            ]}
          />
          <Select
            placeholder="选择教师"
            allowClear
            style={{ width: 150, marginRight: 10 }}
            options={[
              { label: '全部', value: '' },
              { label: '李教授', value: '李教授' },
              { label: '王教授', value: '王教授' },
              { label: '张讲师', value: '张讲师' },
              { label: '刘讲师', value: '刘讲师' },
            ]}
          />
        </div>

        {/* 操作按钮 */}
        <div className={styles.actionBar}>
          <Button type="default" style={{ marginRight: 20 }}>
            导出数据
          </Button>
          <Button type="default" style={{ marginRight: 20 }}>
            刷新
          </Button>
        </div>
      </div>

      {/* 统计卡片 */}
      <Row gutter={10} style={{ marginTop: 20 }}>
        <Col span={6}>
          <NumberCard
            cardIcon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-6 h-6"
              ></svg>
            }
            title={'总排课节数'}
            value={120}
            compareText={'较上周'}
            compareValue={+10}
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
              ></svg>
            }
            title={'正常排课'}
            value={100}
            compareText={'较上周'}
            compareValue={+8}
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
              ></svg>
            }
            title={'异常/冲突排课'}
            value={5}
            compareText={'较上周'}
            compareValue={-2}
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
              ></svg>
            }
            title={'教室使用率'}
            value={85}
            compareText={'较上周'}
            compareValue={+5}
          />
        </Col>
      </Row>

      {/* 图表 */}
      <Row gutter={10} style={{ marginTop: '20px' }}>
        <Col span={8}>
          <Card title="教师课时统计（分学院 & 职称）">
            <BarChart />
          </Card>
        </Col>
        <Col span={8}>
          <Card title="课程类型分布">
            <PieChart />
          </Card>
        </Col>
        <Col span={8}>
          <Card title="每日排课趋势">
            <LineChart />
          </Card>
        </Col>
      </Row>

      {/* 表格 */}
      <Row style={{ marginTop: '20px' }}>
        <Col span={24}>
          <Card title="智能排课明细总表">
            {/* 筛选栏 */}
            <div
              style={{
                marginBottom: 10,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: 10,
              }}
            >
              <Space>
                <Select
                  placeholder="所属学院"
                  style={{ width: 150 }}
                  mode="multiple"
                  options={[
                    { label: '计算机学院', value: 'computer' },
                    { label: '理学院', value: 'science' },
                    { label: '外国语学院', value: 'foreign' },
                    { label: '机械学院', value: 'mechanical' },
                    { label: '经管学院', value: 'economic' },
                  ]}
                />
                <Select
                  placeholder="授课教师"
                  style={{ width: 150 }}
                  showSearch
                  optionFilterProp="label"
                  options={[
                    { label: '张明', value: 'zhangming' },
                    { label: '王芳', value: 'wangfang' },
                    { label: '李明', value: 'liming' },
                  ]}
                />
                <Select
                  placeholder="周次"
                  style={{ width: 150 }}
                  options={[
                    { label: '1-4周', value: '1-4' },
                    { label: '5-8周', value: '5-8' },
                    { label: '9-12周', value: '9-12' },
                    { label: '13-18周', value: '13-18' },
                  ]}
                />
                <Select
                  placeholder="星期"
                  style={{ width: 100 }}
                  options={[
                    { label: '周一', value: '1' },
                    { label: '周二', value: '2' },
                    { label: '周三', value: '3' },
                    { label: '周四', value: '4' },
                    { label: '周五', value: '5' },
                  ]}
                />
                <Select
                  placeholder="排课状态"
                  style={{ width: 120 }}
                  options={[
                    { label: '全部', value: '' },
                    { label: '正常', value: 'normal' },
                    { label: '待确认', value: 'pending' },
                    { label: '冲突预警', value: 'conflict' },
                    { label: '已调课', value: 'adjusted' },
                  ]}
                />
                <Space>
                  <span>仅看冲突</span>
                  <Checkbox />
                </Space>
              </Space>
              <Button type="default">查询</Button>
            </div>
            <ScheduleTable />
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default ScheduleStatistics
