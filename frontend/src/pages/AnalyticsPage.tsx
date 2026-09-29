import { useMemo, useState } from 'react';
import { Activity, ArrowDownRight, UsersRound } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { MetricTrendChart } from '../components/MetricTrendChart';
import { RiskDistributionChart } from '../components/charts';
import { PageHeading, Panel, SectionHeader, SelectField } from '../components/ui';
import { courseOptions } from '../data';
import { useStudents } from '../lib/students';
import type { CohortRiskPoint, RiskLevel, Student } from '../types';
import { average, clamp } from '../utils';

const colors: Record<RiskLevel, string> = { LOW: '#49d6a0', MEDIUM: '#f0b84a', HIGH: '#fa6572' };
const chartTooltip = { background: '#101f32', border: '1px solid rgba(123, 154, 184, .18)', borderRadius: 12, color: '#eaf4ff', fontSize: 12 };
const tick = { fill: '#71879f', fontSize: 11 };

function buildSeries(rows: Student[], finalWeek: number) {
  return Array.from({ length: finalWeek }, (_, index) => {
    const progress = index / 7;
    const engagement = average(rows.map((student) => student.weeklyEngagement[index] ?? student.engagement));
    const lmsIndex = average(rows.map((student) => 100 * (1 + (student.lmsActivityChange / 100) * progress)));
    const participation = average(rows.map((student) => {
      const initial = 82;
      return clamp(initial * (1 + (student.assessmentSubmissionChange / 100) * progress), 0, 100);
    }));
    const assessmentScore = average(rows.map((student) => {
      const start = clamp(student.assessmentScore - student.assessmentScoreChange, 0, 100);
      return start + (student.assessmentScore - start) * progress;
    }));
    return { week: `Week ${index + 1}`, engagement: Math.round(engagement), lmsIndex: Math.round(lmsIndex), participation: Math.round(participation), assessmentScore: Math.round(assessmentScore) };
  });
}

export function AnalyticsPage() {
  const { students } = useStudents();
  const [course, setCourse] = useState('ALL');
  const [risk, setRisk] = useState<RiskLevel | 'ALL'>('ALL');
  const [week, setWeek] = useState('ALL');
  const rows = useMemo(() => students.filter((student) => (course === 'ALL' || student.course === course || student.module === course) && (risk === 'ALL' || student.risk === risk)), [course, risk]);
  const series = useMemo(() => buildSeries(rows, week === 'ALL' ? 8 : Number(week)), [rows, week]);
  const distribution: CohortRiskPoint[] = (['LOW', 'MEDIUM', 'HIGH'] as const).map((name) => ({ name, value: rows.filter((student) => student.risk === name).length, color: colors[name] }));
  const byCourse = courseOptions.map((name) => ({ course: name, high: rows.filter((student) => student.course === name && student.risk === 'HIGH').length })).filter((item) => course === 'ALL' || item.course === course);
  const avgEngagement = Math.round(average(rows.map((student) => student.engagement)));
  const latest = series[series.length - 1];

  return (
    <div className="page-stack page-enter">
      <PageHeading eyebrow="COHORT PATTERNS" title="Analytics" description="Explore engagement and participation shifts in the representative synthetic sample." actions={<span className="sample-count">{rows.length} <span>demo records in view</span></span>} />
      <Panel className="analytics-filter-panel"><div className="filter-bar analytics-filters"><SelectField label="Course / module" value={course} onChange={setCourse} options={[{ label: 'All courses', value: 'ALL' }, ...courseOptions.map((value) => ({ label: value, value }))]} /><SelectField label="Risk level" value={risk} onChange={(value) => setRisk(value as RiskLevel | 'ALL')} options={[{ label: 'All risk levels', value: 'ALL' }, { label: 'High risk', value: 'HIGH' }, { label: 'Medium risk', value: 'MEDIUM' }, { label: 'Low risk', value: 'LOW' }]} /><SelectField label="Week" value={week} onChange={setWeek} options={[{ label: 'All 8 weeks', value: 'ALL' }, ...Array.from({ length: 8 }, (_, index) => ({ label: `Week ${index + 1}`, value: String(index + 1) }))]} /><span className="analytics-sample-tag"><Activity size={14} /> Synthetic sample analytics</span></div></Panel>
      <div className="analytics-summary-grid"><Panel className="analytics-summary"><span>Average engagement</span><strong>{avgEngagement}%</strong><small>Across filtered demo sample</small></Panel><Panel className="analytics-summary"><span>Current LMS activity index</span><strong>{latest?.lmsIndex ?? 0}</strong><small>Week 1 baseline = 100</small></Panel><Panel className="analytics-summary"><span>Assessment participation</span><strong>{latest?.participation ?? 0}%</strong><small>Illustrative weekly trend</small></Panel><Panel className="analytics-summary"><span>Students in view</span><strong>{rows.length}</strong><small>Representative records</small></Panel></div>
      <div className="analytics-grid">
        <Panel className="chart-panel"><SectionHeader title="Risk Distribution" subtitle="Filtered row-level sample" /><RiskDistributionChart data={distribution} centerValue={String(rows.length)} centerLabel="in sample" height={252} /></Panel>
        <Panel className="chart-panel"><SectionHeader title="High-risk students by course" subtitle="Count in the visible synthetic records" /><div className="chart-wrap" style={{ height: 248 }}><ResponsiveContainer width="100%" height="100%"><BarChart data={byCourse} margin={{ top: 12, right: 12, left: -18, bottom: 4 }}><CartesianGrid stroke="rgba(125, 154, 184, .11)" vertical={false} /><XAxis dataKey="course" tick={tick} tickLine={false} axisLine={false} interval={0} /><YAxis allowDecimals={false} tick={tick} tickLine={false} axisLine={false} /><Tooltip contentStyle={chartTooltip} formatter={(value: number) => [value, 'High-risk demo records']} /><Bar dataKey="high" name="High-risk demo records" radius={[5, 5, 0, 0]}>{byCourse.map((entry) => <Cell key={entry.course} fill="#fa6572" fillOpacity={entry.high ? 0.88 : 0.22} />)}</Bar></BarChart></ResponsiveContainer></div></Panel>
        <Panel className="chart-panel wide-analytics"><SectionHeader title="Engagement & LMS activity" subtitle={`Weekly pattern${week === 'ALL' ? ' · all 8 weeks' : ` · through Week ${week}`}`} action={<span className="chart-window"><ArrowDownRight size={13} /> Engagement trend</span>} /><MetricTrendChart data={series} series={[{ key: 'engagement', label: 'Engagement', color: '#36d7e7' }, { key: 'lmsIndex', label: 'LMS activity index', color: '#9c8cf2' }]} suffix="" height={255} /></Panel>
        <Panel className="chart-panel"><SectionHeader title="Assessment submissions" subtitle="Illustrative participation trend" /><MetricTrendChart data={series} series={[{ key: 'participation', label: 'Submission participation', color: '#f0b84a' }]} height={245} /></Panel>
        <Panel className="chart-panel"><SectionHeader title="Assessment scores" subtitle="Weekly score trend in the visible sample" /><MetricTrendChart data={series} series={[{ key: 'assessmentScore', label: 'Average assessment score', color: '#49d6a0' }]} height={245} /></Panel>
      </div>
      <div className="dashboard-footer-note"><UsersRound size={15} /><span>These charts are synthetic prototype analysis, not a validated institutional disengagement measure.</span></div>
    </div>
  );
}
