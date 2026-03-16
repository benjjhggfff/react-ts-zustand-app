import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'

// 课程类型分布数据（分年级 & 课程类型）
const outerData = [
  { type: '必修课', proportion: 55 },
  { type: '选修课', proportion: 25 },
  { type: '实验课', proportion: 15 },
  { type: '实践课', proportion: 5 },
]

const innerData = [
  { grade: '大一', proportion: 30 },
  { grade: '大二', proportion: 35 },
  { grade: '大三', proportion: 25 },
  { grade: '大四', proportion: 10 },
]

const OUTER_COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042']
const INNER_COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']

const PieChartComponent = () => {
  return (
    <div
      style={{
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '20px 0',
        maxHeight: 300,
        margin: '0 auto',
      }}
    >
      <ResponsiveContainer width="95%" height={300}>
        <PieChart>
          {/* 外环：课程类型 */}
          <Pie
            data={outerData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            fill="#8884d8"
            paddingAngle={2}
            dataKey="proportion"
            label={({ type, percent }) => `${type}: ${(percent * 100).toFixed(0)}%`}
          >
            {outerData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={OUTER_COLORS[index % OUTER_COLORS.length]} />
            ))}
          </Pie>
          {/* 内环：年级 */}
          <Pie
            data={innerData}
            cx="50%"
            cy="50%"
            innerRadius={0}
            outerRadius={50}
            fill="#82ca9d"
            paddingAngle={2}
            dataKey="proportion"
            label={({ grade, percent }) => `${grade}: ${(percent * 100).toFixed(0)}%`}
          >
            {innerData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={INNER_COLORS[index % INNER_COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

export default PieChartComponent
