import type { Metadata } from 'next';
import { Syne, Epilogue } from 'next/font/google';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import { SITE_NAME, SITE_URL } from '@/lib/tools';
import './globals.css';

const syne = Syne({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-syne',
  weight: ['400', '600', '700', '800'],
});

const epilogue = Epilogue({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-epilogue',
  weight: ['300', '400', '500'],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `Free Business Tools for South Florida | ${SITE_NAME}`,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    '7 free browser-based tools for South Florida businesses. IEP deadline calculators, food truck permits, deposition costs, allergen matrices — no signup, instant export.',
  keywords: [
    'free business tools',
    'South Florida',
    'automation',
    'food truck permits',
    'IEP calculator',
    'allergen matrix',
    'deposition cost',
  ],
  authors: [{ name: 'JT', url: 'https://auto-jt.com' }],
  creator: SITE_NAME,
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: SITE_NAME,
    title: `Free Business Tools for South Florida | ${SITE_NAME}`,
    description:
      '7 free browser-based tools for food service, education, legal, and manufacturing businesses in South Florida. No account needed.',
    url: SITE_URL,
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: `${SITE_NAME} — Free Business Tools for South Florida`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `Free Business Tools for South Florida | ${SITE_NAME}`,
    description:
      '7 free browser-based tools for food service, education, legal, and manufacturing. No signup. Instant export.',
    images: ['/og-image.png'],
  },
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${syne.variable} ${epilogue.variable}`}>
      <body
        style={{
          fontFamily: 'var(--font-epilogue), sans-serif',
        }}
      >
        <header role="banner">
          <Nav />
        </header>
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
