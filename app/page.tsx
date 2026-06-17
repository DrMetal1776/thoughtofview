'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import Script from 'next/script'
import type { User } from '@supabase/supabase-js'

const ANGLES = ['Hot Take', 'Balanced', "Devil's Advocate", 'Contrarian', 'Expert Analysis']
const ANGLE_ICONS: Record<string, string> = {
  'Hot Take': '🔥',
  'Balanced': '⚖️',
  "Devil's Advocate": '😈',
  'Contrarian': '↩️',
  'Expert Analysis': '🎓',
}

const TRENDING_TOPICS = [
  'AI & Jobs', 'Bitcoin', 'Remote Work', 'Social Media', 'UBI',
  'College Degrees', 'Cancel Culture', 'Climate Change', '4-Day Week', 'Crypto'
]

const BOOKS = [
  { tag: 'Critical Thinking', title: 'Thinking, Fast and Slow', desc: "Kahneman's masterwork on how we form opinions and where we go wrong.", link: 'https://www.amazon.com/dp/0374533555?tag=drmetal1776-20' },
  { tag: 'Arguing Better', title: 'Thank You for Arguing', desc: 'The definitive guide to rhetoric, persuasion, and winning any debate.', link: 'https://www.amazon.com/dp/0307455998?tag=drmetal1776-20' },
  { tag: 'Big Ideas', title: 'The Scout Mindset', desc: 'Why seeking truth over being right leads to better thinking and decisions.', link: 'https://www.amazon.com/dp/0735217556?tag=drmetal1776-20' },
  { tag: 'Contrarian Lens', title: 'Zero to One', desc: "Thiel's contrarian manifesto on building the future by thinking differently.", link: 'https://www.amazon.com/dp/0804139296?tag=drmetal1776-20' },
]

const TOOLS = [
  { tag: 'AI Writing', title: 'Claude Pro', desc: 'Upgrade for unlimited takes, longer responses, and research.', link: 'https://claude.ai', cta: 'Try Claude Pro →' },
  { tag: 'Research', title: 'Audible', desc: 'Listen to the books above and thousands more. First month free.', link: 'https://www.audible.com', cta: 'Try Free →' },
  { tag: 'Note-Taking', title: 'Notion', desc: 'Capture and organise your best takes, arguments, and research.', link: 'https://www.notion.so', cta: 'Get Notion →' },
]

