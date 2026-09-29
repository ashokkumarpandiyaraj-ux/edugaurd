import { ArrowDownRight, ArrowRight, ArrowUpRight, Clock3, UsersRound } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { Student } from '../types';
import { formatChange } from '../utils';
import { RiskBadge } from './ui';

function evidenceFor(student: Student): string[] {
  switch (student.id) {
    case 'STU-1023': return [`LMS activity ${formatChange(student.lmsActivityChange)}`, `Assignments ${formatChange(student.assessmentSubmissionChange)}`];
    case 'STU-1045': return [`Active days ${formatChange(student.activeDaysChange)}`, `Assessment score ${formatChange(student.assessmentScoreChange)}`];
    case 'STU-1088': return [`LMS activity ${formatChange(student.lmsActivityChange)}`];
    case 'STU-1102': return [`Assessment participation ${formatChange(student.assessmentSubmissionChange)}`];
    default: return [`LMS activity ${formatChange(student.lmsActivityChange)}`, `Engagement ${student.engagement}%`];
  }
}

export function AlertCards({ students, compact = false }: { students: Student[]; compact?: boolean }) {
  const navigate = useNavigate();
  return (
    <div className={`alert-card-list${compact ? ' compact' : ''}`}>
      {students.map((student) => {
        const evidence = evidenceFor(student);
        const TrendIcon = student.trendDirection === 'up' ? ArrowUpRight : student.trendDirection === 'down' ? ArrowDownRight : ArrowRight;
        return (
          <button className="alert-card" key={student.id} onClick={() => navigate(`/students/${student.id}`)}>
            <span className={`alert-edge ${student.risk.toLowerCase()}`} />
            <span className="alert-main">
              <span className="alert-id-row"><span className="student-id">{student.id}</span><RiskBadge risk={student.risk} /></span>
              <span className="alert-course"><UsersRound size={13} /> {student.course} <span>· {student.module}</span></span>
              <span className="alert-evidence">{evidence.map((item) => <span key={item}>{item}</span>)}</span>
            </span>
            <span className="alert-score-block"><span className="alert-score">{student.riskScore}%</span><span className="alert-score-caption">demo signal</span></span>
            <span className={`alert-trend ${student.trendDirection}`}><TrendIcon size={16} /></span>
            <span className="alert-open"><Clock3 size={12} /> {student.lastUpdated}</span>
          </button>
        );
      })}
      {students.length === 0 && <div className="empty-state"><span className="empty-icon"><UsersRound size={19} /></span><strong>No matching students</strong><p>Try adjusting your filters to see other demo warning signals.</p></div>}
    </div>
  );
}
