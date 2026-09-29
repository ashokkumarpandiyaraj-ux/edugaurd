import { useMemo, useState } from 'react';
import { ArrowDownWideNarrow, TriangleAlert } from 'lucide-react';
import { AlertCards } from '../components/AlertCards';
import { StudentFilters } from '../components/Filters';
import { PageHeading, Panel } from '../components/ui';
import { students } from '../data';
import type { RiskLevel } from '../types';
import { riskOrder } from '../utils';

export function AlertsPage() {
  const [query, setQuery] = useState('');
  const [risk, setRisk] = useState<RiskLevel | 'ALL'>('ALL');
  const [course, setCourse] = useState('ALL');
  const [sortByRisk, setSortByRisk] = useState(true);
  const alerts = useMemo(() => students.filter((student) => {
    const normalized = query.trim().toLowerCase();
    return student.risk !== 'LOW'
      && (!normalized || `${student.id} ${student.course} ${student.module}`.toLowerCase().includes(normalized))
      && (risk === 'ALL' || student.risk === risk)
      && (course === 'ALL' || student.course === course || student.module === course);
  }).sort((a, b) => sortByRisk ? (riskOrder[a.risk] - riskOrder[b.risk]) || b.riskScore - a.riskScore : a.id.localeCompare(b.id)), [course, query, risk, sortByRisk]);

  return (
    <div className="page-stack page-enter">
      <PageHeading eyebrow="FACULTY REVIEW QUEUE" title="Early Alerts" description="Potential changes in engagement to review with care and student context." actions={<span className="alert-total-pill"><TriangleAlert size={15} /> {alerts.length} signals in demo sample</span>} />
      <div className="alert-caution"><TriangleAlert size={16} /><span><strong>Early-warning signals, not outcomes.</strong> Review context with the student before considering support.</span></div>
      <Panel className="alerts-list-panel">
        <div className="table-panel-heading"><div><strong>Signals for faculty review</strong><span>Showing medium and high demo signals from the representative sample.</span></div><span className="sort-indicator"><ArrowDownWideNarrow size={14} /> {sortByRisk ? 'Highest score first' : 'Student ID order'}</span></div>
        <StudentFilters query={query} onQuery={setQuery} risk={risk} onRisk={setRisk} course={course} onCourse={setCourse} sortByRisk={sortByRisk} onSort={setSortByRisk} />
        <AlertCards students={alerts} />
        <div className="table-footnote">No automatic outreach or academic action is taken. Faculty members make the final decision.</div>
      </Panel>
    </div>
  );
}
