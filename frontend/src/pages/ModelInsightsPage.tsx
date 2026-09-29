import { Activity, BookOpen, BrainCircuit, Database, FileBarChart2, Info, ShieldCheck, Workflow } from 'lucide-react';
import { Disclaimer, PageHeading, Panel, SectionHeader } from '../components/ui';

const evaluations = [
  { name: 'Logistic Regression', accuracy: 61.2, note: 'Baseline model', tone: 'muted' },
  { name: 'Decision Tree', accuracy: 57.5, note: 'Interpretable baseline', tone: 'muted' },
  { name: 'Random Forest', accuracy: 63.5, note: 'Selected for this prototype', tone: 'cyan' },
];
const inputs = ['LMS activity', 'Active learning days', 'Assessment submissions', 'Assessment performance', 'Engagement changes over time', 'Previous attempts', 'Studied credits', 'Education / course information'];

export function ModelInsightsPage() {
  return (
    <div className="page-stack page-enter">
      <PageHeading eyebrow="TRANSPARENCY & METHOD" title="Machine Learning Model" description="How the prototype frames early academic risk signals—and where its limits are." actions={<span className="model-based-tag"><ShieldCheck size={13} /> Prototype model summary</span>} />
      <div className="model-flow panel"><div className="flow-title"><Workflow size={16} /> Prototype pipeline</div><div className="flow-steps"><span>Student-level data</span><i>→</i><span>First 8 weeks</span><i>→</i><span>Model-based risk signal</span><i>→</i><span>Faculty review</span></div><p>Risk signals are decision support only. A faculty member reviews context and decides what, if any, support is appropriate.</p></div>
      <div className="model-layout">
        <Panel className="model-performance"><SectionHeader title="Models evaluated" subtitle="Approximate validation accuracy reported for this prototype" /><div className="accuracy-list">{evaluations.map((item) => <div className={`accuracy-row ${item.tone}`} key={item.name}><div className="accuracy-row-top"><div><strong>{item.name}</strong><small>{item.note}</small></div><b>{item.accuracy.toFixed(1)}<span>%</span></b></div><div className="accuracy-track"><span style={{ width: `${item.accuracy}%` }} /></div></div>)}</div><div className="model-selection-note"><BrainCircuit size={16} /><p>Random Forest was selected for this prototype because it achieved the strongest validation performance among the evaluated models.</p></div><div className="validation-caveat"><Info size={14} /><span>Reported values are prototype validation figures, not a guarantee of future performance or institution-wide validity.</span></div></Panel>
        <Panel className="model-inputs"><SectionHeader title="Model input categories" subtitle="Weekly/student-level features used by the prototype design" /><div className="input-category-grid">{inputs.map((name, index) => <div className="input-category" key={name}><span>{String(index + 1).padStart(2, '0')}</span><strong>{name}</strong><Activity size={14} /></div>)}</div><div className="input-note"><Database size={15} /><span>The Random Forest artifact is not connected in this demo. See the API status in the top bar.</span></div></Panel>
      </div>
      <Panel className="methodology-panel"><SectionHeader title="Dataset context & prototype proxy" subtitle="A transparent distinction between course outcome and disengagement" action={<span className="prototype-tag"><BookOpen size={13} /> OULAD context</span>} /><div className="methodology-grid"><div className="methodology-copy"><h3>OULAD does not contain a direct “disengagement” label.</h3><p>The prototype uses eventual course outcome as a <strong>proxy target</strong>, not as a directly observed disengagement label:</p><div className="proxy-mapping"><span><b>Pass / Distinction</b><i>→</i><strong className="proxy-low">LOW</strong></span><span><b>Fail</b><i>→</i><strong className="proxy-medium">MEDIUM</strong></span><span><b>Withdrawn</b><i>→</i><strong className="proxy-high">HIGH</strong></span></div></div><div className="methodology-visual"><div className="method-icon"><FileBarChart2 size={20} /></div><strong>Early warning window</strong><span>First 8 weeks</span><p>Raw course data is transformed into weekly/student-level features for this prototype concept.</p><span className="not-validated-stamp">NOT VALIDATED</span></div></div><Disclaimer>This proxy is not a clinically or institutionally validated disengagement label. It should not be used to make a final academic decision.</Disclaimer></Panel>
      <div className="decision-footer"><ShieldCheck size={15} /><span>“Risk” is a temporary warning signal for supportive review—not a permanent label, certain outcome, or instruction to punish a student.</span></div>
    </div>
  );
}
