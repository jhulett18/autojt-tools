import Link from 'next/link';
import { CONTACT_EMAIL } from '@/lib/tools';

export default function Nav() {
  return (
    <nav>
      <Link href="/" className="nav-logo">
        automation<span>byJT</span>
      </Link>
      <a className="nav-cta" href={`mailto:${CONTACT_EMAIL}`}>
        Work with JT &rarr;
      </a>
    </nav>
  );
}
