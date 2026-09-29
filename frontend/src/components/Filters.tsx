import { Search, SlidersHorizontal } from 'lucide-react';
import type { RiskLevel } from '../types';
import { courseModuleOptions } from '../data';
import { SelectField } from './ui';

export function StudentFilters({ query, onQuery, risk, onRisk, course, onCourse, sortByRisk, onSort }: {
  query: string; onQuery: (value: string) => void;
  risk: RiskLevel | 'ALL'; onRisk: (value: RiskLevel | 'ALL') => void;
  course: string; onCourse: (value: string) => void;
  sortByRisk?: boolean; onSort?: (value: boolean) => void;
}) {
  return (
    <div className="filter-bar">
      <label className="search-field"><Search size={16} /><input value={query} onChange={(event) => onQuery(event.target.value)} placeholder="Search student ID or course" aria-label="Search student ID or course" /></label>
      <SelectField label="Risk level" value={risk} onChange={(value) => onRisk(value as RiskLevel | 'ALL')} options={[{ label: 'All risk levels', value: 'ALL' }, { label: 'High risk', value: 'HIGH' }, { label: 'Medium risk', value: 'MEDIUM' }, { label: 'Low risk', value: 'LOW' }]} />
      <SelectField label="Course / module" value={course} onChange={onCourse} options={[{ label: 'All courses / modules', value: 'ALL' }, ...courseModuleOptions.map((name) => ({ label: name, value: name }))]} />
      {onSort && <button className={`sort-button${sortByRisk ? ' active' : ''}`} onClick={() => onSort(!sortByRisk)}><SlidersHorizontal size={15} /> {sortByRisk ? 'Risk score: high first' : 'Sort by risk score'}</button>}
    </div>
  );
}
