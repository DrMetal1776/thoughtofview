'use client'
export default function OpinionBotSuccess() {
  return (
    <div className="min-h-screen bg-[#F0EDE6] flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center">
        <div className="text-6xl mb-6">🤖</div>
        <h1 className="font-serif text-4xl font-bold mb-4">OpinionBot is yours!</h1>
        <p className="text-gray-600 mb-8">Thank you for your purchase! Download the version for your computer below.</p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
          <a
            href="https://github.com/DrMetal1776/opinionbot-desktop/releases/download/v1.0.0/OpinionBot-Windows.zip"
            className="inline-block bg-brand-orange text-white font-bold text-lg px-8 py-4 rounded-xl hover:bg-orange-700 transition-colors"
          >
            Download for Windows
          </a>
          <a
            href="https://github.com/DrMetal1776/opinionbot-desktop/releases/download/v1.0.0/OpinionBot-Mac.zip"
            className="inline-block bg-[#1a1a1a] text-white font-bold text-lg px-8 py-4 rounded-xl hover:bg-black transition-colors"
          >
            Download for Mac
          </a>
        </div>

        <p className="text-xs text-gray-400 mt-4 mb-8">
          Windows: extract the zip and run the installer.<br />
          Mac: extract the zip and open the .dmg file.
        </p>

        <a href="/" className="text-sm text-brand-orange hover:underline">Back to Thought of View</a>
      </div>
    </div>
  )
}
