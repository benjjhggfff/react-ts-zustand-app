import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'
import { memo } from 'react'
export interface LineChartDataProps {
  name: string
  uv: number
  pv: number
  amt: number
}
// #region Sample data
// 仅修改name为日期，其余数值保持不变

// #endregion
const SynchronizedAreaChart = memo(({ data }: { data: LineChartDataProps[] }) => {
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
      <AreaChart
        width="95%" // 完全保留你的样式
        height={300} // 完全保留你的样式
        responsive // 完全保留你的样式
        data={data}
        syncId="anyId"
        margin={{
          top: 20, // 完全保留你的样式
          right: 20,
          left: 20,
          bottom: 20,
        }}
      >
        <CartesianGrid strokeDasharray="8 3" /> {/* 完全保留你的样式 */}
        <XAxis dataKey="name" /> {/* 仅dataKey仍为name，但name值已改为日期 */}
        {/* 仅新增Y轴标签为“预约次数”，其余样式（width:auto）保留 */}
        <YAxis
          width="auto"
          label={{
            value: '预约次数',
            angle: -90, // 垂直显示标签，不影响原有样式
            position: 'insideLeft',
            style: { textAnchor: 'middle' },
          }}
        />
        <Tooltip /> {/* 完全保留你的样式 */}
        <Area
          type="monotone"
          dataKey="pv"
          stroke="#a1daef"
          strokeWidth={5}
          strokeDasharray="16 16"
          fill="#a9c6ee"
          animationBegin={400}
          animationDuration={1100}
        />{' '}
        {/* 完全保留你的Area样式 */}
      </AreaChart>
    </div>
  )
})
export default SynchronizedAreaChart
