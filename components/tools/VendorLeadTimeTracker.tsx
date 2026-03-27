'use client';

import { useState, useRef, useId } from 'react';

interface Delivery {
  id: string;
  date: string;
  promisedDays: number;
  actualDays: number;
}

interface Vendor {
  id: string;
  name: string;
  defaultLeadDays: number;
  deliveries: Delivery[];
}

type Grade = 'A' | 'B' | 'C' | 'D' | 'F';

function calcStats(vendor: Vendor) {
  const dels = vendor.deliveries;
  if (dels.length === 0) return { onTimeRate: 0, avgVariance: 0, grade: 'N/A' as string, count: 0 };
  const onTime = dels.filter((d) => d.actualDays <= d.promisedDays).length;
  const onTimeRate = Math.round((onTime / dels.length) * 100);
  const totalVariance = dels.reduce((sum, d) => sum + (d.actualDays - d.promisedDays), 0);
  const avgVariance = Math.round((totalVariance / dels.length) * 10) / 10;
  let grade: Grade;
  if (onTimeRate >= 95) grade = 'A';
  else if (onTimeRate >= 85) grade = 'B';
  else if (onTimeRate >= 70) grade = 'C';
  else if (onTimeRate >= 50) grade = 'D';
  else grade = 'F';
  return { onTimeRate, avgVariance, grade, count: dels.length };
}

