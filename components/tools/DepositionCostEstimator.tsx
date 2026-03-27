'use client';

import { useState, useRef, useId } from 'react';

interface ServiceOption {
  key: string;
  label: string;
  description: string;
  baseLow: number;
  baseHigh: number;
  perHourLow: number;
  perHourHigh: number;
  isPerHour: boolean;
}

const SERVICES: ServiceOption[] = [
  { key: 'court_reporter', label: 'Court Reporter', description: 'Stenographic recording', baseLow: 0, baseHigh: 0, perHourLow: 50, perHourHigh: 85, isPerHour: true },
  { key: 'transcript_standard', label: 'Transcript (Standard)', description: '10-14 business day delivery', baseLow: 0, baseHigh: 0, perHourLow: 75, perHourHigh: 125, isPerHour: true },
  { key: 'transcript_expedited', label: 'Transcript (Expedited)', description: '3-5 business day delivery', baseLow: 0, baseHigh: 0, perHourLow: 125, perHourHigh: 200, isPerHour: true },
  { key: 'videographer', label: 'Videographer', description: 'Video recording of deposition', baseLow: 150, baseHigh: 250, perHourLow: 75, perHourHigh: 125, isPerHour: true },
  { key: 'realtime', label: 'Realtime Feed', description: 'Live transcript streaming', baseLow: 100, baseHigh: 200, perHourLow: 50, perHourHigh: 100, isPerHour: true },
  { key: 'room_rental', label: 'Room Rental', description: 'Conference room at reporting firm', baseLow: 0, baseHigh: 0, perHourLow: 50, perHourHigh: 100, isPerHour: true },
  { key: 'copy_order', label: 'Additional Copy Order', description: 'Per additional transcript copy', baseLow: 100, baseHigh: 250, perHourLow: 0, perHourHigh: 0, isPerHour: false },
  { key: 'exhibit_handling', label: 'Exhibit Handling', description: 'Scanning and linking exhibits', baseLow: 50, baseHigh: 150, perHourLow: 0, perHourHigh: 0, isPerHour: false },
];

