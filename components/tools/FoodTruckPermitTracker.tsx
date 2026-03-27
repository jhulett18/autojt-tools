'use client';

import { useState, useRef, useId } from 'react';
import { useLocalStorage } from '@/lib/useLocalStorage';

const CITIES = [
  { value: 'fort_pierce', label: 'Fort Pierce', notes: 'Requires City of Fort Pierce Mobile Food Vendor Permit + St. Lucie County Health Dept. inspection. Annual renewal.' },
  { value: 'psl', label: 'Port St. Lucie', notes: 'Business Tax Receipt from PSL + St. Lucie County Health Permit. Must operate from approved commissary kitchen.' },
  { value: 'fort_lauderdale', label: 'Fort Lauderdale', notes: 'Broward County Health Dept. permit + City BTR + Fire Safety inspection. Zoning restrictions in downtown district. GPS tracking may be required.' },
  { value: 'miami', label: 'Miami / Miami-Dade', notes: 'Miami-Dade County Health permit + City of Miami BTR + Fire inspection. 200-ft rule from brick-and-mortar restaurants. Commissary agreement required.' },
  { value: 'west_palm', label: 'West Palm Beach', notes: 'Palm Beach County Health Dept. permit + City BTR. Must have approved commissary within county limits.' },
  { value: 'other', label: 'Other / General', notes: 'Check your city and county for specific mobile food vendor requirements. At minimum: state DBPR license, county health permit, and local business tax receipt.' },
] as const;

type CityValue = (typeof CITIES)[number]['value'];

const PERMIT_TYPES = [
  'State DBPR License',
  'County Health Permit',
  'City Business Tax Receipt',
  'Mobile Food Dispensing Vehicle Permit',
  'Fire Safety Inspection',
  'Commissary Agreement',
  'Vehicle Insurance',
  'Workers\' Comp Certificate',
  'Propane/Gas Safety Certificate',
  'Other',
] as const;

type UrgencyLevel = 'expired' | 'critical' | 'warning' | 'ok';

interface Permit {
  id: string;
  type: string;
  customType?: string;
  issueDate: string;
  expirationDate: string;
  notes: string;
}

