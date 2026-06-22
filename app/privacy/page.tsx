import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Privacy Policy for Thought of View.',
}

const LAST_UPDATED = 'June 22, 2026'

export default function PrivacyPage() {
  return (
    <main style={{ minHeight: '100vh', backgroundColor: '#0d1117', color: '#e6edf3', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ maxWidth: '760px', margin: '0 auto', padding: '80px 24px' }}>

        <div style={{ marginBottom: '56px' }}>
          <p style={{ color: '#4dd9c0', fontSize: '13px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '16px' }}>
            Legal
          </p>
          <h1 style={{ fontSize: '48px', fontWeight: 700, lineHeight: 1.15, margin: '0 0 16px', color: '#ffffff' }}>
            Privacy Policy
          </h1>
          <p style={{ fontSize: '15px', color: '#8b949e', margin: 0 }}>Last updated: {LAST_UPDATED}</p>
        </div>

        <div style={{ height: '1px', backgroundColor: '#21262d', marginBottom: '48px' }} />

        {[
          {
            title: '1. Information we collect',
            content: [
              'When you create an account, we collect your name and email address via Google OAuth.',
              'When you make a purchase, Stripe processes your payment information directly. We store only your subscription status and purchase history — never your full card details.',
              'We collect usage data such as opinions submitted, votes cast, and pages visited to improve the platform.',
              'We may collect technical information such as your IP address, browser type, and device information for security and analytics purposes.',
            ],
          },
          {
            title: '2. How we use your information',
            content: [
              'To provide and operate the Thought of View platform and its features.',
              'To process payments and manage your subscription or one-time purchases via Stripe.',
              'To send transactional emails such as purchase confirmations and account notices.',
              'To improve the platform based on how users interact with it.',
              'To comply with legal obligations and protect against fraudulent or abusive use.',
            ],
          },
          {
            title: '3. Data sharing',
            content: [
              'We do not sell your personal data to third parties.',
              'We share data with the following service providers solely to operate the platform: Google (authentication), Stripe (payments), Supabase (database), and Vercel (hosting).',
              'We may disclose information if required by law or to protect the rights and safety of our users.',
            ],
          },
          {
            title: '4. Cookies and tracking',
            content: [
              'We use cookies and similar technologies to keep you logged in and remember your preferences.',
              'We may use third-party analytics tools to understand how visitors use the site. These tools may set their own cookies.',
              'Google AdSense, if active on the site, may use cookies to serve personalized ads. You can opt out via Google\'s ad settings at g.co/adsettings.',
            ],
          },
          {
            title: '5. Data retention',
            content: [
              'We retain your account data for as long as your account is active.',
              'You may request deletion of your account and associated data at any time by emailing us.',
              'Stripe retains transaction records in accordance with their own privacy policy and applicable law.',
            ],
          },
          {
            title: '6. Your rights',
            content: [
              'You have the right to access, correct, or delete the personal data we hold about you.',
              'You may withdraw consent or request data portability at any time.',
              'To exercise any of these rights, contact us at thoughtofview@gmail.com.',
            ],
          },
          {
            title: '7. Children\'s privacy',
            content: [
              'Thought of View is not directed at children under the age of 13. We do not knowingly collect personal information from children. If you believe a child has provided us with personal information, please contact us immediately.',
            ],
          },
          {
            title: '8. Changes to this policy',
            content: [
              'We may update this Privacy Policy from time to time. We will notify you of significant changes by posting the new policy on this page with an updated date.',
            ],
          },
          {
            title: '9. Contact',
            content: [
              'If you have questions about this Privacy Policy, please contact us at thoughtofview@gmail.com.',
            ],
          },
        ].map(({ title, content }) => (
          <section key={title} style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 600, color: '#ffffff', marginBottom: '16px' }}>{title}</h2>
            {content.map((para, i) => (
              <p key={i} style={{ fontSize: '16px', color: '#8b949e', lineHeight: 1.8, margin: '0 0 12px' }}>{para}</p>
            ))}
          </section>
        ))}

      </div>
    </main>
  )
}
