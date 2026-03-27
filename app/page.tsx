import StatRow from '@/components/StatRow';
import ToolCard from '@/components/ToolCard';
import CtaBand from '@/components/CtaBand';
import {
  tools,
  CATEGORIES,
  SITE_URL,
  SITE_NAME,
  type ToolCategory,
} from '@/lib/tools';

function JsonLd() {
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${SITE_URL}/#organization`,
        name: SITE_NAME,
        url: 'https://auto-jt.com',
        areaServed: {
          '@type': 'GeoCircle',
          geoMidpoint: {
            '@type': 'GeoCoordinates',
            latitude: 26.7153,
            longitude: -80.0534,
          },
          geoRadius: '150 mi',
        },
      },
      {
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        name: `${SITE_NAME} Free Tools`,
        url: SITE_URL,
        publisher: { '@id': `${SITE_URL}/#organization` },
      },
      {
        '@type': 'ItemList',
        name: 'Free Business Tools for South Florida',
        description:
          'Browser-based tools for food service, education, legal, and manufacturing businesses',
        numberOfItems: tools.length,
        itemListElement: tools.map((t, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          url: `${SITE_URL}/${t.slug}`,
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

const categoryOrder: ToolCategory[] = ['deadline', 'cost', 'operations', 'food-safety'];

export default function HomePage() {
  return (
    <>
      <JsonLd />

      <section className="hero" aria-labelledby="hero-heading">
        <div className="hero-eyebrow">Free tools for South Florida businesses</div>
        <h1 id="hero-heading">
          Free Business Tools for <em>South Florida</em>
        </h1>
        <p className="hero-tagline">
          The spreadsheet you&apos;ve been putting off — <em>built already.</em>
        </p>
        <p>
          Six free browser-based tools solving real compliance, deadline, and operations problems. No
          signup. No ads. Just the tool.
        </p>
        <StatRow />
      </section>

      <div className="categories">
        {categoryOrder.map((cat) => {
          const catTools = tools.filter((t) => t.category === cat);
          if (catTools.length === 0) return null;
          return (
            <section key={cat} aria-labelledby={`cat-${cat}`}>
              <h2 className="cat-label" id={`cat-${cat}`}>
                {CATEGORIES[cat]}
              </h2>
              <div className="tools-grid">
                {catTools.map((tool) => (
                  <ToolCard key={tool.slug} tool={tool} />
                ))}
              </div>
            </section>
          );
        })}
      </div>

      <CtaBand />
    </>
  );
}
