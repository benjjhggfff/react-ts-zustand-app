import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

// 每日排课趋势数据
const data = [
  {
    name: '2026-03-10',
    scheduleCount: 15,
  },
  {
    name: '2026-03-11',
    scheduleCount: 18,
  },
  {
    name: '2026-03-12',
    scheduleCount: 12,
  },
  {
    name: '2026-03-13',
    scheduleCount: 20,
  },
  {
    name: '2026-03-14',
    scheduleCount: 16,
  },
  {
    name: '2026-03-15',
    scheduleCount: 8,
  },
  {
    name: '2026-03-16',
    scheduleCount: 14,
  },
];

const LineChart = () => {
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
        width="95%"           
        height={300}           
        responsive             
        data={data}
        syncId="anyId"
        margin={{
          top: 20,    
          right: 20,
          left: 20,
          bottom: 20,
        }}
      >
        <CartesianGrid strokeDasharray="8 3" />
        <XAxis dataKey="name" />
        <YAxis 
          width="auto" 
          label={{ 
            value: '排课节数', 
            angle: -90, 
            position: 'insideLeft',
            style: { textAnchor: 'middle' }
          }} 
        />
        <Tooltip />
        <Area
          type="monotone"
          dataKey="scheduleCount"
          stroke="#a1daef"
          strokeWidth={5}
          strokeDasharray="16 16"
          fill="#a9c6ee"
          animationBegin={400}
          animationDuration={1100}
        />
      </AreaChart>
    </div>
  );
};

export default LineChart;