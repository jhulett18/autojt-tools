import Link from 'next/link';
import type { Tool } from '@/lib/tools';

const industryClass: Record<string, string> = {
  food: 'ind-food',
  edu: 'ind-edu',
  mfg: 'ind-mfg',
  legal: 'ind-legal',
};

export default function ToolCard({ tool }: { tool: Tool }) {
  return (
    <article className={`tool-card ${tool.color}`}>
      <span className={`tool-industry ${industryClass[tool.industry]}`}>
        {tool.industryLabel}
      </span>
      <div className="problem-tag">{tool.problemTag}</div>
      <h3>{tool.name}</h3>
      <p>{tool.description}</p>
      <Link href={`/${tool.slug}`} className="tool-link">
        Open tool &rarr;
      </Link>
    </article>
  );
}
