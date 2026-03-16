import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// 教师课时统计数据（分学院 & 职称）
const data = [
  {
    college: '计算机学院',
    professor: 18,
    associateProfessor: 25,
    lecturer: 32,
    assistant: 10,
  },
  {
    college: '外国语学院',
    professor: 12,
    associateProfessor: 20,
    lecturer: 28,
    assistant: 8,
  },
  {
    college: '理学院',
    professor: 20,
    associateProfessor: 22,
    lecturer: 30,
    assistant: 12,
  },
  {
    college: '机械学院',
    professor: 15,
    associateProfessor: 28,
    lecturer: 35,
    assistant: 15,
  },
  {
    college: '经管学院',
    professor: 10,
    associateProfessor: 25,
    lecturer: 30,
    assistant: 10,
  },
];

const BarChartComponent = () => {
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
      <ResponsiveContainer width="95%" height={300}>
        <BarChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
          barCategoryGap={20}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="college" />
          <YAxis label={{ value: '周课时数', angle: -90, position: 'insideLeft' }} />
          <Tooltip />
          <Legend />
          <Bar dataKey="professor" name="教授" stackId="a" fill="#8884d8" />
          <Bar dataKey="associateProfessor" name="副教授" stackId="a" fill="#82ca9d" />
          <Bar dataKey="lecturer" name="讲师" stackId="a" fill="#ffc658" />
          <Bar dataKey="assistant" name="助教" stackId="a" fill="#ff8042" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BarChartComponent;