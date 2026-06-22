import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Terms of Service for Thought of View.',
}

const LAST_UPDATED = 'June 22, 2026'

export default function TermsPage() {
  return (
    <main style={{ minHeight: '100vh', backgroundColor: '#0d1117', color: '#e6edf3', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ maxWidth: '760px', margin: '0 auto', padding: '80px 24px' }}>

        <div style={{ marginBottom: '56px' }}>
          <p style={{ color: '#4dd9c0', fontSize: '13px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '16px' }}>
            Legal
          </p>
          <h1 style={{ fontSize: '48px', fontWeight: 700, lineHeight: 1.15, margin: '0 0 16px', color: '#ffffff' }}>
            Terms of Service
          </h1>
          <p style={{ fontSize: '15px', color: '#8b949e', margin: 0 }}>Last updated: {LAST_UPDATED}</p>
        </div>

        <div style={{ height: '1px', backgroundColor: '#21262d', marginBottom: '48px' }} />

        <p style={{ fontSize: '17px', color: '#8b949e', lineHeight: 1.8, marginBottom: '40px' }}>
          By using Thought of View ("the Service"), you agree to these Terms of Service. Please read them carefully before using the platform.
        </p>

        {[
          {
            title: '1. Acceptance of terms',
            content: [
              'By accessing or using thoughtofview.com, you agree to be bound by these Terms of Service and our Privacy Policy. If you do not agree, please do not use the Service.',
            ],
          },
          {
            title: '2. Use of the service',
            content: [
              'You must be at least 13 years old to use Thought of View.',
              'You agree to use the Service only for lawful purposes and in a way that does not infringe the rights of others.',
              'You are responsible for maintaining the confidentiality of your account credentials.',
              'You agree not to submit content that is illegal, harassing, defamatory, obscene, or otherwise objectionable.',
              'You agree not to attempt to reverse-engineer, scrape, or disrupt the Service or its underlying systems.',
            ],
          },
          {
            title: '3. AI-generated content',
            content: [
              'Thought of View uses artificial intelligence to generate opinions and perspectives. This content is for informational and entertainment purposes only.',
              'AI-generated content does not represent the views of Thought of View or its operators.',
              'We do not guarantee the accuracy, completeness, or reliability of any AI-generated content on the platform.',
              'You should not rely on AI-generated content for professional, legal, financial, or medical advice.',
            ],
          },
          {
            title: '4. Subscriptions and payments',
            content: [
              'Premium subscriptions are billed at $5.00 per month. OpinionBot is available as a one-time purchase at $4.99.',
              'All payments are processed securely by Stripe. By making a purchase, you agree to Stripe\'s terms of service.',
              'Subscription billing recurs monthly on the date of your original purchase.',
              'You may cancel your subscription at any time from your profile page. Cancellation takes effect at the end of the current billing period.',
              'All purchases are final. We do not offer refunds except where required by applicable law.',
            ],
          },
          {
            title: '5. Intellectual property',
            content: [
              'The Thought of View name, logo, and site design are the property of their respective owners.',
              'You retain ownership of any content you submit to the platform. By submitting content, you grant us a non-exclusive license to display it on the Service.',
              'AI-generated content produced by the Service may not be reproduced or redistributed for commercial purposes without permission.',
            ],
          },
          {
            title: '6. Disclaimers',
            content: [
              'The Service is provided "as is" without warranties of any kind, express or implied.',
              'We do not guarantee uninterrupted or error-free operation of the Service.',
              'We are not responsible for any loss or damage resulting from your use of the Service or reliance on any content found on it.',
            ],
          },
          {
            title: '7. Limitation of liability',
            content: [
              'To the maximum extent permitted by law, Thought of View and its operators shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the Service.',
              'Our total liability to you for any claims arising from these Terms shall not exceed the amount you paid us in the 12 months preceding the claim.',
            ],
          },
          {
            title: '8. Termination',
            content: [
              'We reserve the right to suspend or terminate your account at any time for violation of these Terms.',
              'You may delete your account at any time by contacting us at thoughtofview@gmail.com.',
            ],
          },
          {
            title: '9. Changes to these terms',
            content: [
              'We may update these Terms from time to time. Continued use of the Service after changes are posted constitutes acceptance of the revised Terms.',
            ],
          },
          {
            title: '10. Contact',
            content: [
              'If you have questions about these Terms, please contact us at thoughtofview@gmail.com.',
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