export default function VendorLeadTimeTracker() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [showVendorForm, setShowVendorForm] = useState(false);
  const [vName, setVName] = useState('');
  const [vLead, setVLead] = useState('14');
  const [activeVendor, setActiveVendor] = useState<string | null>(null);
  const [showDeliveryForm, setShowDeliveryForm] = useState(false);
  const [dDate, setDDate] = useState('');
  const [dPromised, setDPromised] = useState('');
  const [dActual, setDActual] = useState('');
  const printRef = useRef<HTMLDivElement>(null);
  const fid = useId();

  function addVendor() {
    const name = vName.trim();
    if (!name) return;
    const v: Vendor = { id: crypto.randomUUID(), name, defaultLeadDays: Number(vLead) || 14, deliveries: [] };
    setVendors((prev) => [...prev, v]);
    setVName('');
    setVLead('14');
    setShowVendorForm(false);
    setActiveVendor(v.id);
  }

  function removeVendor(id: string) {
    setVendors((prev) => prev.filter((v) => v.id !== id));
    if (activeVendor === id) setActiveVendor(null);
  }

  function addDelivery() {
    if (!activeVendor || !dDate || !dActual) return;
    const vendor = vendors.find((v) => v.id === activeVendor);
    if (!vendor) return;
    const promised = Number(dPromised) || vendor.defaultLeadDays;
    const delivery: Delivery = { id: crypto.randomUUID(), date: dDate, promisedDays: promised, actualDays: Number(dActual) };
    setVendors((prev) =>
      prev.map((v) => v.id === activeVendor ? { ...v, deliveries: [...v.deliveries, delivery] } : v)
    );
    setDDate('');
    setDPromised('');
    setDActual('');
    setShowDeliveryForm(false);
  }

  function removeDelivery(vendorId: string, deliveryId: string) {
    setVendors((prev) =>
      prev.map((v) => v.id === vendorId ? { ...v, deliveries: v.deliveries.filter((d) => d.id !== deliveryId) } : v)
    );
  }

  const activeV = vendors.find((v) => v.id === activeVendor);

  function handlePrint() {
    const el = printRef.current;
    if (!el) return;
    const win = window.open('', '_blank');
    if (!win) return;
    win.document.write(`<!DOCTYPE html><html><head><title>Vendor Lead Time Scorecards</title>
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:system-ui,-apple-system,sans-serif;padding:2rem;color:#0d0d0b}
h1{font-size:1.4rem;font-weight:800;margin-bottom:0.25rem}
h2{font-size:1rem;font-weight:700;margin:1.5rem 0 0.5rem}
.subtitle{font-size:0.75rem;color:#7a7870;margin-bottom:1.5rem}
table{width:100%;border-collapse:collapse;font-size:0.8rem;margin-bottom:1rem}
th,td{border:1px solid #d0d0c8;padding:0.5rem 0.6rem;text-align:left}
th{background:#f0ede6;font-weight:700;font-size:0.7rem;text-transform:uppercase;letter-spacing:0.04em}
.right{text-align:right}
.center{text-align:center}
.grade{font-size:1.2rem;font-weight:800}
.grade-A,.grade-B{color:#0d6e50}
.grade-C{color:#c47a1a}
.grade-D,.grade-F{color:#c0392b}
.footer{margin-top:2rem;font-size:0.65rem;color:#aaa;border-top:1px solid #e0e0d8;padding-top:0.5rem}
@media print{body{padding:0.5in}}
</style></head><body>`);
    win.document.write(el.innerHTML);
    win.document.write('</body></html>');
    win.document.close();
    win.print();
  }

  return (
    <div className="vlt">
      <style>{`
        .vlt{background:var(--surface);border:1.5px solid var(--border);padding:1.5rem;margin:2rem 0}
        .vlt-header{margin-bottom:1.25rem}
        .vlt-header h2{font-family:var(--font-syne),sans-serif;font-weight:700;font-size:1.1rem;letter-spacing:-0.01em;margin-bottom:0.25rem}
        .vlt-header p{font-size:0.78rem;color:var(--muted)}
        .vlt-top-actions{display:flex;gap:0.75rem;margin-bottom:1.25rem;flex-wrap:wrap}
        .vlt-btn{padding:0.55rem 1rem;font-family:var(--font-syne),sans-serif;font-size:0.75rem;font-weight:700;letter-spacing:0.04em;text-transform:uppercase;cursor:pointer;transition:all 0.15s}
        .vlt-btn-add{background:var(--teal);border:none;color:#fff}
        .vlt-btn-add:hover{background:var(--ink)}
        .vlt-btn-print{background:none;border:1.5px solid var(--teal);color:var(--teal)}
        .vlt-btn-print:hover{background:var(--teal);color:#fff}
        .vlt-form{background:var(--paper);border:1.5px solid var(--border);padding:1rem;margin-bottom:1.25rem}
        .vlt-form h3{font-family:var(--font-syne),sans-serif;font-size:0.9rem;font-weight:700;margin-bottom:0.75rem}
        .vlt-form-row{display:flex;gap:0.75rem;flex-wrap:wrap}
        .vlt-field{display:flex;flex-direction:column;gap:0.3rem;flex:1;min-width:140px}
        .vlt-field label{font-size:0.7rem;font-weight:600;letter-spacing:0.04em;text-transform:uppercase;color:var(--muted)}
        .vlt-field input{padding:0.5rem 0.7rem;border:1.5px solid var(--border);background:var(--surface);font-size:0.85rem;color:var(--ink);outline:none}
        .vlt-field input:focus{border-color:var(--teal)}
        .vlt-form-actions{display:flex;gap:0.5rem;margin-top:0.75rem}
        .vlt-btn-save{background:var(--teal);border:none;color:#fff;padding:0.5rem 1.2rem;font-family:var(--font-syne),sans-serif;font-size:0.75rem;font-weight:700;letter-spacing:0.04em;text-transform:uppercase;cursor:pointer}
        .vlt-btn-cancel{background:none;border:1.5px solid var(--border);color:var(--muted);padding:0.5rem 1rem;font-family:var(--font-syne),sans-serif;font-size:0.75rem;font-weight:700;letter-spacing:0.04em;text-transform:uppercase;cursor:pointer}
        .vlt-empty{text-align:center;padding:2.5rem 1rem;color:var(--muted);font-size:0.85rem}
        .vlt-scorecards{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:1rem;margin-bottom:1.25rem}
        .vlt-card{background:var(--paper);border:1.5px solid var(--border);padding:1rem;cursor:pointer;transition:all 0.15s;position:relative}
        .vlt-card:hover{border-color:var(--teal)}
        .vlt-card.active{border-color:var(--teal);box-shadow:0 2px 12px rgba(0,0,0,0.06)}
        .vlt-card-name{font-family:var(--font-syne),sans-serif;font-weight:700;font-size:0.95rem;margin-bottom:0.5rem}
        .vlt-card-grade{font-family:var(--font-syne),sans-serif;font-weight:800;font-size:2rem;line-height:1}
        .vlt-card-grade.A,.vlt-card-grade.B{color:var(--teal-dark)}
        .vlt-card-grade.C{color:var(--amber)}
        .vlt-card-grade.D,.vlt-card-grade.F{color:#c0392b}
        .vlt-card-grade.na{color:var(--muted);font-size:1.2rem}
        .vlt-card-stats{font-size:0.72rem;color:var(--muted);margin-top:0.4rem;line-height:1.6}
        .vlt-card-remove{position:absolute;top:0.5rem;right:0.5rem;background:none;border:none;color:var(--muted);cursor:pointer;font-size:0.8rem;padding:0.2rem}
        .vlt-card-remove:hover{color:#c0392b}
        .vlt-detail{margin-top:1rem}
        .vlt-detail h3{font-family:var(--font-syne),sans-serif;font-size:0.9rem;font-weight:700;margin-bottom:0.75rem;padding-bottom:0.4rem;border-bottom:1px solid var(--border)}
        .vlt-del-table{width:100%;border-collapse:collapse;font-size:0.82rem}
        .vlt-del-table th,.vlt-del-table td{border:1px solid var(--border);padding:0.45rem 0.6rem;text-align:left}
        .vlt-del-table th{background:var(--paper);font-size:0.65rem;font-weight:700;text-transform:uppercase;letter-spacing:0.06em;color:var(--muted)}
        .vlt-variance{font-weight:600}
        .vlt-variance.late{color:#c0392b}
        .vlt-variance.ontime{color:var(--teal-dark)}
        .vlt-del-remove{background:none;border:none;color:var(--muted);cursor:pointer;font-size:0.78rem}
        .vlt-del-remove:hover{color:#c0392b}
      `}</style>

      <div className="vlt-header">
        <h2>Vendor Lead Time Tracker</h2>
        <p>Add suppliers, log deliveries, and see auto-generated performance scorecards. All data stays in your browser.</p>
      </div>

      <div className="vlt-top-actions">
        <button className="vlt-btn vlt-btn-add" onClick={() => setShowVendorForm(true)} type="button">+ Add Vendor</button>
        {vendors.length > 0 && (
          <button className="vlt-btn vlt-btn-print" onClick={handlePrint} type="button">Print Scorecards</button>
        )}
      </div>

      {showVendorForm && (
        <div className="vlt-form">
          <h3>New Vendor</h3>
          <div className="vlt-form-row">
            <div className="vlt-field">
              <label htmlFor={`${fid}-vname`}>Vendor Name</label>
              <input id={`${fid}-vname`} type="text" value={vName} onChange={(e) => setVName(e.target.value)} placeholder="e.g. ABC Fasteners Inc." />
            </div>
            <div className="vlt-field">
              <label htmlFor={`${fid}-vlead`}>Default Lead Time (days)</label>
              <input id={`${fid}-vlead`} type="number" min={1} value={vLead} onChange={(e) => setVLead(e.target.value)} />
            </div>
          </div>
          <div className="vlt-form-actions">
            <button className="vlt-btn-save" onClick={addVendor} type="button">Save</button>
            <button className="vlt-btn-cancel" onClick={() => setShowVendorForm(false)} type="button">Cancel</button>
          </div>
        </div>
      )}

      {vendors.length === 0 && !showVendorForm ? (
        <div className="vlt-empty">
          <p>No vendors yet. Add your first supplier to start tracking lead times.</p>
        </div>
      ) : vendors.length > 0 && (
        <>
          <div className="vlt-scorecards">
            {vendors.map((v) => {
              const stats = calcStats(v);
              return (
                <div key={v.id} className={`vlt-card${activeVendor === v.id ? ' active' : ''}`} onClick={() => setActiveVendor(v.id)}>
                  <button className="vlt-card-remove" onClick={(e) => { e.stopPropagation(); removeVendor(v.id); }} aria-label={`Remove ${v.name}`}>✕</button>
                  <div className="vlt-card-name">{v.name}</div>
                  <div className={`vlt-card-grade ${stats.grade === 'N/A' ? 'na' : stats.grade}`}>{stats.grade}</div>
                  <div className="vlt-card-stats">
                    {stats.count > 0 ? (
                      <>
                        {stats.onTimeRate}% on-time<br />
                        Avg variance: {stats.avgVariance > 0 ? '+' : ''}{stats.avgVariance} days<br />
                        {stats.count} deliver{stats.count === 1 ? 'y' : 'ies'} logged
                      </>
                    ) : (
                      <>No deliveries logged<br />Default: {v.defaultLeadDays} days</>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {activeV && (
            <div className="vlt-detail">
              <h3>{activeV.name} — Delivery Log</h3>

              <button className="vlt-btn vlt-btn-add" onClick={() => { setDPromised(String(activeV.defaultLeadDays)); setShowDeliveryForm(true); }} type="button" style={{ marginBottom: '0.75rem' }}>
                + Log Delivery
              </button>

              {showDeliveryForm && (
                <div className="vlt-form" style={{ marginBottom: '0.75rem' }}>
                  <div className="vlt-form-row">
                    <div className="vlt-field">
                      <label htmlFor={`${fid}-ddate`}>Delivery Date</label>
                      <input id={`${fid}-ddate`} type="date" value={dDate} onChange={(e) => setDDate(e.target.value)} />
                    </div>
                    <div className="vlt-field">
                      <label htmlFor={`${fid}-dpromised`}>Promised (days)</label>
                      <input id={`${fid}-dpromised`} type="number" min={1} value={dPromised} onChange={(e) => setDPromised(e.target.value)} />
                    </div>
                    <div className="vlt-field">
                      <label htmlFor={`${fid}-dactual`}>Actual (days)</label>
                      <input id={`${fid}-dactual`} type="number" min={1} value={dActual} onChange={(e) => setDActual(e.target.value)} />
                    </div>
                  </div>
                  <div className="vlt-form-actions">
                    <button className="vlt-btn-save" onClick={addDelivery} type="button">Log</button>
                    <button className="vlt-btn-cancel" onClick={() => setShowDeliveryForm(false)} type="button">Cancel</button>
                  </div>
                </div>
              )}

              {activeV.deliveries.length > 0 ? (
                <table className="vlt-del-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Promised</th>
                      <th>Actual</th>
                      <th>Variance</th>
                      <th style={{ width: '2rem' }}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {activeV.deliveries.map((d) => {
                      const variance = d.actualDays - d.promisedDays;
                      return (
                        <tr key={d.id}>
                          <td>{new Date(d.date + 'T00:00:00').toLocaleDateString()}</td>
                          <td>{d.promisedDays}d</td>
                          <td>{d.actualDays}d</td>
                          <td>
                            <span className={`vlt-variance ${variance > 0 ? 'late' : 'ontime'}`}>
                              {variance > 0 ? `+${variance}d late` : variance === 0 ? 'On time' : `${Math.abs(variance)}d early`}
                            </span>
                          </td>
                          <td><button className="vlt-del-remove" onClick={() => removeDelivery(activeV.id, d.id)} aria-label="Remove">✕</button></td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              ) : (
                <p style={{ fontSize: '0.82rem', color: 'var(--muted)' }}>No deliveries logged for this vendor yet.</p>
              )}
            </div>
          )}
        </>
      )}

      <div ref={printRef} style={{ display: 'none' }}>
        <h1>Vendor Lead Time Scorecards</h1>
        <div className="subtitle">Generated {new Date().toLocaleDateString()} &middot; {vendors.length} vendors tracked</div>
        <table>
          <thead>
            <tr>
              <th>Vendor</th>
              <th className="center">Grade</th>
              <th className="right">On-Time %</th>
              <th className="right">Avg Variance</th>
              <th className="right">Deliveries</th>
            </tr>
          </thead>
          <tbody>
            {vendors.map((v) => {
              const stats = calcStats(v);
              return (
                <tr key={v.id}>
                  <td style={{ fontWeight: 600 }}>{v.name}</td>
                  <td className="center"><span className={`grade grade-${stats.grade}`}>{stats.grade}</span></td>
                  <td className="right">{stats.count > 0 ? `${stats.onTimeRate}%` : '—'}</td>
                  <td className="right">{stats.count > 0 ? `${stats.avgVariance > 0 ? '+' : ''}${stats.avgVariance}d` : '—'}</td>
                  <td className="right">{stats.count}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {vendors.filter((v) => v.deliveries.length > 0).map((v) => (
          <div key={v.id}>
            <h2>{v.name} — Delivery History</h2>
            <table>
              <thead><tr><th>Date</th><th>Promised</th><th>Actual</th><th>Variance</th></tr></thead>
              <tbody>
                {v.deliveries.map((d) => {
                  const variance = d.actualDays - d.promisedDays;
                  return (
                    <tr key={d.id}>
                      <td>{new Date(d.date + 'T00:00:00').toLocaleDateString()}</td>
                      <td>{d.promisedDays}d</td>
                      <td>{d.actualDays}d</td>
                      <td>{variance > 0 ? `+${variance}d late` : variance === 0 ? 'On time' : `${Math.abs(variance)}d early`}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ))}
        <div className="footer">Generated by automationbyJT Vendor Lead Time Tracker &middot; tools.auto-jt.com</div>
      </div>
    </div>
  );
}
