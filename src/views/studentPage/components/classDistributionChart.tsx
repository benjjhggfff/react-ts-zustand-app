import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const ClassDistributionChart: React.FC = () => {
  const data = [
    { name: '计算机科学与技术1班', value: 25 },
    { name: '计算机科学与技术2班', value: 25 },
    { name: '计算机科学与技术3班', value: 25 },
    { name: '软件工程1班', value: 25 },
    { name: '软件工程2班', value: 25 },
    { name: '软件工程3班', value: 25 },
  ];

  const COLORS = '#409EFF';

  return (
    <div style={{ height: 200 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" tick={{ fontSize: 10 }} />
          <YAxis />
          <Tooltip />
          <Bar dataKey="value" fill={COLORS} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ClassDistributionChart;