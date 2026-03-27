'use client';

import { useState } from 'react';

export default function CtaBand() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <section className="cta-band" aria-labelledby="cta-heading">
      <h2 id="cta-heading">
        Want this <span>automated</span>?
      </h2>
      <p>
        These tools are demos. The real version plugs into your scheduling system, CRM, or case
        management software — and sends the reminders for you.
      </p>
      <form
        className="cta-email"
        aria-label="Get automation updates"
        onSubmit={(e) => {
          e.preventDefault();
          setSubmitted(true);
        }}
      >
        <label htmlFor="email-capture">Your email</label>
        <input
          type="email"
          id="email-capture"
          name="email"
          placeholder="your@email.com"
          required
          autoComplete="email"
        />
        <button type="submit">{submitted ? 'Sent \u2713' : 'Get new tools'}</button>
      </form>
      <div className="cta-fine">New tools monthly &middot; No spam &middot; Unsubscribe any time</div>
    </section>
  );
}