function getUrgency(expirationDate: string): UrgencyLevel {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const exp = new Date(expirationDate + 'T00:00:00');
  const diff = Math.floor((exp.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  if (diff < 0) return 'expired';
  if (diff <= 14) return 'critical';
  if (diff <= 60) return 'warning';
  return 'ok';
}

function getDaysUntil(expirationDate: string): number {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const exp = new Date(expirationDate + 'T00:00:00');
  return Math.floor((exp.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

function urgencyLabel(level: UrgencyLevel): string {
  switch (level) {
    case 'expired': return 'EXPIRED';
    case 'critical': return 'RENEW NOW';
    case 'warning': return 'UPCOMING';
    case 'ok': return 'OK';
  }
}

export default function FoodTruckPermitTracker() {
  const [city, setCity] = useLocalStorage<CityValue>('fpt-city', 'fort_pierce');
  const [permits, setPermits] = useLocalStorage<Permit[]>('fpt-permits', []);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formType, setFormType] = useState(PERMIT_TYPES[0] as string);
  const [formCustomType, setFormCustomType] = useState('');
  const [formIssueDate, setFormIssueDate] = useState('');
  const [formExpDate, setFormExpDate] = useState('');
  const [formNotes, setFormNotes] = useState('');
  const printRef = useRef<HTMLDivElement>(null);
  const formId = useId();

  const cityInfo = CITIES.find((c) => c.value === city)!;

  function resetForm() {
    setFormType(PERMIT_TYPES[0]);
    setFormCustomType('');
    setFormIssueDate('');
    setFormExpDate('');
    setFormNotes('');
    setEditingId(null);
    setShowForm(false);
  }

  function savePermit() {
    const type = formType === 'Other' ? formCustomType.trim() || 'Other' : formType;
    if (!formExpDate) return;

    if (editingId) {
      setPermits((prev) =>
        prev.map((p) =>
          p.id === editingId
            ? { ...p, type, customType: formCustomType, issueDate: formIssueDate, expirationDate: formExpDate, notes: formNotes }
            : p
        )
      );
    } else {
      setPermits((prev) => [
        ...prev,
        { id: crypto.randomUUID(), type, customType: formCustomType, issueDate: formIssueDate, expirationDate: formExpDate, notes: formNotes },
      ]);
    }
    resetForm();
  }

  function editPermit(p: Permit) {
    const isPreset = (PERMIT_TYPES as readonly string[]).includes(p.type);
    setFormType(isPreset ? p.type : 'Other');
    setFormCustomType(isPreset ? '' : p.type);
    setFormIssueDate(p.issueDate);
    setFormExpDate(p.expirationDate);
    setFormNotes(p.notes);
    setEditingId(p.id);
    setShowForm(true);
  }

  function removePermit(id: string) {
    setPermits((prev) => prev.filter((p) => p.id !== id));
  }

  const sorted = [...permits].sort((a, b) => {
    const ua = getUrgency(a.expirationDate);
    const ub = getUrgency(b.expirationDate);
    const order: Record<UrgencyLevel, number> = { expired: 0, critical: 1, warning: 2, ok: 3 };
    return order[ua] - order[ub] || getDaysUntil(a.expirationDate) - getDaysUntil(b.expirationDate);
  });

  function handlePrint() {
    const el = printRef.current;
    if (!el) return;
    const win = window.open('', '_blank');
    if (!win) return;
    win.document.write(`<!DOCTYPE html><html><head><title>Permit Tracker — ${cityInfo.label}</title>
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:system-ui,-apple-system,sans-serif;padding:2rem;color:#0d0d0b}
h1{font-size:1.4rem;font-weight:800;margin-bottom:0.25rem}
.subtitle{font-size:0.75rem;color:#7a7870;margin-bottom:1.5rem}
table{width:100%;border-collapse:collapse;font-size:0.8rem}
th,td{border:1px solid #d0d0c8;padding:0.5rem 0.6rem;text-align:left}
th{background:#f0ede6;font-weight:700;font-size:0.7rem;text-transform:uppercase;letter-spacing:0.04em}
.badge{display:inline-block;padding:0.15rem 0.5rem;font-size:0.65rem;font-weight:700;letter-spacing:0.04em;text-transform:uppercase;border-radius:2px}
.badge-expired{background:#fde8e8;color:#c0392b}
.badge-critical{background:#fde8e8;color:#c0392b}
.badge-warning{background:#fef3dc;color:#c47a1a}
.badge-ok{background:#e1f5ee;color:#0d6e50}
.city-notes{margin-top:1.5rem;padding:0.75rem;background:#f7f5f0;font-size:0.75rem;color:#7a7870;border:1px solid #e0ddd5}
.city-notes strong{color:#0d0d0b}
.footer{margin-top:2rem;font-size:0.65rem;color:#aaa;border-top:1px solid #e0e0d8;padding-top:0.5rem}
@media print{body{padding:0.5in}}
</style></head><body>`);
    win.document.write(el.innerHTML);
    win.document.write('</body></html>');
    win.document.close();
    win.print();
  }

  return (
    <div className="fpt">
      <style>{`
        .fpt{background:var(--surface);border:1.5px solid var(--border);padding:1.5rem;margin:2rem 0}
        .fpt-header{margin-bottom:1.25rem}
        .fpt-header h2{font-family:var(--font-syne),sans-serif;font-weight:700;font-size:1.1rem;letter-spacing:-0.01em;margin-bottom:0.25rem}
        .fpt-header p{font-size:0.78rem;color:var(--muted)}
        .fpt-city{margin-bottom:1.25rem}
        .fpt-city label{display:block;font-size:0.72rem;font-weight:600;letter-spacing:0.06em;text-transform:uppercase;color:var(--muted);margin-bottom:0.4rem}
        .fpt-city select{padding:0.55rem 0.8rem;border:1.5px solid var(--border);background:var(--paper);font-size:0.85rem;color:var(--ink);outline:none;cursor:pointer;min-width:220px}
        .fpt-city select:focus{border-color:var(--amber)}
        .fpt-city-notes{margin-top:0.6rem;padding:0.75rem;background:var(--amber-light);font-size:0.78rem;color:var(--amber);line-height:1.6;border-left:3px solid var(--amber)}
        .fpt-actions-top{display:flex;gap:0.75rem;margin-bottom:1.25rem;flex-wrap:wrap}
        .fpt-btn{padding:0.55rem 1rem;font-family:var(--font-syne),sans-serif;font-size:0.75rem;font-weight:700;letter-spacing:0.04em;text-transform:uppercase;cursor:pointer;transition:all 0.15s}
        .fpt-btn-add{background:var(--amber);border:none;color:#fff}
        .fpt-btn-add:hover{background:var(--ink)}
        .fpt-btn-print{background:none;border:1.5px solid var(--amber);color:var(--amber)}
        .fpt-btn-print:hover{background:var(--amber);color:#fff}
        .fpt-form{background:var(--paper);border:1.5px solid var(--border);padding:1.25rem;margin-bottom:1.25rem}
        .fpt-form h3{font-family:var(--font-syne),sans-serif;font-size:0.9rem;font-weight:700;margin-bottom:1rem}
        .fpt-form-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.75rem}
        .fpt-field{display:flex;flex-direction:column;gap:0.3rem}
        .fpt-field.full{grid-column:1/-1}
        .fpt-field label{font-size:0.7rem;font-weight:600;letter-spacing:0.04em;text-transform:uppercase;color:var(--muted)}
        .fpt-field select,.fpt-field input,.fpt-field textarea{padding:0.5rem 0.7rem;border:1.5px solid var(--border);background:var(--surface);font-size:0.85rem;color:var(--ink);outline:none}
        .fpt-field select:focus,.fpt-field input:focus,.fpt-field textarea:focus{border-color:var(--amber)}
        .fpt-field textarea{resize:vertical;min-height:60px;font-family:inherit}
        .fpt-form-actions{display:flex;gap:0.5rem;margin-top:0.75rem}
        .fpt-btn-save{background:var(--amber);border:none;color:#fff;padding:0.5rem 1.2rem;font-family:var(--font-syne),sans-serif;font-size:0.75rem;font-weight:700;letter-spacing:0.04em;text-transform:uppercase;cursor:pointer}
        .fpt-btn-save:hover{background:var(--ink)}
        .fpt-btn-cancel{background:none;border:1.5px solid var(--border);color:var(--muted);padding:0.5rem 1rem;font-family:var(--font-syne),sans-serif;font-size:0.75rem;font-weight:700;letter-spacing:0.04em;text-transform:uppercase;cursor:pointer}
        .fpt-btn-cancel:hover{border-color:var(--muted);color:var(--ink)}
        .fpt-empty{text-align:center;padding:2.5rem 1rem;color:var(--muted);font-size:0.85rem}
        .fpt-table-wrap{overflow-x:auto;-webkit-overflow-scrolling:touch}
        .fpt-table{width:100%;border-collapse:collapse;font-size:0.82rem;min-width:580px}
        .fpt-table th,.fpt-table td{border:1px solid var(--border);padding:0.55rem 0.6rem;text-align:left;vertical-align:middle}
        .fpt-table th{background:var(--paper);font-size:0.65rem;font-weight:700;text-transform:uppercase;letter-spacing:0.06em;color:var(--muted);white-space:nowrap}
        .fpt-table td:first-child{font-weight:600}
        .fpt-badge{display:inline-block;padding:0.2rem 0.55rem;font-size:0.65rem;font-weight:700;letter-spacing:0.04em;text-transform:uppercase;border-radius:2px;white-space:nowrap}
        .fpt-badge-expired{background:#fde8e8;color:#c0392b}
        .fpt-badge-critical{background:#fde8e8;color:#c0392b}
        .fpt-badge-warning{background:var(--amber-light);color:var(--amber)}
        .fpt-badge-ok{background:var(--teal-light);color:var(--teal-dark)}
        .fpt-row-actions{display:flex;gap:0.4rem}
        .fpt-row-btn{background:none;border:none;cursor:pointer;font-size:0.78rem;padding:0.2rem 0.4rem;transition:color 0.15s;color:var(--muted)}
        .fpt-row-btn:hover{color:var(--ink)}
        .fpt-row-btn.delete:hover{color:#c0392b}
        .fpt-days{font-size:0.75rem;color:var(--muted)}
        @media(max-width:600px){.fpt-form-grid{grid-template-columns:1fr}}
      `}</style>

      <div className="fpt-header">
        <h2>Food Truck Permit Tracker</h2>
        <p>Track all your permits and licenses in one view. All data stays in your browser.</p>
      </div>

      <div className="fpt-city">
        <label htmlFor={`${formId}-city`}>Operating City</label>
        <select id={`${formId}-city`} value={city} onChange={(e) => setCity(e.target.value as CityValue)}>
          {CITIES.map((c) => (
            <option key={c.value} value={c.value}>{c.label}</option>
          ))}
        </select>
        <div className="fpt-city-notes">{cityInfo.notes}</div>
      </div>

      <div className="fpt-actions-top">
        <button className="fpt-btn fpt-btn-add" onClick={() => { resetForm(); setShowForm(true); }} type="button">
          + Add Permit
        </button>
        {permits.length > 0 && (
          <button className="fpt-btn fpt-btn-print" onClick={handlePrint} type="button">
            Print / Export PDF
          </button>
        )}
      </div>

      {showForm && (
        <div className="fpt-form">
          <h3>{editingId ? 'Edit Permit' : 'Add Permit'}</h3>
          <div className="fpt-form-grid">
            <div className="fpt-field">
              <label htmlFor={`${formId}-type`}>Permit Type</label>
              <select id={`${formId}-type`} value={formType} onChange={(e) => setFormType(e.target.value)}>
                {PERMIT_TYPES.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            {formType === 'Other' && (
              <div className="fpt-field">
                <label htmlFor={`${formId}-custom`}>Custom Name</label>
                <input id={`${formId}-custom`} type="text" value={formCustomType} onChange={(e) => setFormCustomType(e.target.value)} placeholder="Enter permit name" />
              </div>
            )}
            <div className="fpt-field">
              <label htmlFor={`${formId}-issue`}>Issue Date</label>
              <input id={`${formId}-issue`} type="date" value={formIssueDate} onChange={(e) => setFormIssueDate(e.target.value)} />
            </div>
            <div className="fpt-field">
              <label htmlFor={`${formId}-exp`}>Expiration Date</label>
              <input id={`${formId}-exp`} type="date" value={formExpDate} onChange={(e) => setFormExpDate(e.target.value)} />
            </div>
            <div className="fpt-field full">
              <label htmlFor={`${formId}-notes`}>Notes (optional)</label>
              <textarea id={`${formId}-notes`} value={formNotes} onChange={(e) => setFormNotes(e.target.value)} placeholder="e.g. Renewal fee $150, contact person, etc." />
            </div>
          </div>
          <div className="fpt-form-actions">
            <button className="fpt-btn-save" onClick={savePermit} type="button">
              {editingId ? 'Update' : 'Save'}
            </button>
            <button className="fpt-btn-cancel" onClick={resetForm} type="button">Cancel</button>
          </div>
        </div>
      )}

      {permits.length === 0 && !showForm ? (
        <div className="fpt-empty">
          <p>No permits tracked yet. Click &ldquo;Add Permit&rdquo; to start tracking your licenses and renewals.</p>
        </div>
      ) : permits.length > 0 && (
        <div className="fpt-table-wrap">
          <table className="fpt-table" aria-label="Permit tracker">
            <thead>
              <tr>
                <th>Permit</th>
                <th>Issued</th>
                <th>Expires</th>
                <th>Status</th>
                <th>Notes</th>
                <th style={{ width: '4rem' }}></th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((p) => {
                const urgency = getUrgency(p.expirationDate);
                const days = getDaysUntil(p.expirationDate);
                return (
                  <tr key={p.id}>
                    <td>{p.type}</td>
                    <td>{p.issueDate ? new Date(p.issueDate + 'T00:00:00').toLocaleDateString() : '—'}</td>
                    <td>{new Date(p.expirationDate + 'T00:00:00').toLocaleDateString()}</td>
                    <td>
                      <span className={`fpt-badge fpt-badge-${urgency}`}>{urgencyLabel(urgency)}</span>
                      <br />
                      <span className="fpt-days">
                        {days < 0 ? `${Math.abs(days)}d overdue` : days === 0 ? 'Expires today' : `${days}d remaining`}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.78rem', color: 'var(--muted)' }}>{p.notes || '—'}</td>
                    <td>
                      <div className="fpt-row-actions">
                        <button className="fpt-row-btn" onClick={() => editPermit(p)} title="Edit" aria-label={`Edit ${p.type}`}>✎</button>
                        <button className="fpt-row-btn delete" onClick={() => removePermit(p.id)} title="Remove" aria-label={`Remove ${p.type}`}>✕</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Hidden print-ready version */}
      <div ref={printRef} style={{ display: 'none' }}>
        <h1>Food Truck Permit Tracker</h1>
        <div className="subtitle">
          {cityInfo.label} &middot; Generated {new Date().toLocaleDateString()} &middot; {permits.length} permits tracked
        </div>
        <table>
          <thead>
            <tr>
              <th>Permit</th>
              <th>Issued</th>
              <th>Expires</th>
              <th>Status</th>
              <th>Notes</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((p) => {
              const urgency = getUrgency(p.expirationDate);
              const days = getDaysUntil(p.expirationDate);
              return (
                <tr key={p.id}>
                  <td style={{ fontWeight: 600 }}>{p.type}</td>
                  <td>{p.issueDate ? new Date(p.issueDate + 'T00:00:00').toLocaleDateString() : '—'}</td>
                  <td>{new Date(p.expirationDate + 'T00:00:00').toLocaleDateString()}</td>
                  <td>
                    <span className={`badge badge-${urgency}`}>{urgencyLabel(urgency)}</span>
                    {' '}({days < 0 ? `${Math.abs(days)}d overdue` : `${days}d`})
                  </td>
                  <td>{p.notes || '—'}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className="city-notes">
          <strong>{cityInfo.label}:</strong> {cityInfo.notes}
        </div>
        <div className="footer">
          Generated by automationbyJT Food Truck Permit Tracker &middot; tools.auto-jt.com
        </div>
      </div>
    </div>
  );
}
