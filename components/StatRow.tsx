const stats = [
  { num: '6', label: 'Free tools' },
  { num: '4', label: 'Industries' },
  { num: '0', label: 'Accounts needed' },
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
