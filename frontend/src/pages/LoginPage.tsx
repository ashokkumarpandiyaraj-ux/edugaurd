import { useState } from 'react';
import { ArrowRight, ArrowUpRight, Check, GraduationCap, ShieldCheck, Sparkles } from 'lucide-react';
import { useDemoSession } from '../SessionContext';

export function LoginPage() {
  const { enterDemo } = useDemoSession();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <main className="login-page">
      <div className="login-orb orb-one" /><div className="login-orb orb-two" />
      <div className="login-topline"><span className="brand-lockup login-brand"><img className="brand-icon" src="/eduguard-icon.png" alt="" /><span><strong>EduGuard <em>AI</em></strong><small>Early Academic Risk Intelligence</small></span></span><span className="secure-demo"><ShieldCheck size={14} /> Faculty decision support</span></div>
      <div className="login-layout">
        <section className="login-story">
          <span className="eyebrow"><Sparkles size={13} /> EARLY SUPPORT INTELLIGENCE</span>
          <h1>See the signal.<br /><span>Support the student.</span></h1>
          <p>Bring engagement patterns into view—so faculty can ask better questions, offer timely support, and make the final decision with context.</p>
          <div className="login-flow"><span><i>01</i> Detect a shift</span><ArrowRight size={15} /><span><i>02</i> Review the evidence</span><ArrowRight size={15} /><span><i>03</i> Choose support</span></div>
          <div className="login-proof"><div className="login-proof-icon"><GraduationCap size={19} /></div><div><strong>Designed for human review</strong><p>Early risk is a warning signal—not an academic verdict.</p></div><Check size={17} /></div>
        </section>
        <section className="login-card panel">
          <span className="eyebrow">FACULTY WORKSPACE</span>
          <h2>Welcome back</h2>
          <p className="login-caption">Sign in or jump straight into the demo environment.</p>
          <form className="login-form" onSubmit={(event) => { event.preventDefault(); enterDemo(); }}>
            <label>Faculty email<input type="email" placeholder="name@university.edu" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" /></label>
            <label>Password<input type="password" placeholder="Enter your password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" /></label>
            <button type="submit" className="button button-primary login-submit">Sign in <ArrowUpRight size={16} /></button>
          </form>
          <div className="login-divider"><span /> or continue with the prototype <span /></div>
          <button type="button" className="button button-demo" onClick={enterDemo}>Enter Demo Dashboard <ArrowRight size={16} /></button>
          <p className="login-note"><ShieldCheck size={13} /> No real authentication or credentials are required for this hackathon demo.</p>
        </section>
      </div>
      <footer className="login-footer"><span>DETECT <i>→</i> EXPLAIN <i>→</i> ACT <i>→</i> MEASURE</span><span>Prototype using synthetic demo records</span></footer>
    </main>
  );
}
