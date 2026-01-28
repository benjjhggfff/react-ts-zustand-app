import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

// #region Sample data
// 仅修改name为日期，其余数值保持不变
const data = [
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
];

// #endregion
const SynchronizedAreaChart = () => {
  return (
   
    <div
      style={{ 
        width: '100%',        
        display: 'flex',        
        justifyContent: 'center', 
        alignItems: 'center',    
        padding: '20px 0',     
        maxHeight: 300,
        margin: '0 auto'        
      }}
    >
      <AreaChart
        width="95%"           // 完全保留你的样式
        height={300}           // 完全保留你的样式
        responsive             // 完全保留你的样式
        data={data}
        syncId="anyId"
      
        margin={{
          top: 20,    // 完全保留你的样式
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
            style: { textAnchor: 'middle' }
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
        /> {/* 完全保留你的Area样式 */}
       
      </AreaChart>
    </div>
  );
};

export default SynchronizedAreaChart;