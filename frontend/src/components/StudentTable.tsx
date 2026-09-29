import { ArrowDown, ArrowUp, ArrowUpRight, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { Student } from '../types';
import { formatChange } from '../utils';
import { RiskBadge } from './ui';

export function StudentTable({ students }: { students: Student[] }) {
  const navigate = useNavigate();
  return (
    <div className="table-scroll">
      <table className="student-table">
        <thead><tr><th>Student ID</th><th>Course</th><th>Risk Level</th><th>Risk Score</th><th>Engagement</th><th>LMS Activity</th><th>Assessment Score</th><th>Trend</th><th>Last Updated</th><th>Action</th></tr></thead>
        <tbody>
          {students.map((student) => {
            const TrendIcon = student.trendDirection === 'down' ? ArrowDown : student.trendDirection === 'up' ? ArrowUp : ChevronRight;
            return (
              <tr key={student.id} tabIndex={0} onClick={() => navigate(`/students/${student.id}`)} onKeyDown={(event) => { if (event.key === 'Enter') navigate(`/students/${student.id}`); }}>
                <td><span className="student-id">{student.id}</span></td>
                <td><span className="course-cell">{student.course}<small>{student.module}</small></span></td>
                <td><RiskBadge risk={student.risk} /></td>
                <td><strong className={`score-value ${student.risk.toLowerCase()}`}>{student.riskScore}%</strong><small className="table-demo-note">demo</small></td>
                <td><span className="engagement-cell"><span className="engagement-meter"><i style={{ width: `${student.engagement}%` }} /></span>{student.engagement}%</span></td>
                <td><span className={`table-change ${student.lmsActivityChange < 0 ? 'decline' : 'improve'}`}>{formatChange(student.lmsActivityChange)}</span></td>
                <td>{student.assessmentScore}%</td>
                <td><span className={`table-trend ${student.trendDirection}`}><TrendIcon size={15} />{student.trendDirection === 'up' ? 'Improving' : student.trendDirection === 'down' ? 'Declining' : 'Stable'}</span></td>
                <td className="updated-cell">{student.lastUpdated}</td>
                <td><button className="table-action" aria-label={`Open ${student.id}`} onClick={(event) => { event.stopPropagation(); navigate(`/students/${student.id}`); }}><ArrowUpRight size={15} /></button></td>
              </tr>
            );
          })}
          {students.length === 0 && <tr><td className="table-empty" colSpan={10}>No students match these filters. Adjust search or risk level.</td></tr>}
        </tbody>
      </table>
    </div>
  );
}
