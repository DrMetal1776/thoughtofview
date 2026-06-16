export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="font-serif text-5xl font-bold mb-4">Privacy Policy</h1>
      <p className="text-gray-500 mb-10">Last updated: June 15, 2026</p>
      <div className="space-y-8 text-gray-700 leading-relaxed">
        <section>
          <h2 className="font-serif text-2xl font-bold text-black mb-3">1. Information We Collect</h2>
          <p>When you use Thought of View, we may collect the following information:</p>
          <ul className="list-disc pl-6 mt-3 space-y-2">
            <li><strong>Account information:</strong> When you sign in with Google, we receive your name, email address, and profile picture.</li>
            <li><strong>Content you create:</strong> Topics and AI-generated takes you save to your profile.</li>
            <li><strong>Usage data:</strong> Pages visited, features used, and interactions with the site.</li>
            <li><strong>Cookies:</strong> We use cookies for authentication, analytics, and advertising.</li>
          </ul>
        </section>
        <section>
          <h2 className="font-serif text-2xl font-bold text-black mb-3">2. How We Use Your Information</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>To provide and improve the Thought of View service</li>
            <li>To save and display your AI-generated takes</li>
            <li>To send you newsletters you've subscribed to</li>
            <li>To display relevant advertising via Google AdSense</li>
            <li>To analyze site traffic and usage patterns</li>
          </ul>
        </section>
        <section>
          <h2 className="font-serif text-2xl font-bold text-black mb-3">3. Advertising</h2>
          <p>We use Google AdSense to display advertisements. Google may use cookies to show you ads based on your interests and prior visits to this and other websites. You can opt out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" className="text-orange-600 hover:underline" target="_blank" rel="noopener">Google Ad Settings</a>.</p>
        </section>
        <section>
          <h2 className="font-serif text-2xl font-bold text-black mb-3">4. Affiliate Links</h2>
          <p>This site contains affiliate links, primarily to Amazon. If you click these links and make a purchase, we may earn a commission at no extra cost to you.</p>
        </section>
        <section>
          <h2 className="font-serif text-2xl font-bold text-black mb-3">5. Data Storage</h2>
          <p>Your data is stored securely using Supabase, a cloud database provider. We take reasonable measures to protect your information from unauthorized access.</p>
        </section>
        <section>
          <h2 className="font-serif text-2xl font-bold text-black mb-3">6. Third-Party Services</h2>
          <p>We use the following third-party services that may collect data:</p>
          <ul className="list-disc pl-6 mt-3 space-y-2">
            <li><strong>Google AdSense</strong> — advertising</li>
            <li><strong>Google OAuth</strong> — sign-in</li>
            <li><strong>Groq AI</strong> — AI content generation</li>
            <li><strong>Supabase</strong> — database and authentication</li>
            <li><strong>Brevo (Sendinblue)</strong> — email newsletter</li>
          </ul>
        </section>
        <section>
          <h2 className="font-serif text-2xl font-bold text-black mb-3">7. Your Rights</h2>
          <p>You have the right to access, correct, or delete your personal data. To request deletion of your account and data, contact us at thoughtofview@gmail.com.</p>
        </section>
        <section>
          <h2 className="font-serif text-2xl font-bold text-black mb-3">8. Contact</h2>
          <p>If you have questions about this privacy policy, please <a href="/contact" className="text-orange-600 hover:underline">contact us</a>.</p>
        </section>
      </div>
    </div>
  )
}
