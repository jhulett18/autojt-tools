'use client';

import { CONTACT_EMAIL } from '@/lib/tools';

export default function CtaBand({ pitch }: { pitch?: string }) {
  return (
    <section className="cta-band" aria-labelledby="cta-heading">
      <h2 id="cta-heading">
        Want this <span>automated</span>?
      </h2>
      <p>
        {pitch ||
          'These free tools show what we build. The production versions plug into your systems — and handle the work for you.'}
      </p>
      <a
        className="cta-email-btn"
        href={`mailto:${CONTACT_EMAIL}?subject=Automation%20inquiry%20from%20tools.auto-jt.com&body=Hi%20JT%2C%0A%0AI%20found%20your%20free%20tools%20site%20and%20I%27m%20interested%20in%20automating%20some%20of%20my%20business%20processes.%0A%0A`}
      >
        Email JT &rarr;
      </a>
      <div className="cta-fine">Free consultation &middot; South Florida businesses &middot; hello@auto-jt.com</div>
    </section>
  );
}
