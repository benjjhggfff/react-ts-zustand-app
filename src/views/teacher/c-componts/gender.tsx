import { Bar, BarChart, Legend,  type LegendPayload, Tooltip, XAxis, YAxis, type RenderableText } from 'recharts';
import { RechartsDevtools } from '@recharts/devtools';


const rawData = `
100+,110838,476160
95-99,1141691,3389124
90-94,6038458,13078242
85-89,18342182,31348041
80-84,37166893,53013079
75-79,65570812,83217973
70-74,103998992,124048996
65-69,138182244,154357035
60-64,170525048,180992721
55-59,206686596,212285997


`
  .trim()
  .split('\n')
  .map(line => {
    const [age, m, f] = line.split(',');
    return { age, male: Number(m), female: Number(f) };
  });

const totalPopulation: number = rawData.reduce((sum, entry) => sum + entry.male + entry.female, 0);

const percentageData = rawData.map(entry => {
  return {
    age: entry.age,
    male: (entry.male / totalPopulation) * -100, // Negative for left side
    female: (entry.female / totalPopulation) * 100,
  };
});

function formatPercent(val: RenderableText): string {
  return `${Math.abs(Number(val)).toFixed(1)}%`;
}

function itemSorter(item: LegendPayload): number {
  // Make legend order match the chart bar order
  return item.value === 'Male' ? 0 : 1;
}
// #endregion

export default function PopulationPyramidExample({ defaultIndex }: { defaultIndex?: number }) {
  return (
    <BarChart
      data={percentageData}
      layout="vertical"
      style={{ width: '100%', maxWidth: '700px', maxHeight: '70vh', aspectRatio: 1 }}
      responsive
      stackOffset="sign"
      barCategoryGap={1}
    >
      <XAxis
        type="number"
        domain={[-10, 10]}
        tickFormatter={formatPercent}
        height={50}
        label={{
          value: '% of total population',
          position: 'insideBottom',
        }}
      />
      <YAxis
        width="auto"
        type="category"
        dataKey="age"
        name="Age group"
        label={{
          value: 'Age group',
          angle: -90,
          position: 'insideLeft',
          offset: 10,
        }}
      />
      <Bar
        stackId="age"
        name="Female"
        dataKey="female"
        fill="#ecc5ca"
        radius={[0, 5, 5, 0]}
        label={{ position: 'right', formatter: formatPercent }}
      />
      <Bar
        stackId="age"
        name="Male"
        dataKey="male"
        fill="#a9c8df"
        radius={[0, 5, 5, 0]}
        label={{ position: 'right', formatter: formatPercent }}
      />
      <Tooltip<number, string> formatter={formatPercent} defaultIndex={defaultIndex} />
      <Legend itemSorter={itemSorter} verticalAlign="top" align="right" />
      <RechartsDevtools />
    </BarChart>
  );
}