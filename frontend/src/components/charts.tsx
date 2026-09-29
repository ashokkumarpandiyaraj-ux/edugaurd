import { Cell, CartesianGrid, Label, Legend, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { CohortRiskPoint, TrendPoint, RiskLevel } from '../types';

const tooltipStyle = { background: '#101f32', border: '1px solid rgba(123, 154, 184, .18)', borderRadius: 12, color: '#eaf4ff', fontSize: 12, boxShadow: '0 12px 28px rgba(0,0,0,.32)' };
const tickStyle = { fill: '#71879f', fontSize: 11 };

export function EngagementChart({ data, height = 250, currentLabel = 'Current engagement', referenceLabel = 'Reference trend' }: { data: TrendPoint[]; height?: number; currentLabel?: string; referenceLabel?: string }) {
  return (
    <div className="chart-wrap" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 12, left: -19, bottom: 0 }}>
          <CartesianGrid stroke="rgba(125, 154, 184, .11)" vertical={false} />
          <XAxis dataKey="week" tick={tickStyle} tickLine={false} axisLine={false} interval={0} minTickGap={6} />
          <YAxis domain={[40, 100]} ticks={[40, 55, 70, 85, 100]} tick={tickStyle} tickLine={false} axisLine={false} tickFormatter={(value: number) => `${value}%`} />
          <Tooltip contentStyle={tooltipStyle} itemStyle={{ color: '#d8e7f6' }} labelStyle={{ color: '#91a8c1', marginBottom: 4 }} formatter={(value: number, name: string) => [`${value}%`, name === 'engagement' ? currentLabel : referenceLabel]} />
          <Legend verticalAlign="bottom" height={32} iconType="circle" iconSize={7} wrapperStyle={{ color: '#9aadc2', fontSize: 11 }} formatter={(value) => <span className="chart-legend-label">{value === 'engagement' ? currentLabel : referenceLabel}</span>} />
          <Line name="engagement" type="monotone" dataKey="engagement" stroke="#36d7e7" strokeWidth={2.5} dot={{ r: 3, fill: '#36d7e7', stroke: '#0c192a', strokeWidth: 2 }} activeDot={{ r: 5, stroke: '#e5fdff', strokeWidth: 2 }} />
          <Line name="reference" type="monotone" dataKey="reference" stroke="#72879f" strokeWidth={1.6} strokeDasharray="5 5" dot={false} activeDot={{ r: 4 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export function RiskDistributionChart({ data, onSelect, centerValue, centerLabel = 'students', height = 220 }: { data: CohortRiskPoint[]; onSelect?: (risk: RiskLevel) => void; centerValue?: string; centerLabel?: string; height?: number }) {
  const total = data.reduce((sum, point) => sum + point.value, 0);
  const shownTotal = centerValue ?? total.toLocaleString();
  return (
    <div className="risk-chart-container" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Tooltip contentStyle={tooltipStyle} formatter={(value: number, name: RiskLevel) => [value.toLocaleString(), `${name} early risk`]} />
          <Pie data={data} dataKey="value" nameKey="name" innerRadius={62} outerRadius={83} paddingAngle={4} stroke="none" cornerRadius={4} onClick={(_, index) => data[index] && onSelect?.(data[index].name)} style={{ cursor: onSelect ? 'pointer' : 'default' }}>
            {data.map((point) => <Cell key={point.name} fill={point.color} />)}
            <Label position="center" content={({ viewBox }) => {
              if (!viewBox) return null;
              const cx = 'cx' in viewBox ? viewBox.cx : undefined;
              const cy = 'cy' in viewBox ? viewBox.cy : undefined;
              if (typeof cx !== 'number' || typeof cy !== 'number') return null;
              return <g><text x={cx} y={cy - 2} textAnchor="middle" fill="#f3f8ff" fontSize="23" fontWeight="700">{shownTotal}</text><text x={cx} y={cy + 17} textAnchor="middle" fill="#8ca1b8" fontSize="9">{centerLabel}</text></g>;
            }} />
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="risk-legend">
        {data.map((point) => <button className="risk-legend-item" key={point.name} disabled={!onSelect} onClick={() => onSelect?.(point.name)}><span style={{ background: point.color }} /> <span>{point.name}</span><strong>{point.value.toLocaleString()}</strong></button>)}
      </div>
    </div>
  );
}
