import type { Metadata } from 'next';
import { getToolBySlug } from '@/lib/tools';
import ToolPage from '@/components/ToolPage';
import AllergenMatrixBuilder from '@/components/tools/AllergenMatrixBuilder';
import { notFound } from 'next/navigation';

const tool = getToolBySlug('allergen-matrix-builder')!;

export const metadata: Metadata = {
  title: tool.seo.title,
  description: tool.seo.description,
  keywords: tool.seo.keywords,
  alternates: { canonical: `/${tool.slug}` },
  openGraph: {
    title: tool.seo.title,
    description: tool.seo.description,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: tool.seo.title,
    description: tool.seo.description,
  },
};

export default function Page() {
  if (!tool) notFound();
  return (
    <ToolPage tool={tool}>
      <AllergenMatrixBuilder />
    </ToolPage>
  );
}
