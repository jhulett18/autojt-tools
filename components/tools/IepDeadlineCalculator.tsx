'use client';

import { useState, useRef, useId } from 'react';

const STATES: { value: string; label: string; evalDays: number; calendarDays: boolean; notes: string }[] = [
  { value: 'FL', label: 'Florida', evalDays: 60, calendarDays: false, notes: 'Florida allows 60 school days (not calendar days) for initial evaluation. School year calendars vary by district.' },
  { value: 'CA', label: 'California', evalDays: 60, calendarDays: true, notes: 'California requires initial evaluation within 60 calendar days of consent.' },
  { value: 'TX', label: 'Texas', evalDays: 45, calendarDays: false, notes: 'Texas requires initial evaluation within 45 school days of consent.' },
  { value: 'NY', label: 'New York', evalDays: 60, calendarDays: false, notes: 'New York requires initial evaluation within 60 school days of consent.' },
  { value: 'IL', label: 'Illinois', evalDays: 60, calendarDays: false, notes: 'Illinois requires initial evaluation within 60 school days of consent.' },
  { value: 'OTHER', label: 'Other State (Federal Default)', evalDays: 60, calendarDays: true, notes: 'Federal IDEA default: 60 calendar days from parental consent. Check your state for specific rules.' },
];

interface Deadline {
  name: string;
  date: Date;
  description: string;
  urgency: 'past' | 'critical' | 'warning' | 'future';
}

function addCalendarDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function addSchoolDays(date: Date, days: number): Date {
  // Approximate: school days ≈ calendar days × 7/5, skip weekends, add buffer for breaks
  // Rough conversion: 1 school day ≈ 1.4 calendar days
  const calDays = Math.ceil(days * 1.4);
  return addCalendarDays(date, calDays);
}

function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' });
}