export default function Home() {
  const [topic, setTopic] = useState('')
  const [angle, setAngle] = useState('Hot Take')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{ headline: string; body: string } | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [shared, setShared] = useState(false)
  const [email, setEmail] = useState('')

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
    supabase.auth.onAuthStateChange((_e, session) => setUser(session?.user ?? null))
  }, [])

  const generate = async (topicOverride?: string) => {
    const t = topicOverride || topic
    if (!t.trim()) return
    if (topicOverride) setTopic(topicOverride)
    setLoading(true)
    setResult(null)
    setShared(false)
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: t, angle, userId: user?.id }),
      })
      const data = await res.json()
      setResult(data)
      if (user?.id) setShared(true)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const shareText = result
    ? `${result.headline}\n\n${result.body.slice(0, 200)}...\n\nGet AI takes on anything at thoughtofview.com`
    : ''

  return (
    <div className="min-h-screen bg-[#F0EDE6]">
      {/* AdSense Script */}
      <Script
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9438165116015593"
        crossOrigin="anonymous"
        strategy="afterInteractive"
      />

      {/* Announcement bar */}
      <div className="bg-[#1A1A1A] text-[#F0EDE6] text-xs text-center py-2 px-4 tracking-wide">
        🔥 Get Hot Takes, Contrarian Views, or Devil's Advocate perspectives on any topic — instantly.
      </div>

      {/* Hero */}
      <div className="max-w-6xl mx-auto px-4 pt-10 pb-4">
        <p className="text-xs font-sans uppercase tracking-widest text-brand-muted mb-4">AI Opinion Engine</p>
        <h1 className="font-serif text-5xl md:text-7xl font-bold leading-tight mb-6 max-w-3xl">
          What's the real take on anything?
        </h1>
        <p className="text-lg text-brand-muted max-w-xl mb-8">
          Enter any topic and get an instant, sharp AI perspective — hot take, balanced analysis, devil's advocate, or contrarian view.
        </p>
      </div>

      {/* Generator */}
      <div className="max-w-6xl mx-auto px-4 pb-10">
        <div className="bg-[#1A1A1A] rounded-2xl p-6 md:p-8">
          <p className="text-xs font-sans uppercase tracking-widest text-[#888] mb-3">Enter a topic, question, or debate</p>
          <div className="flex gap-3 mb-6">
            <input
              value={topic}
              onChange={e => setTopic(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && generate()}
              placeholder="e.g. remote work, AI, crypto, democracy..."
              className="flex-1 bg-[#2A2A2A] text-white rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-brand-orange placeholder:text-[#555]"
            />
            <button
              onClick={() => generate()}
              disabled={loading || !topic.trim()}
              className="bg-brand-orange text-white font-semibold px-6 py-3 rounded-xl hover:bg-orange-700 transition-colors disabled:opacity-50 whitespace-nowrap"
            >
              {loading ? 'Thinking...' : 'Get the Take →'}
            </button>
          </div>
          <p className="text-xs font-sans uppercase tracking-widest text-[#888] mb-3">Choose your angle</p>
          <div className="flex flex-wrap gap-2 mb-6">
            {ANGLES.map(a => (
              <button key={a} onClick={() => setAngle(a)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${angle === a ? 'bg-brand-orange text-white' : 'bg-[#2A2A2A] text-[#ccc] hover:bg-[#333]'}`}>
                {ANGLE_ICONS[a]} {a}
              </button>
            ))}
          </div>

          {loading && (
            <div className="border-l-2 border-brand-orange pl-4 py-2">
              <div className="h-4 bg-[#2A2A2A] rounded animate-pulse mb-3 w-2/3" />
              <div className="h-3 bg-[#2A2A2A] rounded animate-pulse mb-2" />
              <div className="h-3 bg-[#2A2A2A] rounded animate-pulse mb-2 w-4/5" />
            </div>
          )}

          {result && !loading && (
            <div className="border-l-2 border-brand-orange pl-4">
              <div className="flex gap-2 mb-3">
                <span className="text-xs bg-[#2A2A2A] text-[#888] px-3 py-1 rounded-full uppercase tracking-wider">{topic}</span>
                <span className="text-xs bg-brand-orange text-white px-3 py-1 rounded-full uppercase tracking-wider">{angle}</span>
              </div>
              <h2 className="text-white font-serif text-2xl font-bold mb-3">{result.headline}</h2>
              <div className="text-[#ccc] text-sm leading-relaxed whitespace-pre-wrap mb-4">{result.body}</div>
              {shared && <p className="text-xs text-brand-orange mb-3">✓ Saved to public feed</p>}
              <div className="flex gap-2 flex-wrap">
                <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`} target="_blank" rel="noopener noreferrer"
                  className="text-xs border border-[#444] text-[#ccc] px-4 py-2 rounded-full hover:border-[#888] transition-colors">
                  Share on X
                </a>
                <button onClick={() => navigator.clipboard.writeText(shareText)}
                  className="text-xs border border-[#444] text-[#ccc] px-4 py-2 rounded-full hover:border-[#888] transition-colors">
                  Copy
                </button>
                {!user && (
                  <button onClick={() => supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: window.location.origin } })}
                    className="text-xs border border-brand-orange text-brand-orange px-4 py-2 rounded-full hover:bg-brand-orange hover:text-white transition-colors">
                    Sign in to save & share →
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 pb-16 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-10">

          {/* Trending Topics */}
          <section>
            <h2 className="font-serif text-2xl font-bold border-b-2 border-black pb-2 mb-4">Trending Topics</h2>
            <div className="flex flex-wrap gap-2">
              {TRENDING_TOPICS.map(t => (
                <button key={t} onClick={() => generate(t)}
                  className="px-4 py-2 text-sm font-semibold border border-gray-300 rounded-full bg-white hover:bg-[#1A1A1A] hover:text-white hover:border-[#1A1A1A] transition-colors">
                  {t}
                </button>
              ))}
            </div>
          </section>

          {/* What You Get */}
          <section>
            <h2 className="font-serif text-2xl font-bold border-b-2 border-black pb-2 mb-4">What You Get</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { icon: '🎯', title: 'Sharp Opinions', desc: "No wishy-washy both-sides fluff. Get a real, argued perspective you can agree with, debate, or steal for your next conversation." },
                { icon: '⚡', title: 'Instant Takes', desc: "Skip the 3,000-word think-pieces. Get the core argument in under 30 seconds, ready to share or spark a debate." },
                { icon: '🔄', title: 'Multiple Angles', desc: "Flip between Hot Take, Balanced, Devil's Advocate, and Contrarian. Same topic, totally different perspective." },
                { icon: '🧠', title: 'Genuinely Useful', desc: "Use takes to prep for debates, write essays, kick off conversations, or just understand all sides of an issue." },
              ].map(f => (
                <div key={f.title} className="bg-white border border-gray-200 rounded-xl p-5">
                  <div className="text-2xl mb-2">{f.icon}</div>
                  <h3 className="font-serif font-bold text-lg mb-1">{f.title}</h3>
                  <p className="text-sm text-gray-500">{f.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Recommended Reads */}
          <section>
            <h2 className="font-serif text-2xl font-bold border-b-2 border-black pb-2 mb-1">Recommended Reads</h2>
            <p className="text-xs text-gray-400 mb-4">Books that'll sharpen your thinking. <em>(Affiliate links — we may earn a commission.)</em></p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {BOOKS.map(b => (
                <div key={b.title} className="bg-white border border-gray-200 rounded-xl p-5 flex flex-col gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-yellow-600">{b.tag}</span>
                  <h4 className="font-serif font-bold text-lg leading-tight">{b.title}</h4>
                  <p className="text-xs text-gray-500 flex-1">{b.desc}</p>
                  <a href={b.link} target="_blank" rel="noopener sponsored"
                    className="text-xs font-bold uppercase tracking-wider text-brand-orange hover:underline">
                    View on Amazon →
                  </a>
                </div>
              ))}
            </div>
          </section>

          {/* Tools */}
          <section>
            <h2 className="font-serif text-2xl font-bold border-b-2 border-black pb-2 mb-1">Tools for Deep Thinkers</h2>
            <p className="text-xs text-gray-400 mb-4"><em>(Affiliate partnerships — we may earn a commission at no extra cost to you.)</em></p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {TOOLS.map(t => (
                <div key={t.title} className="bg-white border border-gray-200 rounded-xl p-5 flex flex-col gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-yellow-600">{t.tag}</span>
                  <h4 className="font-serif font-bold text-lg leading-tight">{t.title}</h4>
                  <p className="text-xs text-gray-500 flex-1">{t.desc}</p>
                  <a href={t.link} target="_blank" rel="noopener sponsored"
                    className="text-xs font-bold uppercase tracking-wider text-brand-orange hover:underline">
                    {t.cta}
                  </a>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Sidebar ad 300x250 */}

          {/* Newsletter */}
          <div className="bg-[#1c1a16] rounded-xl p-5">
            <h3 className="font-serif text-lg font-bold text-[#f0ede6] mb-1">Daily Takes — Free</h3>
            <p className="text-xs text-[#b0ac9f] mb-4">Get 3 sharp AI perspectives on today's biggest topics. No fluff, no spam.</p>
            <form action="https://dc090f69.sibforms.com/serve/MUIFAJgWdUk-T8_WFwc7NtbcuIW5Y3wZKv7LUr6qcOf5S2yCVf4IbBcGOUEPjtQqPW32qkJLcwQK_wjuYTRAaYAcAbXt8pCjZNS20EgCyx4vrWSuRxrGl-7nARl48iWf3WfikOKMA4k3qeRJ_oCNCDobsawb9tGQE-EKz5mHsOsKbPxAOCEAuin9I_KvKXekjGlOPH1iFFx4n1qhYg==" method="POST">
              <input type="email" name="EMAIL" placeholder="your@email.com" required
                className="w-full px-3 py-2 text-sm rounded-lg bg-[#2a2824] text-[#f0ede6] border border-[#444] mb-2 outline-none focus:border-brand-orange" />
              <button type="submit"
                className="w-full py-2 text-sm font-bold uppercase tracking-wider bg-yellow-400 text-[#1a1500] rounded-lg hover:bg-yellow-300 transition-colors">
                Subscribe Free
              </button>
              <p className="text-xs text-[#666] mt-2">Unsubscribe anytime. We don't sell your data.</p>
              <input type="hidden" name="locale" value="en" />
              <input type="hidden" name="html_type" value="simple" />
            </form>
          </div>

          {/* Popular Takes */}
          <div className="bg-white rounded-xl p-5 border border-gray-100">
            <h3 className="font-serif text-lg font-bold border-b-2 border-black pb-2 mb-4">Popular Takes</h3>
            <ul className="space-y-3">
              {[
                'AI will replace most creative jobs by 2030',
                'Social media is making us measurably dumber',
                'Remote work wins on productivity — the data is in',
                'Bitcoin will hit $1M. Here\'s why skeptics are wrong.',
                'College degrees are no longer worth the cost',
              ].map((title, i) => (
                <li key={i} className="flex gap-3 cursor-pointer group" onClick={() => generate(title)}>
                  <span className="text-xs font-bold text-gray-300 mt-0.5 shrink-0">0{i+1}</span>
                  <span className="text-sm font-medium group-hover:text-brand-orange transition-colors">{title}</span>
                </li>
              ))}
            </ul>
          </div>

      {/* Footer */}
      <footer className="border-t border-gray-300 bg-[#F0EDE6] py-8 px-4 text-center">
        <a href="/" className="font-serif text-2xl font-bold mb-4 inline-block">Thought<span className="text-brand-orange">of</span>View</a>
        <div className="flex justify-center gap-6 text-xs text-gray-500 mb-4 flex-wrap">
          <a href="/about" className="hover:text-black">About</a>
          <a href="/privacy" className="hover:text-black">Privacy Policy</a>
          <a href="/terms" className="hover:text-black">Terms of Use</a>
          <a href="/contact" className="hover:text-black">Contact</a>
          <a href="/advertise" className="hover:text-black">Advertise</a>
        </div>
        <p className="text-xs text-gray-400">
          © 2025 ThoughtofView.com · AI-generated content for entertainment and informational purposes.<br />
          This site contains affiliate links and advertising. <a href="/disclosure" className="underline">Disclosure</a>.
        </p>
      </footer>

      {/* Cookie banner */}
      <div id="cookie-banner" className="fixed bottom-0 left-0 right-0 bg-[#1A1A1A] text-white text-sm px-4 py-3 flex items-center justify-between gap-4 z-50">
        <p>We use cookies for ads and analytics. <a href="/privacy" className="underline text-yellow-400">Learn more</a>.</p>
        <button onClick={() => { document.getElementById('cookie-banner')!.style.display='none'; localStorage.setItem('cookies_ok','1') }}
          className="bg-brand-orange text-white text-xs font-bold px-4 py-2 rounded-full whitespace-nowrap">
          Accept & Continue
        </button>
      </div>
    </div>
  )
}
