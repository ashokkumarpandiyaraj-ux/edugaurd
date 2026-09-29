import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const chartTooltip = { background: '#101f32', border: '1px solid rgba(123, 154, 184, .18)', borderRadius: 12, color: '#eaf4ff', fontSize: 12 };
const tickStyle = { fill: '#71879f', fontSize: 11 };

export interface MetricSeries { key: string; label: string; color: string; }

export function MetricTrendChart({ data, series, suffix = '%', height = 245 }: { data: Array<Record<string, string | number>>; series: MetricSeries[]; suffix?: string; height?: number }) {
  return (
    <div className="chart-wrap" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 12, left: -17, bottom: 0 }}>
          <CartesianGrid stroke="rgba(125, 154, 184, .11)" vertical={false} />
          <XAxis dataKey="week" tick={tickStyle} tickLine={false} axisLine={false} interval="preserveStartEnd" />
          <YAxis tick={tickStyle} tickLine={false} axisLine={false} tickFormatter={(value: number) => `${Math.round(value)}${suffix}`} width={42} />
          <Tooltip contentStyle={chartTooltip} labelStyle={{ color: '#91a8c1', marginBottom: 4 }} formatter={(value: number, name: string) => [`${Math.round(value)}${suffix}`, series.find((item) => item.key === name)?.label ?? name]} />
          <Legend verticalAlign="bottom" height={30} iconType="circle" iconSize={7} wrapperStyle={{ fontSize: 11, color: '#9aadc2' }} formatter={(key) => <span className="chart-legend-label">{series.find((item) => item.key === key)?.label ?? key}</span>} />
          {series.map((item) => <Line key={item.key} name={item.key} type="monotone" dataKey={item.key} stroke={item.color} strokeWidth={2.2} dot={false} activeDot={{ r: 4 }} />)}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
