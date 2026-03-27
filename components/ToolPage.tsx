import Link from 'next/link';
import CtaBand from '@/components/CtaBand';
import ToolCard from '@/components/ToolCard';
import { type Tool, getRelatedTools, SITE_URL } from '@/lib/tools';

const industryClass: Record<string, string> = {
  food: 'ind-food',
  edu: 'ind-edu',
  mfg: 'ind-mfg',
  legal: 'ind-legal',
};

function ToolJsonLd({ tool }: { tool: Tool }) {
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebApplication',
        name: tool.name,
        description: tool.seo.description,
        url: `${SITE_URL}/${tool.slug}`,
        applicationCategory: 'BusinessApplication',
        operatingSystem: 'Any (browser-based)',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
        },
        creator: { '@id': `${SITE_URL}/#organization` },
        browserRequirements: 'Requires JavaScript',
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Free Tools',
            item: SITE_URL,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: tool.name,
            item: `${SITE_URL}/${tool.slug}`,
          },
        ],
      },
      {
        '@type': 'FAQPage',
        mainEntity: tool.content.faq.map((f) => ({
          '@type': 'Question',
          name: f.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: f.answer,
          },
        })),
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export default function ToolPage({ tool, children }: { tool: Tool; children?: React.ReactNode }) {
  const related = getRelatedTools(tool.slug);

  return (
    <>
      <ToolJsonLd tool={tool} />

      <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link href="/">Free Tools</Link>
        <span>/</span>
        <span>{tool.name}</span>
      </nav>

      <div className="tool-page">
        <span className={`tool-industry ${industryClass[tool.industry]}`}>
          {tool.industryLabel}
        </span>
        <h1>{tool.name}</h1>
        <p style={{ color: 'var(--muted)', fontSize: '0.85rem', fontStyle: 'italic' }}>
          {tool.problemTag}
        </p>

        {children || (
          <div className="tool-placeholder">
            <p>
              <strong>{tool.name}</strong> — interactive tool coming soon.
            </p>
            <p style={{ marginTop: '0.5rem' }}>
              This tool will be fully browser-based with no signup required.
            </p>
          </div>
        )}

        <div className="tool-content">
          <h2>How to Use the {tool.name}</h2>
          <ol>
            {tool.content.howToUse.map((step, i) => (
              <li key={i}>{step}</li>
            ))}
          </ol>

          <h2>Who This Tool Is For</h2>
          <p>{tool.content.whoFor}</p>

          <h2>{tool.content.contextHeading}</h2>
          <p>{tool.content.context}</p>

          <section className="faq-section" aria-labelledby="faq-heading">
            <h2 id="faq-heading">Frequently Asked Questions</h2>
            {tool.content.faq.map((f, i) => (
              <div key={i} className="faq-item">
                <h3>{f.question}</h3>
                <p>{f.answer}</p>
              </div>
            ))}
          </section>

          {related.length > 0 && (
            <section className="related-section" aria-labelledby="related-heading">
              <h2 id="related-heading">Related Tools</h2>
              <div className="related-grid">
                {related.map((r) => (
                  <ToolCard key={r.slug} tool={r} />
                ))}
              </div>
            </section>
          )}
        </div>
      </div>

      <CtaBand pitch={tool.content.ctaPitch} />
    </>
  );
}
