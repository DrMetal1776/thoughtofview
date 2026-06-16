export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="font-serif text-5xl font-bold mb-4">Terms of Use</h1>
      <p className="text-gray-500 mb-10">Last updated: June 15, 2026</p>
      <div className="space-y-8 text-gray-700 leading-relaxed">
        <section>
          <h2 className="font-serif text-2xl font-bold text-black mb-3">1. Acceptance of Terms</h2>
          <p>By using Thought of View, you agree to these Terms of Use. If you do not agree, please do not use the site.</p>
        </section>
        <section>
          <h2 className="font-serif text-2xl font-bold text-black mb-3">2. AI-Generated Content</h2>
          <p>All opinions and perspectives generated on this site are produced by artificial intelligence. They are intended for entertainment, education, and debate purposes only. They do not represent the views of Thought of View, its owners, or its staff. Do not rely on AI-generated content for legal, medical, financial, or other professional advice.</p>
        </section>
        <section>
          <h2 className="font-serif text-2xl font-bold text-black mb-3">3. User Conduct</h2>
          <p>You agree not to use this site to generate content that is illegal, harmful, defamatory, or violates the rights of others. We reserve the right to remove any content that violates these terms.</p>
        </section>
        <section>
          <h2 className="font-serif text-2xl font-bold text-black mb-3">4. Intellectual Property</h2>
          <p>The Thought of View name, logo, and design are owned by us. AI-generated content produced on this site may be shared freely with attribution to thoughtofview.com.</p>
        </section>
        <section>
          <h2 className="font-serif text-2xl font-bold text-black mb-3">5. Limitation of Liability</h2>
          <p>Thought of View is provided "as is" without warranties of any kind. We are not liable for any damages arising from your use of the site or reliance on AI-generated content.</p>
        </section>
        <section>
          <h2 className="font-serif text-2xl font-bold text-black mb-3">6. Changes to Terms</h2>
          <p>We may update these terms at any time. Continued use of the site constitutes acceptance of the updated terms.</p>
        </section>
        <section>
          <h2 className="font-serif text-2xl font-bold text-black mb-3">7. Contact</h2>
          <p>Questions about these terms? <a href="/contact" className="text-orange-600 hover:underline">Contact us</a>.</p>
        </section>
      </div>
    </div>
  )
}
