import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'
import { RechartsDevtools } from '@recharts/devtools'
import { memo } from 'react'

export interface BarChartDataProps {
  name: string
  uv: number
  利用率: number
  amt: number
}
// #region 利用率数据（日期+利用率语义）

// #endregion

const SimpleBarChart = memo(({ data }: { data: BarChartDataProps[] }) => {
  return (
    <div
      style={{
        width: '100%',
        minHeight: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '10px 0',
        margin: '0 auto',
      }}
    >
      <BarChart
        style={{
          width: '98%',
          maxWidth: '98%',
          maxHeight: '98%',
          height: '100%',
          aspectRatio: 1.618,
        }}
        responsive
        data={data}
        height={550} // 从500调整到550，实现“稍微放大”（仅微调，不夸张）
        margin={{
          top: 10, // 微调margin避免内容裁剪
          right: 10,
          left: 10,
          bottom: 20, // 增加底部留白，适配日期标签
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        {/* 日期标签轻微旋转，避免重叠 */}
        <XAxis dataKey="name" tick={{ angle: -10, textAnchor: 'end' }} />
        {/* Y轴标注“利用率”，保留原有样式 */}
        <YAxis
          width="auto"
          label={{
            value: '利用率',
            angle: -90,
            position: 'insideLeft',
            style: { textAnchor: 'middle' },
          }}
        />
        {/* Tooltip适配利用率语义 */}
        <Tooltip
          formatter={value => [value, '利用率']}
          labelFormatter={label => `日期：${label}`}
        />
        <Legend />
        {/* 保留所有柱状图样式：颜色、圆角、activeBar交互 */}
        <Bar
          dataKey="利用率"
          fill="#8884d8"
          activeBar={{ fill: 'pink', stroke: 'blue' }}
          radius={[10, 10, 0, 0]}
        />
        <RechartsDevtools />
      </BarChart>
    </div>
  )
})

export default SimpleBarChart
