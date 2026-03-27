'use client';

import { useState, useRef, useId } from 'react';

const INJURY_LEVELS = [
  { value: 'soft_tissue', label: 'Soft Tissue', desc: 'Sprains, strains, whiplash — resolves within weeks to months', multiplierLow: 1.5, multiplierHigh: 3 },
  { value: 'moderate', label: 'Moderate', desc: 'Fractures, herniated discs, concussion — months of treatment', multiplierLow: 2, multiplierHigh: 4 },
  { value: 'severe', label: 'Severe', desc: 'Surgery required, TBI, spinal injury — long-term treatment', multiplierLow: 3, multiplierHigh: 5 },
  { value: 'catastrophic', label: 'Catastrophic / Permanent', desc: 'Amputation, paralysis, permanent disability, wrongful death', multiplierLow: 4, multiplierHigh: 7 },
] as const;

type InjuryLevel = (typeof INJURY_LEVELS)[number]['value'];

function fmt(n: number): string {
  if (n >= 1_000_000) return '$' + (n / 1_000_000).toFixed(2) + 'M';
  return '$' + n.toLocaleString();
}

export default function PiCaseValueEstimator() {
  const [injuryLevel, setInjuryLevel] = useState<InjuryLevel>('moderate');
  const [medicalCosts, setMedicalCosts] = useState('');
  const [futureMedical, setFutureMedical] = useState('');
  const [lostWages, setLostWages] = useState('');
  const [futureEarnings, setFutureEarnings] = useState('');
  const [policyLimit, setPolicyLimit] = useState('');
  const [faultPercent, setFaultPercent] = useState('0');
  const [customMultiplier, setCustomMultiplier] = useState('');
  const printRef = useRef<HTMLDivElement>(null);
  const fid = useId();

  const injury = INJURY_LEVELS.find((l) => l.value === injuryLevel)!;

  const medical = (Number(medicalCosts) || 0) + (Number(futureMedical) || 0);
  const wages = (Number(lostWages) || 0) + (Number(futureEarnings) || 0);
  const economicDamages = medical + wages;

  const mLow = customMultiplier ? Number(customMultiplier) : injury.multiplierLow;
  const mHigh = customMultiplier ? Number(customMultiplier) : injury.multiplierHigh;

  const painLow = economicDamages * mLow;
  const painHigh = economicDamages * mHigh;

  const grossLow = economicDamages + painLow;
  const grossHigh = economicDamages + painHigh;

  const fault = Math.min(100, Math.max(0, Number(faultPercent) || 0));
  const barred = fault > 50;

  const faultReduction = fault / 100;
  const netLow = barred ? 0 : grossLow * (1 - faultReduction);
  const netHigh = barred ? 0 : grossHigh * (1 - faultReduction);

  const limit = Number(policyLimit) || Infinity;
  const finalLow = Math.min(netLow, limit);
  const finalHigh = Math.min(netHigh, limit);
  const policyCapped = limit < netHigh;

  const hasInput = economicDamages > 0;

  function handlePrint() {
    const el = printRef.current;
    if (!el) return;
    const win = window.open('', '_blank');
    if (!win) return;
    win.document.write(`<!DOCTYPE html><html><head><title>PI Case Value Estimate</title>
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:system-ui,-apple-system,sans-serif;padding:2rem;color:#0d0d0b;font-size:0.85rem}
h1{font-size:1.4rem;font-weight:800;margin-bottom:0.15rem}
.subtitle{font-size:0.72rem;color:#7a7870;margin-bottom:1.5rem}
h2{font-size:1rem;font-weight:700;margin:1.25rem 0 0.5rem;border-bottom:1px solid #d0d0c8;padding-bottom:0.3rem}
table{width:100%;border-collapse:collapse;font-size:0.82rem;margin-bottom:1rem}
th,td{border:1px solid #d0d0c8;padding:0.5rem 0.6rem;text-align:left}
th{background:#f0ede6;font-weight:700;font-size:0.7rem;text-transform:uppercase;letter-spacing:0.04em}
.right{text-align:right}
.total td{font-weight:700;border-top:2px solid #0d0d0b}
.result{background:#f0eafa;padding:1rem;margin:1rem 0;text-align:center}
.result .range{font-size:1.5rem;font-weight:800;color:#5a2d8a}
.note{padding:0.75rem;background:#fef3dc;font-size:0.75rem;color:#c47a1a;border:1px solid #f0ddb0;margin:1rem 0}
.disclaimer{font-size:0.7rem;color:#7a7870;font-style:italic;margin-top:1rem}
.footer{margin-top:2rem;font-size:0.65rem;color:#aaa;border-top:1px solid #e0e0d8;padding-top:0.5rem}
@media print{body{padding:0.5in}}
</style></head><body>`);
    win.document.write(el.innerHTML);
    win.document.write('</body></html>');
    win.document.close();
    win.print();
  }

  return (
    <div className="pce">
      <style>{`
        .pce{background:var(--surface);border:1.5px solid var(--border);padding:1.5rem;margin:2rem 0}
        .pce-header{margin-bottom:1.25rem}
        .pce-header h2{font-family:var(--font-syne),sans-serif;font-weight:700;font-size:1.1rem;letter-spacing:-0.01em;margin-bottom:0.25rem}
        .pce-header p{font-size:0.78rem;color:var(--muted)}
        .pce-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.75rem;margin-bottom:1.25rem}
        .pce-field{display:flex;flex-direction:column;gap:0.3rem}
        .pce-field.full{grid-column:1/-1}
        .pce-field label{font-size:0.7rem;font-weight:600;letter-spacing:0.04em;text-transform:uppercase;color:var(--muted)}
        .pce-field select,.pce-field input{padding:0.55rem 0.8rem;border:1.5px solid var(--border);background:var(--paper);font-size:0.85rem;color:var(--ink);outline:none}
        .pce-field select:focus,.pce-field input:focus{border-color:var(--purple)}
        .pce-field .pce-hint{font-size:0.7rem;color:var(--muted);font-style:italic}
        .pce-injury-cards{display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:0.5rem;margin-bottom:1.25rem}
        .pce-injury{padding:0.75rem;border:1.5px solid var(--border);cursor:pointer;transition:all 0.15s;background:var(--paper)}
        .pce-injury:hover{border-color:var(--purple)}
        .pce-injury.active{border-color:var(--purple);background:var(--purple-light)}
        .pce-injury strong{font-family:var(--font-syne),sans-serif;font-size:0.85rem;display:block;margin-bottom:0.2rem}
        .pce-injury span{font-size:0.7rem;color:var(--muted);line-height:1.4}
        .pce-injury .pce-mult{font-size:0.68rem;font-weight:700;color:var(--purple);margin-top:0.3rem;display:block}
        .pce-section-label{font-family:var(--font-syne),sans-serif;font-size:0.78rem;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;color:var(--muted);margin-bottom:0.5rem;margin-top:1rem;display:flex;align-items:center;gap:0.75rem}
        .pce-section-label::after{content:'';flex:1;height:1px;background:var(--border)}
        .pce-result{background:var(--purple-light);padding:1.5rem;text-align:center;margin:1.5rem 0}
        .pce-result-label{font-size:0.72rem;font-weight:600;letter-spacing:0.06em;text-transform:uppercase;color:var(--muted);margin-bottom:0.5rem}
        .pce-result-range{font-family:var(--font-syne),sans-serif;font-weight:800;font-size:clamp(1.4rem,3vw,2rem);color:var(--purple);line-height:1.2}
        .pce-result-note{font-size:0.75rem;color:var(--muted);margin-top:0.5rem}
        .pce-barred{background:#fde8e8;padding:1rem;text-align:center;margin:1.5rem 0;color:#c0392b;font-weight:600}
        .pce-breakdown{margin:1rem 0}
        .pce-breakdown table{width:100%;border-collapse:collapse;font-size:0.82rem}
        .pce-breakdown th,.pce-breakdown td{border:1px solid var(--border);padding:0.5rem 0.6rem;text-align:left}
        .pce-breakdown th{background:var(--paper);font-size:0.65rem;font-weight:700;text-transform:uppercase;letter-spacing:0.06em;color:var(--muted)}
        .pce-breakdown .right{text-align:right}
        .pce-breakdown .total td{font-weight:700;border-top:2px solid var(--ink)}
        .pce-cap{font-size:0.78rem;color:var(--amber);font-weight:600;text-align:center;margin-top:0.5rem}
        .pce-disclaimer{font-size:0.72rem;color:var(--muted);font-style:italic;margin:1rem 0;line-height:1.6;padding:0.75rem;background:var(--paper);border-left:3px solid var(--border)}
        .pce-actions{display:flex;gap:0.75rem}
        .pce-btn-print{padding:0.55rem 1rem;background:none;border:1.5px solid var(--purple);color:var(--purple);font-family:var(--font-syne),sans-serif;font-size:0.75rem;font-weight:700;letter-spacing:0.04em;text-transform:uppercase;cursor:pointer;transition:all 0.15s}
        .pce-btn-print:hover{background:var(--purple);color:#fff}
        @media(max-width:600px){.pce-grid{grid-template-columns:1fr}.pce-injury-cards{grid-template-columns:1fr 1fr}}
      `}</style>

      <div className="pce-header">
        <h2>PI Case Value Estimator</h2>
        <p>Florida personal injury settlement calculator using the multiplier method. Educational estimate — not legal advice.</p>
      </div>

      <div className="pce-section-label">Injury Severity</div>
      <div className="pce-injury-cards">
        {INJURY_LEVELS.map((level) => (
          <div
            key={level.value}
            className={`pce-injury${injuryLevel === level.value ? ' active' : ''}`}
            onClick={() => { setInjuryLevel(level.value); setCustomMultiplier(''); }}
            role="radio"
            aria-checked={injuryLevel === level.value}
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); setInjuryLevel(level.value); setCustomMultiplier(''); } }}
          >
            <strong>{level.label}</strong>
            <span>{level.desc}</span>
            <span className="pce-mult">{level.multiplierLow}x – {level.multiplierHigh}x multiplier</span>
          </div>
        ))}
      </div>

      <div className="pce-section-label">Economic Damages</div>
      <div className="pce-grid">
        <div className="pce-field">
          <label htmlFor={`${fid}-med`}>Medical Bills (to date)</label>
          <input id={`${fid}-med`} type="number" min={0} step={100} value={medicalCosts} onChange={(e) => setMedicalCosts(e.target.value)} placeholder="$0" />
        </div>
        <div className="pce-field">
          <label htmlFor={`${fid}-futmed`}>Future Medical (estimated)</label>
          <input id={`${fid}-futmed`} type="number" min={0} step={100} value={futureMedical} onChange={(e) => setFutureMedical(e.target.value)} placeholder="$0" />
        </div>
        <div className="pce-field">
          <label htmlFor={`${fid}-wages`}>Lost Wages (to date)</label>
          <input id={`${fid}-wages`} type="number" min={0} step={100} value={lostWages} onChange={(e) => setLostWages(e.target.value)} placeholder="$0" />
        </div>
        <div className="pce-field">
          <label htmlFor={`${fid}-futwages`}>Future Lost Earnings</label>
          <input id={`${fid}-futwages`} type="number" min={0} step={100} value={futureEarnings} onChange={(e) => setFutureEarnings(e.target.value)} placeholder="$0" />
        </div>
      </div>

      <div className="pce-section-label">Adjustments</div>
      <div className="pce-grid">
        <div className="pce-field">
          <label htmlFor={`${fid}-policy`}>Insurance Policy Limit</label>
          <input id={`${fid}-policy`} type="number" min={0} step={5000} value={policyLimit} onChange={(e) => setPolicyLimit(e.target.value)} placeholder="e.g. 100000 (leave blank = unlimited)" />
          <span className="pce-hint">Leave blank if unknown</span>
        </div>
        <div className="pce-field">
          <label htmlFor={`${fid}-fault`}>Your Comparative Fault %</label>
          <input id={`${fid}-fault`} type="number" min={0} max={100} value={faultPercent} onChange={(e) => setFaultPercent(e.target.value)} placeholder="0" />
          <span className="pce-hint">Florida: &gt;50% bars recovery entirely</span>
        </div>
        <div className="pce-field">
          <label htmlFor={`${fid}-mult`}>Custom Multiplier (optional)</label>
          <input id={`${fid}-mult`} type="number" min={1} max={10} step={0.5} value={customMultiplier} onChange={(e) => setCustomMultiplier(e.target.value)} placeholder={`Auto: ${injury.multiplierLow}x–${injury.multiplierHigh}x`} />
          <span className="pce-hint">Override the injury-based multiplier</span>
        </div>
      </div>

      {hasInput && (
        <>
          {barred ? (
            <div className="pce-barred">
              Recovery barred — Florida&apos;s modified comparative negligence statute (2023) prevents recovery when fault exceeds 50%.
            </div>
          ) : (
            <div className="pce-result">
              <div className="pce-result-label">Estimated Settlement Range</div>
              <div className="pce-result-range">{fmt(finalLow)} – {fmt(finalHigh)}</div>
              {policyCapped && (
                <div className="pce-result-note" style={{ color: 'var(--amber)', fontWeight: 600 }}>
                  Capped by {fmt(limit)} policy limit (gross value: {fmt(netLow)} – {fmt(netHigh)})
                </div>
              )}
              {fault > 0 && !barred && (
                <div className="pce-result-note">
                  Reduced {fault}% for comparative fault
                </div>
              )}
            </div>
          )}

          <div className="pce-breakdown">
            <table>
              <thead>
                <tr><th>Component</th><th className="right">Low</th><th className="right">High</th></tr>
              </thead>
              <tbody>
                <tr><td>Medical Expenses</td><td className="right">{fmt(medical)}</td><td className="right">{fmt(medical)}</td></tr>
                <tr><td>Lost Wages / Earnings</td><td className="right">{fmt(wages)}</td><td className="right">{fmt(wages)}</td></tr>
                <tr style={{ fontWeight: 600 }}><td>Economic Damages Subtotal</td><td className="right">{fmt(economicDamages)}</td><td className="right">{fmt(economicDamages)}</td></tr>
                <tr><td>Pain & Suffering ({customMultiplier ? `${mLow}x custom` : `${mLow}x–${mHigh}x`})</td><td className="right">{fmt(painLow)}</td><td className="right">{fmt(painHigh)}</td></tr>
                <tr style={{ fontWeight: 600 }}><td>Gross Case Value</td><td className="right">{fmt(grossLow)}</td><td className="right">{fmt(grossHigh)}</td></tr>
                {fault > 0 && (
                  <tr><td>Comparative Fault Reduction ({fault}%)</td><td className="right">-{fmt(grossLow * faultReduction)}</td><td className="right">-{fmt(grossHigh * faultReduction)}</td></tr>
                )}
                {policyCapped && (
                  <tr><td>Policy Limit Cap</td><td className="right" colSpan={2}>{fmt(limit)}</td></tr>
                )}
                <tr className="total"><td>Estimated Settlement Range</td><td className="right">{fmt(finalLow)}</td><td className="right">{fmt(finalHigh)}</td></tr>
              </tbody>
            </table>
          </div>

          <div className="pce-disclaimer">
            This is an educational estimate based on standard Florida PI valuation methods (multiplier method). It is not legal advice and does not account for case-specific factors like pre-existing conditions, disputed liability, jury demographics, or attorney fee structures. Every case is unique. Consult a licensed Florida personal injury attorney for an actual case evaluation.
          </div>

          <div className="pce-actions">
            <button className="pce-btn-print" onClick={handlePrint} type="button">Print / Export PDF</button>
          </div>
        </>
      )}

      <div ref={printRef} style={{ display: 'none' }}>
        <h1>Personal Injury Case Value Estimate</h1>
        <div className="subtitle">Florida Multiplier Method &middot; Generated {new Date().toLocaleDateString()} &middot; Educational Estimate Only</div>

        <h2>Case Parameters</h2>
        <table>
          <tbody>
            <tr><td style={{ fontWeight: 700 }}>Injury Severity</td><td>{injury.label} — {injury.desc}</td></tr>
            <tr><td style={{ fontWeight: 700 }}>Multiplier Range</td><td>{customMultiplier ? `${mLow}x (custom)` : `${mLow}x – ${mHigh}x`}</td></tr>
            <tr><td style={{ fontWeight: 700 }}>Comparative Fault</td><td>{fault}%{barred ? ' (RECOVERY BARRED)' : ''}</td></tr>
            {policyLimit && <tr><td style={{ fontWeight: 700 }}>Policy Limit</td><td>{fmt(limit)}</td></tr>}
          </tbody>
        </table>

        <h2>Damage Breakdown</h2>
        <table>
          <thead><tr><th>Component</th><th className="right">Low</th><th className="right">High</th></tr></thead>
          <tbody>
            <tr><td>Medical Expenses (past + future)</td><td className="right">{fmt(medical)}</td><td className="right">{fmt(medical)}</td></tr>
            <tr><td>Lost Wages / Earnings</td><td className="right">{fmt(wages)}</td><td className="right">{fmt(wages)}</td></tr>
            <tr><td><strong>Economic Damages</strong></td><td className="right"><strong>{fmt(economicDamages)}</strong></td><td className="right"><strong>{fmt(economicDamages)}</strong></td></tr>
            <tr><td>Pain & Suffering</td><td className="right">{fmt(painLow)}</td><td className="right">{fmt(painHigh)}</td></tr>
            <tr><td><strong>Gross Value</strong></td><td className="right"><strong>{fmt(grossLow)}</strong></td><td className="right"><strong>{fmt(grossHigh)}</strong></td></tr>
            {fault > 0 && <tr><td>Fault Reduction ({fault}%)</td><td className="right">-{fmt(grossLow * faultReduction)}</td><td className="right">-{fmt(grossHigh * faultReduction)}</td></tr>}
            {policyCapped && <tr><td>Policy Cap</td><td className="right" colSpan={2}>{fmt(limit)}</td></tr>}
            <tr className="total"><td>Estimated Settlement</td><td className="right">{fmt(finalLow)}</td><td className="right">{fmt(finalHigh)}</td></tr>
          </tbody>
        </table>

        {barred && <div className="note">Recovery barred under Florida modified comparative negligence statute (2023) — claimant fault exceeds 50%.</div>}

        <div className="disclaimer">This is an educational estimate using the multiplier method. It is not legal advice. Consult a licensed Florida personal injury attorney for an actual case evaluation.</div>
        <div className="footer">Generated by automationbyJT PI Case Value Estimator &middot; tools.auto-jt.com</div>
      </div>
    </div>
  );
}
