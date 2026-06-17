'use client'
export default function OpinionBotSuccess() {
  return (
    <div className="min-h-screen bg-[#F0EDE6] flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center">
        <div className="text-6xl mb-6">🤖</div>
        <h1 className="font-serif text-4xl font-bold mb-4">OpinionBot is yours!</h1>
        <p className="text-gray-600 mb-8">
          Thank you for your purchase! Click the button below to download your OpinionBot HTML file. Open it in any browser or embed it on your website.
        </p>
        
          href="/opinionbot.html"
          download="opinionbot.html"
          className="inline-block bg-brand-orange text-white font-bold text-lg px-10 py-4 rounded-xl hover:bg-orange-700 transition-colors mb-6"
        >
          Download OpinionBot
        </a>
        <p className="text-xs text-gray-400 mb-8">
          A single HTML file — open in any browser or drop into your website.
        </p>
        <a href="/" className="text-sm text-brand-orange hover:underline">
          ← Back to Thought of View
        </a>
      </div>
    </div>
  )
}
