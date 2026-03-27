'use client';

import { useState, useRef, useId } from 'react';

const EVIDENCE_TYPES = [
  'Surveillance Footage',
  'Accident Photos',
  'Medical Records',
  'Medical Imaging',
  'Physical Evidence',
  'Digital Files',
  'Audio Recording',
  'Written Statement',
  'Other',
] as const;

interface TransferEvent {
  id: string;
  handler: string;
  receivedFrom: string;
  timestamp: string;
  purpose: string;
  location: string;
}

interface EvidenceItem {
  type: string;
  customType: string;
  description: string;
  source: string;
  collectionDate: string;
  collectionTime: string;
  collectedBy: string;
  caseNumber: string;
}

export default function ChainOfCustodyGenerator() {
  const [evidence, setEvidence] = useState<EvidenceItem>({
    type: EVIDENCE_TYPES[0],
    customType: '',
    description: '',
    source: '',
    collectionDate: '',
    collectionTime: '',
    collectedBy: '',
    caseNumber: '',
  });
  const [transfers, setTransfers] = useState<TransferEvent[]>([]);
  const [showTransferForm, setShowTransferForm] = useState(false);
  const [tfHandler, setTfHandler] = useState('');
  const [tfReceivedFrom, setTfReceivedFrom] = useState('');
  const [tfTimestamp, setTfTimestamp] = useState('');
  const [tfPurpose, setTfPurpose] = useState('');
  const [tfLocation, setTfLocation] = useState('');
  const printRef = useRef<HTMLDivElement>(null);
  const fid = useId();

  const evidenceType = evidence.type === 'Other' ? evidence.customType || 'Other' : evidence.type;
  const hasEvidence = evidence.description && evidence.collectionDate && evidence.collectedBy;

  function addTransfer() {
    if (!tfHandler || !tfTimestamp) return;
    setTransfers((prev) => [
      ...prev,
      { id: crypto.randomUUID(), handler: tfHandler, receivedFrom: tfReceivedFrom, timestamp: tfTimestamp, purpose: tfPurpose, location: tfLocation },
    ]);
    setTfHandler('');
    setTfReceivedFrom('');
    setTfTimestamp('');
    setTfPurpose('');
    setTfLocation('');
    setShowTransferForm(false);
  }

  function removeTransfer(id: string) {
    setTransfers((prev) => prev.filter((t) => t.id !== id));
  }

  function handlePrint() {
    const el = printRef.current;
    if (!el) return;
    const win = window.open('', '_blank');
    if (!win) return;
    win.document.write(`<!DOCTYPE html><html><head><title>Chain of Custody — ${evidence.caseNumber || 'No Case #'}</title>
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:system-ui,-apple-system,sans-serif;padding:2rem;color:#0d0d0b;font-size:0.85rem}
h1{font-size:1.3rem;font-weight:800;margin-bottom:0.15rem}
h2{font-size:1rem;font-weight:700;margin:1.5rem 0 0.5rem;border-bottom:2px solid #0d0d0b;padding-bottom:0.3rem}
.subtitle{font-size:0.72rem;color:#7a7870;margin-bottom:1.5rem}
.grid{display:grid;grid-template-columns:1fr 1fr;gap:0.4rem 1.5rem;margin-bottom:1rem}
.grid dt{font-weight:700;font-size:0.75rem;text-transform:uppercase;letter-spacing:0.04em;color:#7a7870}
.grid dd{font-size:0.85rem;margin-bottom:0.3rem}
table{width:100%;border-collapse:collapse;font-size:0.8rem;margin-top:0.5rem}
th,td{border:1px solid #d0d0c8;padding:0.5rem 0.6rem;text-align:left}
th{background:#f0ede6;font-weight:700;font-size:0.7rem;text-transform:uppercase;letter-spacing:0.04em}
.sig-line{margin-top:2.5rem;display:flex;gap:2rem}
.sig-block{flex:1;border-top:1px solid #0d0d0b;padding-top:0.4rem;font-size:0.72rem;color:#7a7870}
.footer{margin-top:2rem;font-size:0.65rem;color:#aaa;border-top:1px solid #e0e0d8;padding-top:0.5rem}
@media print{body{padding:0.5in}}
</style></head><body>`);
    win.document.write(el.innerHTML);
    win.document.write('</body></html>');
    win.document.close();
    win.print();
  }

  return (
    <div className="coc">
      <style>{`
        .coc{background:var(--surface);border:1.5px solid var(--border);padding:1.5rem;margin:2rem 0}
        .coc-header{margin-bottom:1.25rem}
        .coc-header h2{font-family:var(--font-syne),sans-serif;font-weight:700;font-size:1.1rem;letter-spacing:-0.01em;margin-bottom:0.25rem}
        .coc-header p{font-size:0.78rem;color:var(--muted)}
        .coc-section{margin-bottom:1.5rem}
        .coc-section h3{font-family:var(--font-syne),sans-serif;font-size:0.9rem;font-weight:700;margin-bottom:0.75rem;padding-bottom:0.4rem;border-bottom:1px solid var(--border)}
        .coc-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.75rem}
        .coc-field{display:flex;flex-direction:column;gap:0.3rem}
        .coc-field.full{grid-column:1/-1}
        .coc-field label{font-size:0.7rem;font-weight:600;letter-spacing:0.04em;text-transform:uppercase;color:var(--muted)}
        .coc-field select,.coc-field input,.coc-field textarea{padding:0.5rem 0.7rem;border:1.5px solid var(--border);background:var(--paper);font-size:0.85rem;color:var(--ink);outline:none;font-family:inherit}
        .coc-field select:focus,.coc-field input:focus,.coc-field textarea:focus{border-color:var(--purple)}
        .coc-field textarea{resize:vertical;min-height:60px}
        .coc-transfers-list{margin-bottom:1rem}
        .coc-transfer{display:grid;grid-template-columns:1fr 1fr 1fr auto;gap:0.5rem;padding:0.6rem 0;border-bottom:1px solid var(--border);font-size:0.82rem;align-items:center}
        .coc-transfer:last-child{border-bottom:none}
        .coc-tf-label{font-size:0.65rem;font-weight:600;text-transform:uppercase;letter-spacing:0.04em;color:var(--muted)}
        .coc-tf-num{font-size:0.65rem;font-weight:700;color:var(--purple);margin-bottom:0.15rem}
        .coc-remove{background:none;border:none;color:var(--muted);cursor:pointer;font-size:0.85rem;padding:0.2rem 0.4rem;transition:color 0.15s}
        .coc-remove:hover{color:#c0392b}
        .coc-btn{padding:0.55rem 1rem;font-family:var(--font-syne),sans-serif;font-size:0.75rem;font-weight:700;letter-spacing:0.04em;text-transform:uppercase;cursor:pointer;transition:all 0.15s}
        .coc-btn-add{background:var(--purple);border:none;color:#fff;margin-bottom:1rem}
        .coc-btn-add:hover{background:var(--ink)}
        .coc-btn-print{background:none;border:1.5px solid var(--purple);color:var(--purple)}
        .coc-btn-print:hover{background:var(--purple);color:#fff}
        .coc-form{background:var(--paper);border:1.5px solid var(--border);padding:1rem;margin-bottom:1rem}
        .coc-form-actions{display:flex;gap:0.5rem;margin-top:0.75rem}
        .coc-btn-save{background:var(--purple);border:none;color:#fff;padding:0.5rem 1.2rem;font-family:var(--font-syne),sans-serif;font-size:0.75rem;font-weight:700;letter-spacing:0.04em;text-transform:uppercase;cursor:pointer}
        .coc-btn-save:hover{background:var(--ink)}
        .coc-btn-cancel{background:none;border:1.5px solid var(--border);color:var(--muted);padding:0.5rem 1rem;font-family:var(--font-syne),sans-serif;font-size:0.75rem;font-weight:700;letter-spacing:0.04em;text-transform:uppercase;cursor:pointer}
        .coc-actions{display:flex;gap:0.75rem;flex-wrap:wrap}
        @media(max-width:600px){.coc-grid{grid-template-columns:1fr}.coc-transfer{grid-template-columns:1fr}}
      `}</style>

      <div className="coc-header">
        <h2>Chain-of-Custody Generator</h2>
        <p>Fill in evidence details and custody transfers, then print a timestamped record.</p>
      </div>

      <div className="coc-section">
        <h3>Evidence Details</h3>
        <div className="coc-grid">
          <div className="coc-field">
            <label htmlFor={`${fid}-case`}>Case Number</label>
            <input id={`${fid}-case`} type="text" value={evidence.caseNumber} onChange={(e) => setEvidence({ ...evidence, caseNumber: e.target.value })} placeholder="e.g. 2026-CV-001234" />
          </div>
          <div className="coc-field">
            <label htmlFor={`${fid}-type`}>Evidence Type</label>
            <select id={`${fid}-type`} value={evidence.type} onChange={(e) => setEvidence({ ...evidence, type: e.target.value })}>
              {EVIDENCE_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          {evidence.type === 'Other' && (
            <div className="coc-field">
              <label htmlFor={`${fid}-custom`}>Custom Type</label>
              <input id={`${fid}-custom`} type="text" value={evidence.customType} onChange={(e) => setEvidence({ ...evidence, customType: e.target.value })} />
            </div>
          )}
          <div className="coc-field full">
            <label htmlFor={`${fid}-desc`}>Description</label>
            <textarea id={`${fid}-desc`} value={evidence.description} onChange={(e) => setEvidence({ ...evidence, description: e.target.value })} placeholder="Describe the evidence item in detail" />
          </div>
          <div className="coc-field">
            <label htmlFor={`${fid}-source`}>Source / Origin</label>
            <input id={`${fid}-source`} type="text" value={evidence.source} onChange={(e) => setEvidence({ ...evidence, source: e.target.value })} placeholder="e.g. ABC Security Co., Dr. Smith's office" />
          </div>
          <div className="coc-field">
            <label htmlFor={`${fid}-collector`}>Collected By</label>
            <input id={`${fid}-collector`} type="text" value={evidence.collectedBy} onChange={(e) => setEvidence({ ...evidence, collectedBy: e.target.value })} placeholder="Name and title" />
          </div>
          <div className="coc-field">
            <label htmlFor={`${fid}-cdate`}>Collection Date</label>
            <input id={`${fid}-cdate`} type="date" value={evidence.collectionDate} onChange={(e) => setEvidence({ ...evidence, collectionDate: e.target.value })} />
          </div>
          <div className="coc-field">
            <label htmlFor={`${fid}-ctime`}>Collection Time</label>
            <input id={`${fid}-ctime`} type="time" value={evidence.collectionTime} onChange={(e) => setEvidence({ ...evidence, collectionTime: e.target.value })} />
          </div>
        </div>
      </div>

      <div className="coc-section">
        <h3>Custody Transfers</h3>

        {transfers.length > 0 && (
          <div className="coc-transfers-list">
            {transfers.map((t, i) => (
              <div key={t.id} className="coc-transfer">
                <div>
                  <div className="coc-tf-num">Transfer #{i + 1}</div>
                  <strong>{t.handler}</strong>
                  {t.receivedFrom && <><br /><span className="coc-tf-label">From:</span> {t.receivedFrom}</>}
                </div>
                <div>
                  <div className="coc-tf-label">Date/Time</div>
                  {new Date(t.timestamp).toLocaleString()}
                </div>
                <div>
                  <div className="coc-tf-label">Purpose</div>
                  {t.purpose || '—'}
                  {t.location && <><br /><span className="coc-tf-label">Location:</span> {t.location}</>}
                </div>
                <button className="coc-remove" onClick={() => removeTransfer(t.id)} aria-label={`Remove transfer ${i + 1}`}>✕</button>
              </div>
            ))}
          </div>
        )}

        {showTransferForm ? (
          <div className="coc-form">
            <div className="coc-grid">
              <div className="coc-field">
                <label htmlFor={`${fid}-tf-handler`}>Received By</label>
                <input id={`${fid}-tf-handler`} type="text" value={tfHandler} onChange={(e) => setTfHandler(e.target.value)} placeholder="Name and title" />
              </div>
              <div className="coc-field">
                <label htmlFor={`${fid}-tf-from`}>Received From</label>
                <input id={`${fid}-tf-from`} type="text" value={tfReceivedFrom} onChange={(e) => setTfReceivedFrom(e.target.value)} placeholder="Name and title" />
              </div>
              <div className="coc-field">
                <label htmlFor={`${fid}-tf-time`}>Date & Time</label>
                <input id={`${fid}-tf-time`} type="datetime-local" value={tfTimestamp} onChange={(e) => setTfTimestamp(e.target.value)} />
              </div>
              <div className="coc-field">
                <label htmlFor={`${fid}-tf-loc`}>Location</label>
                <input id={`${fid}-tf-loc`} type="text" value={tfLocation} onChange={(e) => setTfLocation(e.target.value)} placeholder="e.g. Law office, evidence room" />
              </div>
              <div className="coc-field full">
                <label htmlFor={`${fid}-tf-purpose`}>Purpose of Transfer</label>
                <input id={`${fid}-tf-purpose`} type="text" value={tfPurpose} onChange={(e) => setTfPurpose(e.target.value)} placeholder="e.g. Review, analysis, court filing, storage" />
              </div>
            </div>
            <div className="coc-form-actions">
              <button className="coc-btn-save" onClick={addTransfer} type="button">Add Transfer</button>
              <button className="coc-btn-cancel" onClick={() => setShowTransferForm(false)} type="button">Cancel</button>
            </div>
          </div>
        ) : (
          <button className="coc-btn coc-btn-add" onClick={() => setShowTransferForm(true)} type="button">+ Add Transfer Event</button>
        )}
      </div>

      {hasEvidence && (
        <div className="coc-actions">
          <button className="coc-btn coc-btn-print" onClick={handlePrint} type="button">Print / Export PDF</button>
        </div>
      )}

      <div ref={printRef} style={{ display: 'none' }}>
        <h1>Chain of Custody Record</h1>
        <div className="subtitle">
          {evidence.caseNumber ? `Case: ${evidence.caseNumber} · ` : ''}Generated {new Date().toLocaleString()}
        </div>
        <h2>Evidence Information</h2>
        <dl className="grid">
          <dt>Evidence Type</dt><dd>{evidenceType}</dd>
          <dt>Case Number</dt><dd>{evidence.caseNumber || '—'}</dd>
          <dt>Description</dt><dd>{evidence.description || '—'}</dd>
          <dt>Source</dt><dd>{evidence.source || '—'}</dd>
          <dt>Collected By</dt><dd>{evidence.collectedBy || '—'}</dd>
          <dt>Collection Date/Time</dt><dd>{evidence.collectionDate ? new Date(evidence.collectionDate + 'T' + (evidence.collectionTime || '00:00')).toLocaleString() : '—'}</dd>
        </dl>
        <h2>Chain of Custody</h2>
        {transfers.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Received By</th>
                <th>Received From</th>
                <th>Date/Time</th>
                <th>Purpose</th>
                <th>Location</th>
              </tr>
            </thead>
            <tbody>
              {transfers.map((t, i) => (
                <tr key={t.id}>
                  <td>{i + 1}</td>
                  <td>{t.handler}</td>
                  <td>{t.receivedFrom || '—'}</td>
                  <td>{new Date(t.timestamp).toLocaleString()}</td>
                  <td>{t.purpose || '—'}</td>
                  <td>{t.location || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p style={{ color: '#7a7870', fontSize: '0.8rem' }}>No custody transfers recorded.</p>
        )}
        <div className="sig-line">
          <div className="sig-block">Signature — Custodian of Record &nbsp;&nbsp;&nbsp;&nbsp; Date</div>
          <div className="sig-block">Signature — Receiving Party &nbsp;&nbsp;&nbsp;&nbsp; Date</div>
        </div>
        <div className="footer">Generated by automationbyJT Chain-of-Custody Generator &middot; tools.auto-jt.com</div>
      </div>
    </div>
  );
}
