'use client';

import { useState, useRef, useId } from 'react';

const ALLERGENS = [
  { key: 'milk', label: 'Milk', emoji: '🥛' },
  { key: 'eggs', label: 'Eggs', emoji: '🥚' },
  { key: 'fish', label: 'Fish', emoji: '🐟' },
  { key: 'shellfish', label: 'Shellfish', emoji: '🦐' },
  { key: 'tree_nuts', label: 'Tree Nuts', emoji: '🌰' },
  { key: 'peanuts', label: 'Peanuts', emoji: '🥜' },
  { key: 'wheat', label: 'Wheat', emoji: '🌾' },
  { key: 'soy', label: 'Soy', emoji: '🫘' },
  { key: 'sesame', label: 'Sesame', emoji: '⚪' },
] as const;

type AllergenKey = (typeof ALLERGENS)[number]['key'];

interface MenuItem {
  id: string;
  name: string;
  allergens: Set<AllergenKey>;
}

export default function AllergenMatrixBuilder() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [newItemName, setNewItemName] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const printRef = useRef<HTMLDivElement>(null);
  const formId = useId();

  function addItem() {
    const name = newItemName.trim();
    if (!name) return;
    setItems((prev) => [
      ...prev,
      { id: crypto.randomUUID(), name, allergens: new Set() },
    ]);
    setNewItemName('');
    inputRef.current?.focus();
  }

  function removeItem(id: string) {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }

  function toggleAllergen(itemId: string, allergen: AllergenKey) {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== itemId) return item;
        const next = new Set(item.allergens);
        if (next.has(allergen)) next.delete(allergen);
        else next.add(allergen);
        return { ...item, allergens: next };
      })
    );
  }

  function getAllergenSummary(item: MenuItem): string {
    if (item.allergens.size === 0) return 'No major allergens';
    return ALLERGENS.filter((a) => item.allergens.has(a.key))
      .map((a) => a.label)
      .join(', ');
  }

  function handlePrint() {
    const el = printRef.current;
    if (!el) return;
    const win = window.open('', '_blank');
    if (!win) return;
    win.document.write(`<!DOCTYPE html><html><head><title>Allergen Matrix</title>
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:system-ui,-apple-system,sans-serif;padding:2rem;color:#0d0d0b}
h1{font-size:1.4rem;font-weight:800;margin-bottom:0.25rem}
.subtitle{font-size:0.75rem;color:#7a7870;margin-bottom:1.5rem}
table{width:100%;border-collapse:collapse;font-size:0.8rem}
th,td{border:1px solid #d0d0c8;padding:0.5rem 0.4rem;text-align:center}
th{background:#f0ede6;font-weight:700;font-size:0.7rem;text-transform:uppercase;letter-spacing:0.04em}
th:first-child,td:first-child{text-align:left;font-weight:600}
.has{background:#fef3dc;color:#c47a1a;font-weight:700}
.none{color:#ccc}
.summary{margin-top:1.5rem;font-size:0.75rem;border-top:1px solid #d0d0c8;padding-top:1rem}
.summary dt{font-weight:700;margin-top:0.5rem}
.summary dd{color:#7a7870;margin-left:0}
.footer{margin-top:2rem;font-size:0.65rem;color:#aaa;border-top:1px solid #e0e0d8;padding-top:0.5rem}
@media print{body{padding:0.5in}}
</style></head><body>`);
    win.document.write(el.innerHTML);
    win.document.write('</body></html>');
    win.document.close();
    win.print();
  }

  return (
    <div className="amx">
      <style>{`
        .amx{background:var(--surface);border:1.5px solid var(--border);padding:1.5rem;margin:2rem 0}
        .amx-header{margin-bottom:1.25rem}
        .amx-header h2{font-family:var(--font-syne),sans-serif;font-weight:700;font-size:1.1rem;letter-spacing:-0.01em;margin-bottom:0.25rem}
        .amx-header p{font-size:0.78rem;color:var(--muted)}
        .amx-add{display:flex;gap:0.5rem;margin-bottom:1.5rem}
        .amx-add input{flex:1;padding:0.6rem 0.8rem;border:1.5px solid var(--border);background:var(--paper);font-size:0.85rem;color:var(--ink);outline:none;transition:border-color 0.15s}
        .amx-add input:focus{border-color:var(--amber)}
        .amx-add button{padding:0.6rem 1.2rem;background:var(--amber);border:none;color:#fff;font-family:var(--font-syne),sans-serif;font-size:0.78rem;font-weight:700;letter-spacing:0.04em;text-transform:uppercase;cursor:pointer;transition:background 0.15s;white-space:nowrap}
        .amx-add button:hover{background:var(--ink)}
        .amx-empty{text-align:center;padding:2.5rem 1rem;color:var(--muted);font-size:0.85rem}
        .amx-table-wrap{overflow-x:auto;margin-bottom:1rem;-webkit-overflow-scrolling:touch}
        .amx-table{width:100%;border-collapse:collapse;font-size:0.82rem;min-width:640px}
        .amx-table th,.amx-table td{border:1px solid var(--border);padding:0.5rem 0.4rem;text-align:center;vertical-align:middle}
        .amx-table th{background:var(--paper);font-size:0.65rem;font-weight:700;text-transform:uppercase;letter-spacing:0.06em;color:var(--muted);white-space:nowrap}
        .amx-table th:first-child{text-align:left;min-width:140px}
        .amx-table td:first-child{text-align:left;font-weight:600;font-size:0.85rem}
        .amx-table td:last-child{text-align:center}
        .amx-cell{cursor:pointer;user-select:none;transition:background 0.1s;position:relative}
        .amx-cell:hover{background:var(--amber-light)}
        .amx-cell.active{background:var(--amber-light);color:var(--amber);font-weight:700}
        .amx-cell .dot{display:inline-block;width:10px;height:10px;border-radius:50%;background:var(--border)}
        .amx-cell.active .dot{background:var(--amber)}
        .amx-remove{background:none;border:none;color:var(--muted);cursor:pointer;font-size:0.9rem;padding:0.2rem 0.4rem;transition:color 0.15s;line-height:1}
        .amx-remove:hover{color:#c0392b}
        .amx-summary{margin-top:1rem;border-top:1px solid var(--border);padding-top:1rem}
        .amx-summary h3{font-family:var(--font-syne),sans-serif;font-size:0.85rem;font-weight:700;margin-bottom:0.75rem}
        .amx-summary-item{display:flex;gap:0.5rem;margin-bottom:0.4rem;font-size:0.8rem;line-height:1.5}
        .amx-summary-item strong{min-width:120px;flex-shrink:0}
        .amx-summary-item span{color:var(--muted)}
        .amx-actions{display:flex;gap:0.75rem;margin-top:1.25rem;flex-wrap:wrap}
        .amx-actions button{padding:0.55rem 1rem;font-family:var(--font-syne),sans-serif;font-size:0.75rem;font-weight:700;letter-spacing:0.04em;text-transform:uppercase;cursor:pointer;transition:all 0.15s}
        .amx-btn-print{background:none;border:1.5px solid var(--amber);color:var(--amber)}
        .amx-btn-print:hover{background:var(--amber);color:#fff}
        .amx-btn-clear{background:none;border:1.5px solid var(--border);color:var(--muted)}
        .amx-btn-clear:hover{border-color:var(--muted);color:var(--ink)}
      `}</style>

      <div className="amx-header">
        <h2>Allergen Matrix Builder</h2>
        <p>Add menu items below, then click cells to mark allergens. All data stays in your browser.</p>
      </div>

      <form
        className="amx-add"
        onSubmit={(e) => {
          e.preventDefault();
          addItem();
        }}
      >
        <label htmlFor={`${formId}-input`} style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0,0,0,0)' }}>
          Menu item name
        </label>
        <input
          id={`${formId}-input`}
          ref={inputRef}
          type="text"
          value={newItemName}
          onChange={(e) => setNewItemName(e.target.value)}
          placeholder="e.g. Caesar Salad, Fish Tacos, Chocolate Cake…"
        />
        <button type="submit">Add Item</button>
      </form>

      {items.length === 0 ? (
        <div className="amx-empty">
          <p>No menu items yet. Add your first dish above to start building your allergen matrix.</p>
        </div>
      ) : (
        <>
          <div className="amx-table-wrap">
            <table className="amx-table" role="grid" aria-label="Allergen matrix">
              <thead>
                <tr>
                  <th scope="col">Menu Item</th>
                  {ALLERGENS.map((a) => (
                    <th key={a.key} scope="col" title={a.label}>
                      <span aria-hidden="true">{a.emoji}</span>
                      <br />
                      {a.label}
                    </th>
                  ))}
                  <th scope="col" style={{ width: '2.5rem' }}></th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id}>
                    <td>{item.name}</td>
                    {ALLERGENS.map((a) => {
                      const active = item.allergens.has(a.key);
                      return (
                        <td
                          key={a.key}
                          className={`amx-cell${active ? ' active' : ''}`}
                          onClick={() => toggleAllergen(item.id, a.key)}
                          role="checkbox"
                          aria-checked={active}
                          aria-label={`${item.name} contains ${a.label}`}
                          tabIndex={0}
                          onKeyDown={(e) => {
                            if (e.key === ' ' || e.key === 'Enter') {
                              e.preventDefault();
                              toggleAllergen(item.id, a.key);
                            }
                          }}
                        >
                          <span className="dot" />
                        </td>
                      );
                    })}
                    <td>
                      <button
                        className="amx-remove"
                        onClick={() => removeItem(item.id)}
                        aria-label={`Remove ${item.name}`}
                        title="Remove item"
                      >
                        ✕
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="amx-summary">
            <h3>Allergen Summary</h3>
            {items.map((item) => (
              <div key={item.id} className="amx-summary-item">
                <strong>{item.name}:</strong>
                <span>{getAllergenSummary(item)}</span>
              </div>
            ))}
          </div>

          <div className="amx-actions">
            <button className="amx-btn-print" onClick={handlePrint} type="button">
              Print / Export PDF
            </button>
            <button
              className="amx-btn-clear"
              onClick={() => {
                if (window.confirm('Clear all menu items?')) setItems([]);
              }}
              type="button"
            >
              Clear All
            </button>
          </div>
        </>
      )}

      {/* Hidden print-ready version */}
      <div ref={printRef} style={{ display: 'none' }}>
        <h1>Allergen Matrix</h1>
        <div className="subtitle">
          Generated {new Date().toLocaleDateString()} &middot; {items.length} menu items &middot; FDA Big 9 Allergens
        </div>
        <table>
          <thead>
            <tr>
              <th style={{ textAlign: 'left' }}>Menu Item</th>
              {ALLERGENS.map((a) => (
                <th key={a.key}>{a.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td style={{ textAlign: 'left', fontWeight: 600 }}>{item.name}</td>
                {ALLERGENS.map((a) => (
                  <td key={a.key} className={item.allergens.has(a.key) ? 'has' : 'none'}>
                    {item.allergens.has(a.key) ? '●' : '—'}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <dl className="summary">
          {items.map((item) => (
            <div key={item.id}>
              <dt>{item.name}</dt>
              <dd>{getAllergenSummary(item)}</dd>
            </div>
          ))}
        </dl>
        <div className="footer">
          Generated by automationbyJT Allergen Matrix Builder &middot; tools.auto-jt.com &middot; FDA FASTER Act Big 9 Allergens
        </div>
      </div>
    </div>
  );
}