function getDeadlineUrgency(date: Date): 'past' | 'critical' | 'warning' | 'future' {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const diff = Math.floor((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  if (diff < 0) return 'past';
  if (diff <= 14) return 'critical';
  if (diff <= 30) return 'warning';
  return 'future';
}

function daysFromNow(date: Date): number {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return Math.floor((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

export default function IepDeadlineCalculator() {
  const [consentDate, setConsentDate] = useState('');
  const [state, setState] = useState('FL');
  const [lastIepDate, setLastIepDate] = useState('');
  const [lastEvalDate, setLastEvalDate] = useState('');
  const printRef = useRef<HTMLDivElement>(null);
  const fid = useId();

  const stateInfo = STATES.find((s) => s.value === state)!;

  function calculateDeadlines(): Deadline[] {
    const deadlines: Deadline[] = [];

    if (consentDate) {
      const consent = new Date(consentDate + 'T00:00:00');

      // Initial evaluation deadline
      const evalDate = stateInfo.calendarDays
        ? addCalendarDays(consent, stateInfo.evalDays)
        : addSchoolDays(consent, stateInfo.evalDays);
      deadlines.push({
        name: 'Initial Evaluation Due',
        date: evalDate,
        description: `${stateInfo.evalDays} ${stateInfo.calendarDays ? 'calendar' : 'school'} days from consent (${stateInfo.label} rule)`,
        urgency: getDeadlineUrgency(evalDate),
      });

      // IEP meeting (30 calendar days after evaluation)
      const iepMeetingDate = addCalendarDays(evalDate, 30);
      deadlines.push({
        name: 'IEP Meeting (Post-Evaluation)',
        date: iepMeetingDate,
        description: '30 calendar days after evaluation completion to hold IEP meeting',
        urgency: getDeadlineUrgency(iepMeetingDate),
      });
    }

    if (lastIepDate) {
      const lastIep = new Date(lastIepDate + 'T00:00:00');
      const annualReview = addCalendarDays(lastIep, 365);
      deadlines.push({
        name: 'Annual IEP Review Due',
        date: annualReview,
        description: 'Must occur within 365 days of previous IEP meeting (IDEA requirement)',
        urgency: getDeadlineUrgency(annualReview),
      });
    }

    if (lastEvalDate) {
      const lastEval = new Date(lastEvalDate + 'T00:00:00');
      const reeval = addCalendarDays(lastEval, 365 * 3);
      deadlines.push({
        name: 'Triennial Reevaluation Due',
        date: reeval,
        description: 'Must occur at least every 3 years from last evaluation (IDEA requirement)',
        urgency: getDeadlineUrgency(reeval),
      });
    }

    return deadlines.sort((a, b) => a.date.getTime() - b.date.getTime());
  }

  const deadlines = calculateDeadlines();
  const hasInput = consentDate || lastIepDate || lastEvalDate;

  function handlePrint() {
    const el = printRef.current;
    if (!el) return;
    const win = window.open('', '_blank');
    if (!win) return;
    win.document.write(`<!DOCTYPE html><html><head><title>IEP Deadline Timeline</title>
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:system-ui,-apple-system,sans-serif;padding:2rem;color:#0d0d0b}
h1{font-size:1.4rem;font-weight:800;margin-bottom:0.25rem}
.subtitle{font-size:0.75rem;color:#7a7870;margin-bottom:1.5rem}
table{width:100%;border-collapse:collapse;font-size:0.8rem}
th,td{border:1px solid #d0d0c8;padding:0.5rem 0.6rem;text-align:left}
th{background:#f0ede6;font-weight:700;font-size:0.7rem;text-transform:uppercase;letter-spacing:0.04em}
.badge{display:inline-block;padding:0.15rem 0.5rem;font-size:0.65rem;font-weight:700;letter-spacing:0.04em;text-transform:uppercase;border-radius:2px}
.badge-past{background:#fde8e8;color:#c0392b}
.badge-critical{background:#fde8e8;color:#c0392b}
.badge-warning{background:#fef3dc;color:#c47a1a}
.badge-future{background:#e8effa;color:#1a4a8a}
.note{margin-top:1.5rem;padding:0.75rem;background:#e8effa;font-size:0.75rem;color:#1a4a8a;border:1px solid #c8d8f0}
.footer{margin-top:2rem;font-size:0.65rem;color:#aaa;border-top:1px solid #e0e0d8;padding-top:0.5rem}
@media print{body{padding:0.5in}}
</style></head><body>`);
    win.document.write(el.innerHTML);
    win.document.write('</body></html>');
    win.document.close();
    win.print();
  }

  return (
    <div className="iep">
      <style>{`
        .iep{background:var(--surface);border:1.5px solid var(--border);padding:1.5rem;margin:2rem 0}
        .iep-header{margin-bottom:1.25rem}
        .iep-header h2{font-family:var(--font-syne),sans-serif;font-weight:700;font-size:1.1rem;letter-spacing:-0.01em;margin-bottom:0.25rem}
        .iep-header p{font-size:0.78rem;color:var(--muted)}
        .iep-form{display:grid;grid-template-columns:1fr 1fr;gap:0.75rem;margin-bottom:1.5rem}
        .iep-field{display:flex;flex-direction:column;gap:0.3rem}
        .iep-field.full{grid-column:1/-1}
        .iep-field label{font-size:0.7rem;font-weight:600;letter-spacing:0.04em;text-transform:uppercase;color:var(--muted)}
        .iep-field select,.iep-field input{padding:0.55rem 0.8rem;border:1.5px solid var(--border);background:var(--paper);font-size:0.85rem;color:var(--ink);outline:none}
        .iep-field select:focus,.iep-field input:focus{border-color:var(--blue)}
        .iep-state-note{grid-column:1/-1;padding:0.65rem 0.85rem;background:var(--blue-light);font-size:0.78rem;color:var(--blue);line-height:1.6;border-left:3px solid var(--blue)}
        .iep-empty{text-align:center;padding:2rem 1rem;color:var(--muted);font-size:0.85rem}
        .iep-results h3{font-family:var(--font-syne),sans-serif;font-size:0.95rem;font-weight:700;margin-bottom:0.75rem}
        .iep-timeline{display:flex;flex-direction:column;gap:0}
        .iep-dl{display:flex;align-items:flex-start;gap:1rem;padding:0.85rem 0;border-bottom:1px solid var(--border)}
        .iep-dl:last-child{border-bottom:none}
        .iep-dl-date{min-width:140px;flex-shrink:0}
        .iep-dl-date strong{font-size:0.88rem;display:block}
        .iep-dl-date .iep-days{font-size:0.72rem;color:var(--muted)}
        .iep-dl-info{flex:1}
        .iep-dl-info strong{font-size:0.88rem;display:block;margin-bottom:0.2rem}
        .iep-dl-info span{font-size:0.78rem;color:var(--muted);line-height:1.5}
        .iep-badge{display:inline-block;padding:0.18rem 0.5rem;font-size:0.62rem;font-weight:700;letter-spacing:0.04em;text-transform:uppercase;border-radius:2px;margin-left:0.5rem;vertical-align:middle}
        .iep-badge-past{background:#fde8e8;color:#c0392b}
        .iep-badge-critical{background:#fde8e8;color:#c0392b}
        .iep-badge-warning{background:var(--amber-light);color:var(--amber)}
        .iep-badge-future{background:var(--blue-light);color:var(--blue)}
        .iep-actions{margin-top:1rem}
        .iep-btn-print{padding:0.55rem 1rem;background:none;border:1.5px solid var(--blue);color:var(--blue);font-family:var(--font-syne),sans-serif;font-size:0.75rem;font-weight:700;letter-spacing:0.04em;text-transform:uppercase;cursor:pointer;transition:all 0.15s}
        .iep-btn-print:hover{background:var(--blue);color:#fff}
        @media(max-width:600px){.iep-form{grid-template-columns:1fr}.iep-dl{flex-direction:column;gap:0.4rem}}
      `}</style>

      <div className="iep-header">
        <h2>IEP Deadline Calculator</h2>
        <p>Enter dates below to calculate all IDEA-required deadlines with urgency indicators.</p>
      </div>

      <div className="iep-form">
        <div className="iep-field">
          <label htmlFor={`${fid}-state`}>State</label>
          <select id={`${fid}-state`} value={state} onChange={(e) => setState(e.target.value)}>
            {STATES.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>
        <div className="iep-field">
          <label htmlFor={`${fid}-consent`}>Parental Consent Date</label>
          <input id={`${fid}-consent`} type="date" value={consentDate} onChange={(e) => setConsentDate(e.target.value)} />
        </div>
        <div className="iep-field">
          <label htmlFor={`${fid}-lastiep`}>Last IEP Meeting Date (optional)</label>
          <input id={`${fid}-lastiep`} type="date" value={lastIepDate} onChange={(e) => setLastIepDate(e.target.value)} />
        </div>
        <div className="iep-field">
          <label htmlFor={`${fid}-lasteval`}>Last Evaluation Date (optional)</label>
          <input id={`${fid}-lasteval`} type="date" value={lastEvalDate} onChange={(e) => setLastEvalDate(e.target.value)} />
        </div>
        <div className="iep-state-note">{stateInfo.notes}</div>
      </div>

      {!hasInput ? (
        <div className="iep-empty">
          <p>Enter a parental consent date above to calculate evaluation and meeting deadlines.</p>
        </div>
      ) : (
        <div className="iep-results">
          <h3>Deadline Timeline</h3>
          <div className="iep-timeline">
            {deadlines.map((dl, i) => {
              const days = daysFromNow(dl.date);
              return (
                <div key={i} className="iep-dl">
                  <div className="iep-dl-date">
                    <strong>{formatDate(dl.date)}</strong>
                    <span className="iep-days">
                      {days < 0 ? `${Math.abs(days)} days ago` : days === 0 ? 'Today' : `${days} days away`}
                    </span>
                  </div>
                  <div className="iep-dl-info">
                    <strong>
                      {dl.name}
                      <span className={`iep-badge iep-badge-${dl.urgency}`}>
                        {dl.urgency === 'past' ? 'OVERDUE' : dl.urgency === 'critical' ? 'URGENT' : dl.urgency === 'warning' ? 'SOON' : 'ON TRACK'}
                      </span>
                    </strong>
                    <span>{dl.description}</span>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="iep-actions">
            <button className="iep-btn-print" onClick={handlePrint} type="button">Print / Export PDF</button>
          </div>
        </div>
      )}

      <div ref={printRef} style={{ display: 'none' }}>
        <h1>IEP Deadline Timeline</h1>
        <div className="subtitle">{stateInfo.label} &middot; Generated {new Date().toLocaleDateString()}</div>
        <table>
          <thead>
            <tr>
              <th>Deadline</th>
              <th>Date</th>
              <th>Status</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            {deadlines.map((dl, i) => {
              const days = daysFromNow(dl.date);
              return (
                <tr key={i}>
                  <td style={{ fontWeight: 600 }}>{dl.name}</td>
                  <td>{formatDate(dl.date)}</td>
                  <td><span className={`badge badge-${dl.urgency}`}>
                    {dl.urgency === 'past' ? 'OVERDUE' : dl.urgency === 'critical' ? 'URGENT' : dl.urgency === 'warning' ? 'SOON' : 'ON TRACK'}
                  </span></td>
                  <td>{dl.description}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className="note"><strong>State:</strong> {stateInfo.label} — {stateInfo.notes}</div>
        <div className="footer">Generated by automationbyJT IEP Deadline Calculator &middot; tools.auto-jt.com</div>
      </div>
    </div>
  );
}
