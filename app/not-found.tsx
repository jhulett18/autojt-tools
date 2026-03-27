import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="tool-page" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
      <h1>Page Not Found</h1>
      <p style={{ color: 'var(--muted)', margin: '1rem 0 2rem' }}>
        The page you&apos;re looking for doesn&apos;t exist.
      </p>
      <Link
        href="/"
        style={{
          color: 'var(--teal)',
          fontWeight: 600,
          borderBottom: '1.5px solid var(--teal-light)',
          paddingBottom: '2px',
        }}
      >
        &larr; Back to Free Tools
      </Link>
    </div>
  );
}
