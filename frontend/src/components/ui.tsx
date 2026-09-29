import type { HTMLAttributes, ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';
import type { RiskLevel } from '../types';

export function PageHeading({ eyebrow, title, description, actions }: { eyebrow?: string; title: string; description?: string; actions?: ReactNode }) {
  return (
    <div className="page-heading">
      <div>
        {eyebrow && <span className="eyebrow">{eyebrow}</span>}
        <h1>{title}</h1>
        {description && <p>{description}</p>}
      </div>
      {actions && <div className="page-actions">{actions}</div>}
    </div>
  );
}

export function Panel({ children, className = '', ...props }: { children: ReactNode; className?: string } & HTMLAttributes<HTMLElement>) {
  return <section className={`panel ${className}`} {...props}>{children}</section>;
}

export function SectionHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: ReactNode }) {
  return (
    <div className="section-header">
      <div><h2>{title}</h2>{subtitle && <p>{subtitle}</p>}</div>
      {action && <div className="section-action">{action}</div>}
    </div>
  );
}

export function RiskBadge({ risk, label }: { risk: RiskLevel; label?: string }) {
  return <span className={`risk-badge risk-${risk.toLowerCase()}`}><span className="risk-dot" />{label ?? risk}</span>;
}

export function TrendLabel({ value, suffix = 'vs prior period' }: { value: number; suffix?: string }) {
  const direction = value < 0 ? 'negative' : value > 0 ? 'positive' : 'neutral';
  return <span className={`trend-label ${direction}`}><span>{value < 0 ? '↓' : value > 0 ? '↑' : '→'} {Math.abs(value)}%</span><small>{suffix}</small></span>;
}

export function KpiCard({ label, value, description, trend, icon: Icon, tone = 'cyan' }: { label: string; value: string; description: string; trend: string; icon: LucideIcon; tone?: 'cyan' | 'green' | 'amber' | 'red' }) {
  return (
    <article className="kpi-card panel">
      <div className="kpi-top"><span className="kpi-label">{label}</span><span className={`kpi-icon ${tone}`}><Icon size={17} strokeWidth={1.8} /></span></div>
      <div className="kpi-value">{value}</div>
      <div className="kpi-bottom"><span>{description}</span><span className="kpi-trend">{trend}</span></div>
    </article>
  );
}

export function SelectField({ label, value, onChange, options, className = '' }: { label: string; value: string; onChange: (value: string) => void; options: Array<{ label: string; value: string }>; className?: string }) {
  return (
    <label className={`field-select ${className}`}>
      <span>{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)}>
        {options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
      </select>
    </label>
  );
}

export function Disclaimer({ children }: { children: ReactNode }) {
  return <div className="disclaimer"><span className="disclaimer-mark">i</span><p>{children}</p></div>;
}
