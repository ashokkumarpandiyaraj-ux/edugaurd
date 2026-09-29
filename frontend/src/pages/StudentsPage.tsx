import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { StudentFilters } from '../components/Filters';
import { StudentTable } from '../components/StudentTable';
import { PageHeading, Panel } from '../components/ui';
import { useStudents } from '../lib/students';
import type { RiskLevel } from '../types';
import { riskOrder } from '../utils';

function parseRisk(value: string | null): RiskLevel | 'ALL' {
  return value === 'LOW' || value === 'MEDIUM' || value === 'HIGH' ? value : 'ALL';
}

export function StudentsPage() {
  const { students, loading, error } = useStudents();
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState('');
  const [risk, setRisk] = useState<RiskLevel | 'ALL'>(() => parseRisk(searchParams.get('risk')));
  const [course, setCourse] = useState('ALL');
  const [sortByRisk, setSortByRisk] = useState(true);

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return students.filter((student) => {
      const matchesQuery = !normalized || `${student.id} ${student.course} ${student.module}`.toLowerCase().includes(normalized);
      const matchesRisk = risk === 'ALL' || student.risk === risk;
      const matchesCourse = course === 'ALL' || student.course === course || student.module === course;
      return matchesQuery && matchesRisk && matchesCourse;
    }).sort((a, b) => sortByRisk ? (riskOrder[a.risk] - riskOrder[b.risk]) || b.riskScore - a.riskScore : a.id.localeCompare(b.id));
  }, [course, query, risk, sortByRisk]);

  return (
    <div className="page-stack page-enter">
      <PageHeading eyebrow="FACULTY WORKSPACE" title="Students" description="Search the representative demo sample and review early-warning context—not final academic outcomes." actions={<span className="sample-count">24 <span>synthetic sample records</span></span>} />
      <Panel className="table-panel">
        {(loading || error) && <div className="table-footnote">{loading ? 'Loading student records…' : error}</div>}
        <div className="table-panel-heading"><div><strong>Student records</strong><span>Row-level data is synthetic and for demonstration only.</span></div><span className="visible-count">{filtered.length} shown</span></div>
        <StudentFilters query={query} onQuery={setQuery} risk={risk} onRisk={setRisk} course={course} onCourse={setCourse} sortByRisk={sortByRisk} onSort={setSortByRisk} />
        <StudentTable students={filtered} />
        <div className="table-footnote">Risk scores and contribution bars are prototype demo values. They are not validated model outputs.</div>
      </Panel>
    </div>
  );
}
