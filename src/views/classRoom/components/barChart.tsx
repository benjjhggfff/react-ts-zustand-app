import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { RechartsDevtools } from '@recharts/devtools';

// #region 利用率数据（日期+利用率语义）
const data = [
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
];
// #endregion

const SimpleBarChart = () => {
  return (
   
    <div
      style={{
        width: '100%',        
        minHeight: '100%',    
        display: 'flex',      
        justifyContent: 'center', 
        alignItems: 'center',    
        padding: '10px 0',    
        margin: '0 auto'     
      }}
    >
      <BarChart
        style={{ width: '98%', maxWidth: '98%', maxHeight: '98%', height: '100%', aspectRatio: 1.618 }}
        responsive
        data={data}
        height={550}          // 从500调整到550，实现“稍微放大”（仅微调，不夸张）
        margin={{
          top: 10,            // 微调margin避免内容裁剪
          right: 10,
          left: 10,
          bottom: 20,         // 增加底部留白，适配日期标签
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        {/* 日期标签轻微旋转，避免重叠 */}
        <XAxis 
          dataKey="name" 
          tick={{ angle: -10, textAnchor: 'end' }} 
        />
        {/* Y轴标注“利用率”，保留原有样式 */}
        <YAxis 
          width="auto" 
          label={{ 
            value: '利用率', 
            angle: -90,
            position: 'insideLeft',
            style: { textAnchor: 'middle' }
          }} 
        />
        {/* Tooltip适配利用率语义 */}
        <Tooltip 
          formatter={(value) => [value, '利用率']}
          labelFormatter={(label) => `日期：${label}`}
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
  );
};

export default SimpleBarChart;