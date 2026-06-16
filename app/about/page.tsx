export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="font-serif text-5xl font-bold mb-6">About Thought of View</h1>
      <div className="prose prose-lg space-y-6 text-gray-700 leading-relaxed">
        <p className="text-xl text-gray-600">
          Thought of View is an AI-powered opinion engine that gives you instant, sharp perspectives on any topic — from politics and technology to culture and finance.
        </p>
        <h2 className="font-serif text-2xl font-bold text-black mt-8">What We Do</h2>
        <p>
          We believe that understanding multiple perspectives on any issue makes you a sharper thinker, a better debater, and a more informed person. Whether you want a hot take, a balanced analysis, a devil's advocate argument, or a contrarian view — we generate it instantly using advanced AI.
        </p>
        <h2 className="font-serif text-2xl font-bold text-black mt-8">Why We Built This</h2>
        <p>
          In a world of echo chambers and algorithmic bubbles, it's harder than ever to encounter genuinely different perspectives. Thought of View was built to cut through the noise and give you direct, argued viewpoints you can engage with, debate, or use to sharpen your own thinking.
        </p>
        <h2 className="font-serif text-2xl font-bold text-black mt-8">The Community</h2>
        <p>
          Thought of View is more than a tool — it's a growing community of people who care about ideas. Sign in to save your takes, share them with the world, and see what perspectives others are generating. Upvote the sharpest takes and contribute to the public feed.
        </p>
        <h2 className="font-serif text-2xl font-bold text-black mt-8">About the Creator</h2>
        <p>
          Thought of View was created by a team of critical thinkers passionate about ideas, debate, and the intersection of technology and human thought. We built this platform to make sharp thinking accessible to everyone.
        </p>
        <h2 className="font-serif text-2xl font-bold text-black mt-8">A Note on AI Content</h2>
        <p>
          All perspectives generated on this site are produced by artificial intelligence and are intended for entertainment, education, and debate purposes. They do not represent the views of Thought of View or its creators. Always think critically and consult multiple sources when forming your own opinions.
        </p>
        <h2 className="font-serif text-2xl font-bold text-black mt-8">Affiliate Disclosure</h2>
        <p>
          This site contains affiliate links to products we recommend. If you purchase through these links, we may earn a small commission at no extra cost to you. This helps keep the site running and the AI takes flowing.
        </p>
        <div className="mt-10 p-6 bg-white rounded-xl border border-gray-200">
          <p className="font-semibold text-black mb-2">Get in touch</p>
          <p>Have a question, suggestion, or want to advertise? <a href="/contact" className="text-orange-600 hover:underline">Contact us here</a>.</p>
        </div>
      </div>
    </div>
  )
}