export default function DepositionCostEstimator() {
  const [hours, setHours] = useState(3);
  const [selected, setSelected] = useState<Set<string>>(new Set(['court_reporter', 'transcript_standard']));
  const [copyCount, setCopyCount] = useState(1);
  const printRef = useRef<HTMLDivElement>(null);
  const fid = useId();

  function toggleService(key: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      // Can't have both standard and expedited transcript
      if (key === 'transcript_standard' && next.has('transcript_expedited')) next.delete('transcript_expedited');
      if (key === 'transcript_expedited' && next.has('transcript_standard')) next.delete('transcript_standard');
      return next;
    });
  }

  function getLineItem(svc: ServiceOption): { low: number; high: number } {
    if (!selected.has(svc.key)) return { low: 0, high: 0 };
    let low = svc.baseLow;
    let high = svc.baseHigh;
    if (svc.isPerHour) {
      low += svc.perHourLow * hours;
      high += svc.perHourHigh * hours;
    }
    if (svc.key === 'copy_order') {
      low *= copyCount;
      high *= copyCount;
    }
    return { low, high };
  }

  const activeServices = SERVICES.filter((s) => selected.has(s.key));
  const totals = activeServices.reduce(
    (acc, svc) => {
      const li = getLineItem(svc);
      return { low: acc.low + li.low, high: acc.high + li.high };
    },
    { low: 0, high: 0 }
  );

  function fmt(n: number): string {
    return '$' + n.toLocaleString();
  }

  function handlePrint() {
    const el = printRef.current;
    if (!el) return;
    const win = window.open('', '_blank');
    if (!win) return;
    win.document.write(`<!DOCTYPE html><html><head><title>Deposition Cost Estimate</title>
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:system-ui,-apple-system,sans-serif;padding:2rem;color:#0d0d0b}
h1{font-size:1.4rem;font-weight:800;margin-bottom:0.25rem}
.subtitle{font-size:0.75rem;color:#7a7870;margin-bottom:1.5rem}
table{width:100%;border-collapse:collapse;font-size:0.8rem}
th,td{border:1px solid #d0d0c8;padding:0.5rem 0.6rem;text-align:left}
th{background:#f0ede6;font-weight:700;font-size:0.7rem;text-transform:uppercase;letter-spacing:0.04em}
.right{text-align:right}
.total td{font-weight:700;border-top:2px solid #0d0d0b;font-size:0.9rem}
.note{margin-top:1.5rem;padding:0.75rem;background:#f0eafa;font-size:0.75rem;color:#5a2d8a;border:1px solid #d8d0ea}
.footer{margin-top:2rem;font-size:0.65rem;color:#aaa;border-top:1px solid #e0e0d8;padding-top:0.5rem}
@media print{body{padding:0.5in}}
</style></head><body>`);
    win.document.write(el.innerHTML);
    win.document.write('</body></html>');
    win.document.close();
    win.print();
  }

  return (
    <div className="dce">
      <style>{`
        .dce{background:var(--surface);border:1.5px solid var(--border);padding:1.5rem;margin:2rem 0}
        .dce-header{margin-bottom:1.25rem}
        .dce-header h2{font-family:var(--font-syne),sans-serif;font-weight:700;font-size:1.1rem;letter-spacing:-0.01em;margin-bottom:0.25rem}
        .dce-header p{font-size:0.78rem;color:var(--muted)}
        .dce-duration{margin-bottom:1.25rem}
        .dce-duration label{display:block;font-size:0.7rem;font-weight:600;letter-spacing:0.04em;text-transform:uppercase;color:var(--muted);margin-bottom:0.4rem}
        .dce-duration-row{display:flex;align-items:center;gap:0.75rem}
        .dce-duration input[type=range]{flex:1;accent-color:var(--purple)}
        .dce-duration-val{font-family:var(--font-syne),sans-serif;font-weight:700;font-size:1.1rem;min-width:3rem;text-align:right}
        .dce-services{margin-bottom:1.5rem}
        .dce-services h3{font-family:var(--font-syne),sans-serif;font-size:0.9rem;font-weight:700;margin-bottom:0.75rem}
        .dce-svc{display:flex;align-items:flex-start;gap:0.75rem;padding:0.65rem 0;border-bottom:1px solid var(--border);cursor:pointer;user-select:none}
        .dce-svc:last-child{border-bottom:none}
        .dce-svc input[type=checkbox]{margin-top:0.2rem;accent-color:var(--purple);width:16px;height:16px;flex-shrink:0}
        .dce-svc-info{flex:1}
        .dce-svc-info strong{font-size:0.88rem;display:block}
        .dce-svc-info span{font-size:0.75rem;color:var(--muted)}
        .dce-svc-cost{text-align:right;min-width:120px;font-size:0.82rem;color:var(--muted);flex-shrink:0}
        .dce-svc-cost.active{color:var(--ink);font-weight:600}
        .dce-copies{display:flex;align-items:center;gap:0.5rem;margin-top:0.3rem;font-size:0.78rem}
        .dce-copies input{width:50px;padding:0.3rem;border:1.5px solid var(--border);text-align:center;font-size:0.82rem}
        .dce-total{background:var(--purple-light);padding:1rem 1.25rem;display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem}
        .dce-total-label{font-family:var(--font-syne),sans-serif;font-weight:700;font-size:0.9rem}
        .dce-total-range{font-family:var(--font-syne),sans-serif;font-weight:800;font-size:1.3rem;color:var(--purple)}
        .dce-disclaimer{font-size:0.72rem;color:var(--muted);font-style:italic;margin-bottom:1rem}
        .dce-actions{display:flex;gap:0.75rem}
        .dce-btn-print{padding:0.55rem 1rem;background:none;border:1.5px solid var(--purple);color:var(--purple);font-family:var(--font-syne),sans-serif;font-size:0.75rem;font-weight:700;letter-spacing:0.04em;text-transform:uppercase;cursor:pointer;transition:all 0.15s}
        .dce-btn-print:hover{background:var(--purple);color:#fff}
      `}</style>

      <div className="dce-header">
        <h2>Deposition Cost Estimator</h2>
        <p>Toggle services and adjust duration to estimate costs. South Florida market rates (15th, 17th, 19th Circuits).</p>
      </div>

      <div className="dce-duration">
        <label htmlFor={`${fid}-hours`}>Estimated Deposition Length</label>
        <div className="dce-duration-row">
          <input id={`${fid}-hours`} type="range" min={1} max={8} step={0.5} value={hours} onChange={(e) => setHours(Number(e.target.value))} />
          <span className="dce-duration-val">{hours}h</span>
        </div>
      </div>

      <div className="dce-services">
        <h3>Services</h3>
        {SERVICES.map((svc) => {
          const active = selected.has(svc.key);
          const li = getLineItem(svc);
          return (
            <label key={svc.key} className="dce-svc">
              <input type="checkbox" checked={active} onChange={() => toggleService(svc.key)} />
              <div className="dce-svc-info">
                <strong>{svc.label}</strong>
                <span>{svc.description}</span>
                {svc.key === 'copy_order' && active && (
                  <div className="dce-copies">
                    <span>Copies:</span>
                    <input type="number" min={1} max={10} value={copyCount} onChange={(e) => setCopyCount(Math.max(1, Number(e.target.value)))} onClick={(e) => e.stopPropagation()} />
                  </div>
                )}
              </div>
              <div className={`dce-svc-cost${active ? ' active' : ''}`}>
                {active ? `${fmt(li.low)} – ${fmt(li.high)}` : '—'}
              </div>
            </label>
          );
        })}
      </div>

      <div className="dce-total">
        <span className="dce-total-label">Estimated Total</span>
        <span className="dce-total-range">{fmt(totals.low)} – {fmt(totals.high)}</span>
      </div>

      <p className="dce-disclaimer">
        These are market-rate estimates, not vendor quotes. Actual costs vary by provider, case complexity, and scheduling. Use for budgeting purposes only.
      </p>

      <div className="dce-actions">
        <button className="dce-btn-print" onClick={handlePrint} type="button">Print / Export PDF</button>
      </div>

      <div ref={printRef} style={{ display: 'none' }}>
        <h1>Deposition Cost Estimate</h1>
        <div className="subtitle">South Florida Market Rates &middot; {hours}-hour deposition &middot; Generated {new Date().toLocaleDateString()}</div>
        <table>
          <thead>
            <tr><th>Service</th><th>Details</th><th className="right">Low Estimate</th><th className="right">High Estimate</th></tr>
          </thead>
          <tbody>
            {activeServices.map((svc) => {
              const li = getLineItem(svc);
              return (
                <tr key={svc.key}>
                  <td style={{ fontWeight: 600 }}>{svc.label}</td>
                  <td>{svc.description}{svc.key === 'copy_order' ? ` (×${copyCount})` : ''}</td>
                  <td className="right">{fmt(li.low)}</td>
                  <td className="right">{fmt(li.high)}</td>
                </tr>
              );
            })}
            <tr className="total">
              <td colSpan={2}>Total Estimated Range</td>
              <td className="right">{fmt(totals.low)}</td>
              <td className="right">{fmt(totals.high)}</td>
            </tr>
          </tbody>
        </table>
        <div className="note">These are market-rate estimates for Florida's 15th (Palm Beach), 17th (Broward), and 19th (St. Lucie, Martin, Indian River, Okeechobee) Judicial Circuits. Actual costs vary by provider.</div>
        <div className="footer">Generated by automationbyJT Deposition Cost Estimator &middot; tools.auto-jt.com</div>
      </div>
    </div>
  );
}
