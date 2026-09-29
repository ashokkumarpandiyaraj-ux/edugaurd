import { Activity, ArrowRight, BookOpenCheck, GraduationCap, ShieldAlert, UsersRound } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { engagementTrend } from '../data';
import { useStudents } from '../lib/students';
import { AlertCards } from '../components/AlertCards';
import { EngagementChart, RiskDistributionChart } from '../components/charts';
import { KpiCard, PageHeading, Panel, SectionHeader } from '../components/ui';
import type { RiskLevel } from '../types';

export function DashboardPage() {
  const navigate = useNavigate();
  const { students, loading, error } = useStudents();
  const alerts = students.filter((student) => student.risk !== 'LOW').sort((a, b) => b.riskScore - a.riskScore).slice(0, 4);
  const counts = { LOW: students.filter((student) => student.risk === 'LOW').length, MEDIUM: students.filter((student) => student.risk === 'MEDIUM').length, HIGH: students.filter((student) => student.risk === 'HIGH').length };
  const cohortRisk = [{ name: 'LOW' as const, value: counts.LOW, color: '#49d6a0' }, { name: 'MEDIUM' as const, value: counts.MEDIUM, color: '#f0b84a' }, { name: 'HIGH' as const, value: counts.HIGH, color: '#fa6572' }];
  const openRiskFilter = (risk: RiskLevel) => navigate(`/students?risk=${risk}`);

  return (
    <div className="page-stack page-enter">
      <PageHeading eyebrow="COHORT OVERVIEW · WEEK 8" title="Good morning, Alex" description="A clearer view of engagement shifts across your faculty cohort." actions={<span className="snapshot-pill"><span className="status-dot" /> Snapshot updated today</span>} />
      <div className="cohort-disclosure"><span className="disclosure-icon"><Activity size={15} /></span><span><strong>Class-level overview</strong> · 500 students, with a 24-record synthetic sample for student-level demo interactions.</span><span className="disclosure-tag">Prototype data</span></div>
      <div className="kpi-grid">
        <KpiCard label="Total students" value={String(students.length)} description="Available records" trend="" icon={UsersRound} tone="cyan" />
        <KpiCard label="Avg. engagement" value="72%" description="Last 8 weeks" trend="↓ 3.8%" icon={Activity} tone="amber" />
        <KpiCard label="High risk" value={String(counts.HIGH)} description="Faculty review recommended" trend="" icon={ShieldAlert} tone="red" />
        <KpiCard label="Medium risk" value={String(counts.MEDIUM)} description="Keep an eye on changes" trend="" icon={BookOpenCheck} tone="amber" />
        <KpiCard label="Low risk" value={String(counts.LOW)} description="Stable engagement signals" trend="" icon={GraduationCap} tone="green" />
      </div>

      <div className="dashboard-charts-grid">
        <Panel className="chart-panel engagement-panel">
          <SectionHeader title="Engagement Trend" subtitle="Current cohort signal compared with a prior-period reference" action={<span className="chart-window">8-week view</span>} />
          <EngagementChart data={engagementTrend} height={280} />
          <div className="chart-observation"><span className="observation-dot" /> Engagement has eased over the recent weeks. Review context before deciding on support.</div>
        </Panel>
        <Panel className="chart-panel distribution-panel">
          <SectionHeader title="Risk Distribution" subtitle="Class-level cohort overview" action={<span className="click-hint"><ArrowRight size={13} /> Select a category</span>} />
          <RiskDistributionChart data={cohortRisk} onSelect={openRiskFilter} centerValue={String(students.length)} centerLabel="students" height={263} />
          <div className="chart-observation subdued">Risk bands are early-warning signals, not academic outcomes.</div>
        </Panel>
      </div>

      <Panel className="early-alerts-panel">
        <SectionHeader title="Early Alerts" subtitle="Warning signals that may benefit from a faculty check-in." action={<button className="text-link" onClick={() => navigate('/alerts')}>View all alerts <ArrowRight size={15} /></button>} />
        <AlertCards students={alerts} compact />
      </Panel>
      <div className="dashboard-footer-note"><GraduationCap size={15} /><span>Signals are for supportive faculty review only. Faculty members make the final decision; no automated academic actions are taken.</span></div>
    </div>
  );
}
