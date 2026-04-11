import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts'
import { RechartsDevtools } from '@recharts/devtools'
import { memo } from 'react'
export interface RadarChartProps {
  subject: string
  A: number
  B: number
  fullMark: number
}
// #endregion
const SimpleRadarChart = memo(({ data }: { data: RadarChartProps[] }) => {
  console.log('组件更新了')

  return (
    <RadarChart
      style={{ width: '100%', aspectRatio: 1, maxWidth: 600, maxHeight: 300 }}
      responsive
      outerRadius="80%"
      data={data}
      margin={{
        top: 20,
        left: 20,
        right: 20,
        bottom: 20,
      }}
    >
      <PolarGrid />
      <PolarAngleAxis dataKey="subject" />
      <PolarRadiusAxis />
      <Radar name="Mike" dataKey="A" stroke="#3692ba" fill="#bad1f5" fillOpacity={0.6} />
      <RechartsDevtools />
    </RadarChart>
  )
})

export default SimpleRadarChart
