import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'automationbyJT — Free Business Tools for South Florida';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#f7f5f0',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '60px',
        }}
      >
        <div
          style={{
            fontSize: 24,
            fontWeight: 600,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: '#1D9E75',
            marginBottom: 24,
          }}
        >
          FREE TOOLS FOR SOUTH FLORIDA BUSINESSES
        </div>
        <div
          style={{
            fontSize: 64,
            fontWeight: 800,
            color: '#0d0d0b',
            textAlign: 'center',
            lineHeight: 1.1,
            letterSpacing: '-0.03em',
            marginBottom: 24,
          }}
        >
          The spreadsheet you&apos;ve been
          <br />
          putting off — <span style={{ color: '#1D9E75' }}>built already.</span>
        </div>
        <div
          style={{
            display: 'flex',
            gap: 40,
            marginTop: 20,
            fontSize: 20,
            color: '#7a7870',
          }}
        >
          <span>6 Free Tools</span>
          <span>4 Industries</span>
          <span>No Signup</span>
          <span>Instant Export</span>
        </div>
        <div
          style={{
            position: 'absolute',
            bottom: 40,
            fontSize: 20,
            fontWeight: 800,
            color: '#0d0d0b',
          }}
        >
          automation<span style={{ color: '#1D9E75' }}>byJT</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
