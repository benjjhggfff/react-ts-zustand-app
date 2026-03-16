import { ResponsiveContainer, Tooltip, Cell, XAxis, YAxis, CartesianGrid, VisualMap, Heatmap } from 'recharts';

// 教室利用率热力图数据
const data = [
  { building: 'A 座', period: '周一 1-2', utilization: 95 },
  { building: 'A 座', period: '周一 3-4', utilization: 88 },
  { building: 'A 座', period: '周一 5-6', utilization: 75 },
  { building: 'A 座', period: '周一 7-8', utilization: 60 },
  { building: 'A 座', period: '周二 1-2', utilization: 90 },
  { building: 'A 座', period: '周二 3-4', utilization: 85 },
  { building: 'A 座', period: '周二 5-6', utilization: 70 },
  { building: 'A 座', period: '周二 7-8', utilization: 55 },
  { building: 'B 座', period: '周一 1-2', utilization: 60 },
  { building: 'B 座', period: '周一 3-4', utilization: 75 },
  { building: 'B 座', period: '周一 5-6', utilization: 80 },
  { building: 'B 座', period: '周一 7-8', utilization: 65 },
  { building: 'B 座', period: '周二 1-2', utilization: 55 },
  { building: 'B 座', period: '周二 3-4', utilization: 70 },
  { building: 'B 座', period: '周二 5-6', utilization: 85 },
  { building: 'B 座', period: '周二 7-8', utilization: 75 },
  { building: 'C 座', period: '周一 1-2', utilization: 85 },
  { building: 'C 座', period: '周一 3-4', utilization: 90 },
  { building: 'C 座', period: '周一 5-6', utilization: 95 },
  { building: 'C 座', period: '周一 7-8', utilization: 80 },
  { building: 'C 座', period: '周二 1-2', utilization: 90 },
  { building: 'C 座', period: '周二 3-4', utilization: 95 },
  { building: 'C 座', period: '周二 5-6', utilization: 85 },
  { building: 'C 座', period: '周二 7-8', utilization: 75 },
  { building: 'D 座', period: '周一 1-2', utilization: 70 },
  { building: 'D 座', period: '周一 3-4', utilization: 65 },
  { building: 'D 座', period: '周一 5-6', utilization: 75 },
  { building: 'D 座', period: '周一 7-8', utilization: 80 },
  { building: 'D 座', period: '周二 1-2', utilization: 65 },
  { building: 'D 座', period: '周二 3-4', utilization: 70 },
  { building: 'D 座', period: '周二 5-6', utilization: 85 },
  { building: 'D 座', period: '周二 7-8', utilization: 90 },
  { building: '实验楼', period: '周一 1-2', utilization: 50 },
  { building: '实验楼', period: '周一 3-4', utilization: 60 },
  { building: '实验楼', period: '周一 5-6', utilization: 95 },
  { building: '实验楼', period: '周一 7-8', utilization: 100 },
  { building: '实验楼', period: '周二 1-2', utilization: 45 },
  { building: '实验楼', period: '周二 3-4', utilization: 55 },
  { building: '实验楼', period: '周二 5-6', utilization: 100 },
  { building: '实验楼', period: '周二 7-8', utilization: 95 },
];

// 教学楼列表
const buildings = ['A 座', 'B 座', 'C 座', 'D 座', '实验楼'];

// 时段列表
const periods = ['周一 1-2', '周一 3-4', '周一 5-6', '周一 7-8', '周二 1-2', '周二 3-4', '周二 5-6', '周二 7-8'];

const HeatmapChart = () => {
  return (
    <div
      style={{ 
        width: '100%',        
        display: 'flex',        
        justifyContent: 'center', 
        alignItems: 'center',    
        padding: '20px 0',     
        maxHeight: 400,
        margin: '0 auto'        
      }}
    >
      <ResponsiveContainer width="95%" height={400}>
        <Heatmap
          data={data}
          margin={{
            top: 20,
            right: 30,
            bottom: 30,
            left: 30,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            type="category" 
            dataKey="period" 
            tick={{ fontSize: 12 }}
            angle={-45}
            textAnchor="end"
            height={60}
          />
          <YAxis 
            type="category" 
            dataKey="building" 
            tick={{ fontSize: 12 }}
          />
          <Tooltip 
            formatter={(value) => [`利用率: ${value}%`, '利用率']}
            labelFormatter={(label) => `时段: ${label}`}
          />
          <VisualMap
            min={0}
            max={100}
            calculable
            orient="horizontal"
            left="center"
            bottom="10"
            inRange={{ 
              color: ['#E0F3F8', '#4AA5BF', '#1A6680'] 
            }}
          />
          <Cell 
            dataKey="utilization" 
            fill={(entry) => {
              const value = entry.utilization;
              if (value < 30) return '#E0F3F8';
              if (value < 60) return '#4AA5BF';
              if (value < 80) return '#1A6680';
              return '#004D40';
            }}
          />
        </Heatmap>
      </ResponsiveContainer>
    </div>
  );
};

export default HeatmapChart;