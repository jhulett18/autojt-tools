import { CONTACT_EMAIL } from '@/lib/tools';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div>
        <span>&copy; 2026 Automations by JT &middot; Fort Pierce &rarr; Fort Lauderdale, FL</span>
        <br />
        <span className="footer-counties">
          Broward County &middot; Palm Beach County &middot; Martin County &middot; St. Lucie County &middot; Indian River County
        </span>
      </div>
      <span>auto-jt.com &middot; {CONTACT_EMAIL}</span>
    </footer>
  );
}
