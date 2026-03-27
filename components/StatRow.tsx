const stats = [
  { num: '7', label: 'Free tools' },
  { num: '0', label: 'Signups required' },
  { num: '100%', label: 'Browser-based' },
  { num: '\u221E', label: 'Print / export' },
];

export default function StatRow() {
  return (
    <dl className="hero-stat-row">
      {stats.map((s) => (
        <div key={s.label} className="stat">
          <dt>{s.label}</dt>
          <dd>{s.num}</dd>
        </div>
      ))}
    </dl>
  );
}
