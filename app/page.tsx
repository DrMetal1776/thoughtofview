'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'

const ANGLES = ['Hot Take', 'Balanced', "Devil's Advocate", 'Contrarian', 'Expert Analysis']
const ANGLE_ICONS: Record<string, string> = {
  'Hot Take': '🔥',
  'Balanced': '⚖️',
  "Devil's Advocate": '😈',
  'Contrarian': '↩️',
  'Expert Analysis': '🎓',
}

export default function Home() {
  const [topic, setTopic] = useState('')
  const [angle, setAngle] = useState('Hot Take')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{ headline: string; body: string } | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [shared, setShared] = useState(false)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
    supabase.auth.onAuthStateChange((_e, session) => setUser(session?.user ?? null))
  }, [])

  const generate = async () => {
    if (!topic.trim()) return
    setLoading(true)
    setResult(null)
    setShared(false)
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, angle, userId: user?.id }),
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
      {/* Hero */}
      <div className="max-w-6xl mx-auto px-4 pt-16 pb-8">
        <p className="text-xs font-sans uppercase tracking-widest text-brand-muted mb-4">
          AI Opinion Engine
        </p>
        <h1 className="font-serif text-5xl md:text-7xl font-bold leading-tight mb-6 max-w-3xl">
          What's the real take on anything?
        </h1>
        <p className="text-lg text-brand-muted max-w-xl">
          Enter any topic and get an instant, sharp AI perspective — hot take, balanced analysis, devil's advocate, or contrarian view.
        </p>
      </div>

      {/* Generator */}
      <div className="max-w-6xl mx-auto px-4 pb-16">
        <div className="bg-[#1A1A1A] rounded-2xl p-6 md:p-8">
          {/* Input */}
          <p className="text-xs font-sans uppercase tracking-widest text-[#888] mb-3">
            Enter a topic, question, or debate
          </p>
          <div className="flex gap-3 mb-6">
            <input
              value={topic}
              onChange={e => setTopic(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && generate()}
              placeholder="e.g. remote work, AI, crypto, democracy..."
              className="flex-1 bg-[#2A2A2A] text-white rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-brand-orange placeholder:text-[#555]"
            />
            <button
              onClick={generate}
              disabled={loading || !topic.trim()}
              className="bg-brand-orange text-white font-semibold px-6 py-3 rounded-xl hover:bg-orange-700 transition-colors disabled:opacity-50 whitespace-nowrap"
            >
              {loading ? 'Thinking...' : 'Get the Take →'}
            </button>
          </div>

          {/* Angle selector */}
          <p className="text-xs font-sans uppercase tracking-widest text-[#888] mb-3">
            Choose your angle
          </p>
          <div className="flex flex-wrap gap-2 mb-6">
            {ANGLES.map(a => (
              <button
                key={a}
                onClick={() => setAngle(a)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  angle === a
                    ? 'bg-brand-orange text-white'
                    : 'bg-[#2A2A2A] text-[#ccc] hover:bg-[#333]'
                }`}
              >
                {ANGLE_ICONS[a]} {a}
              </button>
            ))}
          </div>

          {/* Result */}
          {loading && (
            <div className="border-l-2 border-brand-orange pl-4 py-2">
              <div className="h-4 bg-[#2A2A2A] rounded animate-pulse mb-3 w-2/3" />
              <div className="h-3 bg-[#2A2A2A] rounded animate-pulse mb-2" />
              <div className="h-3 bg-[#2A2A2A] rounded animate-pulse mb-2 w-4/5" />
              <div className="h-3 bg-[#2A2A2A] rounded animate-pulse w-3/5" />
            </div>
          )}

          {result && !loading && (
            <div className="border-l-2 border-brand-orange pl-4">
              <div className="flex gap-2 mb-3">
                <span className="text-xs bg-[#2A2A2A] text-[#888] px-3 py-1 rounded-full uppercase tracking-wider">
                  {topic}
                </span>
                <span className="text-xs bg-brand-orange text-white px-3 py-1 rounded-full uppercase tracking-wider">
                  {angle}
                </span>
              </div>
              <h2 className="text-white font-serif text-2xl font-bold mb-3">{result.headline}</h2>
              <div className="text-[#ccc] text-sm leading-relaxed whitespace-pre-wrap mb-4">{result.body}</div>

              {shared && (
                <p className="text-xs text-brand-orange mb-3">✓ Saved to public feed</p>
              )}

              <div className="flex gap-2 flex-wrap">
                <a
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs border border-[#444] text-[#ccc] px-4 py-2 rounded-full hover:border-[#888] transition-colors"
                >
                  Share on X
                </a>
                <button
                  onClick={() => navigator.clipboard.writeText(shareText)}
                  className="text-xs border border-[#444] text-[#ccc] px-4 py-2 rounded-full hover:border-[#888] transition-colors"
                >
                  Copy
                </button>
                {!user && (
                  <button
                    onClick={() => supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: window.location.origin } })}
                    className="text-xs border border-brand-orange text-brand-orange px-4 py-2 rounded-full hover:bg-brand-orange hover:text-white transition-colors"
                  >
                    Sign in to save & share →
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
