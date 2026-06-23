'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import Comments from '@/components/Comments'

const ANGLE_COLORS: Record<string, string> = {
  'Hot Take': 'bg-[#e85d3a]',
  'Balanced': 'bg-[#3a7bd5]',
  "Devil's Advocate": 'bg-[#7c3aed]',
  'Contrarian': 'bg-[#d97706]',
  'Expert Analysis': 'bg-[#059669]',
}

const ANGLE_ICONS: Record<string, string> = {
  'Hot Take': '🔥',
  'Balanced': '⚖️',
  "Devil's Advocate": '😈',
  'Contrarian': '↩️',
  'Expert Analysis': '🎓',
}

const ANGLES = ['All', 'Hot Take', 'Balanced', "Devil's Advocate", 'Contrarian', 'Expert Analysis']

type Take = {
  id: string
  topic: string
  angle: string
  headline: string
  body: string
  created_at: string
  upvotes: number
  user_id: string
}

type SortBy = 'new' | 'top'

export default function FeedClient() {
  const [takes, setTakes] = useState<Take[]>([])
  const [loading, setLoading] = useState(true)
  const [angleFilter, setAngleFilter] = useState('All')
  const [sortBy, setSortBy] = useState<SortBy>('new')
  const [trending, setTrending] = useState<{ topic: string; count: number }[]>([])
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [upvotedIds, setUpvotedIds] = useState<Set<string>>(new Set())
  const [showMobileTrending, setShowMobileTrending] = useState(false)

  useEffect(() => {
    // Load upvoted IDs from localStorage to prevent duplicate upvotes
    const stored = localStorage.getItem('upvoted_takes')
    if (stored) setUpvotedIds(new Set(JSON.parse(stored)))
  }, [])

  useEffect(() => {
    fetchTakes()
    fetchTrending()
  }, [sortBy, angleFilter])

  const fetchTakes = async () => {
    setLoading(true)
    let query = supabase.from('takes').select('*').limit(50)
    if (angleFilter !== 'All') query = query.eq('angle', angleFilter)
    if (sortBy === 'top') {
      query = query.order('upvotes', { ascending: false })
    } else {
      query = query.order('created_at', { ascending: false })
    }
    const { data } = await query
    setTakes(data || [])
    setLoading(false)
  }

  const fetchTrending = async () => {
    const { data } = await supabase
      .from('takes')
      .select('topic')
      .order('upvotes', { ascending: false })
      .limit(20)
    if (data) {
      const counts: Record<string, number> = {}
      data.forEach(t => { counts[t.topic] = (counts[t.topic] || 0) + 1 })
      const sorted = Object.entries(counts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 6)
        .map(([topic, count]) => ({ topic, count }))
      setTrending(sorted)
    }
  }

  const upvote = async (id: string, current: number) => {
    if (upvotedIds.has(id)) return
    await supabase.from('takes').update({ upvotes: current + 1 }).eq('id', id)
    setTakes(takes.map(t => t.id === id ? { ...t, upvotes: current + 1 } : t))
    const newSet = new Set(upvotedIds).add(id)
    setUpvotedIds(newSet)
    localStorage.setItem('upvoted_takes', JSON.stringify(Array.from(newSet)))
  }

  const shareToX = (take: Take) => {
    const text = `${take.headline}\n\n${take.body.slice(0, 200)}...\n\nGet AI takes on anything at thoughtofview.com`
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, '_blank')
  }

  const copyTake = (take: Take) => {
    const text = `${take.headline}\n\n${take.body}\n\n— thoughtofview.com`
    navigator.clipboard.writeText(text)
    setCopiedId(take.id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const filterByTopic = (topic: string) => {
    setAngleFilter('All')
    // Scroll to top of feed
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const timeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime()
    const mins = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)
    if (mins < 60) return `${mins}m ago`
    if (hours < 24) return `${hours}h ago`
    return `${days}d ago`
  }

  return (
    <div className="min-h-screen bg-[#F0EDE6]">
      {/* Page header */}
      <div className="bg-[#0d1117] border-b border-[#1a2a3a]">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <p className="text-xs font-sans uppercase tracking-widest text-[#4dd9c0] mb-2">Community</p>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-white mb-2">The Feed</h1>
          <p className="text-[#8b949e]">AI takes from the community — upvote and discuss the sharpest ones.</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Mobile trending toggle */}
        <div className="lg:hidden mb-4">
          <button
            onClick={() => setShowMobileTrending(!showMobileTrending)}
            className="w-full bg-white border border-black/10 rounded-xl px-4 py-3 text-sm font-medium flex items-center justify-between"
          >
            <span>🔥 Trending Topics</span>
            <span className="text-gray-400">{showMobileTrending ? '▲' : '▼'}</span>
          </button>
          {showMobileTrending && (
            <div className="bg-white border border-black/10 border-t-0 rounded-b-xl px-4 pb-4">
              <div className="flex flex-wrap gap-2 pt-3">
                {trending.map(({ topic, count }) => (
                  <button
                    key={topic}
                    onClick={() => { filterByTopic(topic); setShowMobileTrending(false) }}
                    className="px-3 py-1.5 bg-[#0d1117] text-white text-xs rounded-full font-medium hover:bg-[#1a2a3a] transition-colors"
                  >
                    {topic} <span className="text-[#4dd9c0] ml-1">{count}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-8">
          {/* Main feed */}
          <div className="flex-1 min-w-0">
            {/* Sort + Filter controls */}
            <div className="flex flex-wrap gap-3 mb-6">
              <div className="flex gap-2 bg-white rounded-full p-1 border border-black/10">
                <button onClick={() => setSortBy('new')}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${sortBy === 'new' ? 'bg-[#0d1117] text-white' : 'text-gray-600 hover:text-black'}`}>
                  🆕 New
                </button>
                <button onClick={() => setSortBy('top')}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${sortBy === 'top' ? 'bg-[#0d1117] text-white' : 'text-gray-600 hover:text-black'}`}>
                  🔥 Top
                </button>
              </div>
              <div className="flex gap-2 flex-wrap">
                {ANGLES.map(a => (
                  <button key={a} onClick={() => setAngleFilter(a)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors border ${
                      angleFilter === a
                        ? 'bg-[#e85d3a] text-white border-[#e85d3a]'
                        : 'bg-white text-gray-600 border-black/10 hover:border-black/30'
                    }`}>
                    {a !== 'All' && ANGLE_ICONS[a]} {a}
                  </button>
                ))}
              </div>
            </div>

            {/* Loading skeleton */}
            {loading && (
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="bg-white rounded-xl p-6 animate-pulse border border-black/5">
                    <div className="flex gap-2 mb-3">
                      <div className="h-5 bg-gray-100 rounded-full w-20" />
                      <div className="h-5 bg-gray-100 rounded-full w-24" />
                    </div>
                    <div className="h-6 bg-gray-100 rounded mb-2 w-3/4" />
                    <div className="h-4 bg-gray-100 rounded mb-1" />
                    <div className="h-4 bg-gray-100 rounded w-4/5" />
                  </div>
                ))}
              </div>
            )}

            {/* Empty state */}
            {!loading && takes.length === 0 && (
              <div className="text-center py-20 bg-white rounded-2xl border border-black/5">
                <div className="text-5xl mb-4">🤔</div>
                <p className="text-xl font-serif font-bold mb-2">No takes yet</p>
                <p className="text-sm text-gray-500 mb-6">
                  {angleFilter !== 'All' ? `No ${angleFilter} takes yet. Try a different filter.` : 'Be the first to share a take!'}
                </p>
                <Link href="/"
                  className="inline-block bg-[#e85d3a] text-white font-medium px-6 py-2.5 rounded-full text-sm hover:bg-orange-700 transition-colors">
                  Generate the first take →
                </Link>
              </div>
            )}

            {/* Takes */}
            <div className="space-y-4">
              {takes.map(take => (
                <div key={take.id} className="bg-white rounded-xl p-6 border border-black/5 hover:border-[#4dd9c0]/40 hover:shadow-sm transition-all">
                  {/* Tags */}
                  <div className="flex gap-2 mb-3 flex-wrap">
                    <span className="text-xs bg-[#0d1117] text-[#4dd9c0] px-3 py-1 rounded-full uppercase tracking-wider font-medium">
                      {take.topic}
                    </span>
                    <span className={`text-xs text-white px-3 py-1 rounded-full uppercase tracking-wider font-medium ${ANGLE_COLORS[take.angle] || 'bg-gray-500'}`}>
                      {ANGLE_ICONS[take.angle]} {take.angle}
                    </span>
                  </div>

                  {/* Headline */}
                  <h2 className="font-serif text-xl font-bold mb-2 leading-snug">{take.headline}</h2>

                  {/* Body */}
                  <p className={`text-sm text-gray-600 leading-relaxed mb-2 ${expandedId === take.id ? '' : 'line-clamp-3'}`}>
                    {take.body}
                  </p>
                  <button
                    onClick={() => setExpandedId(expandedId === take.id ? null : take.id)}
                    className="text-xs text-[#e85d3a] mb-4 hover:underline font-medium">
                    {expandedId === take.id ? 'Show less ▲' : 'Read more ▼'}
                  </button>

                  {/* Actions */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {/* Upvote */}
                      <button
                        onClick={() => upvote(take.id, take.upvotes || 0)}
                        disabled={upvotedIds.has(take.id)}
                        className={`flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-full border transition-all ${
                          upvotedIds.has(take.id)
                            ? 'bg-[#e85d3a] text-white border-[#e85d3a]'
                            : 'border-black/10 text-gray-600 hover:border-[#e85d3a] hover:text-[#e85d3a]'
                        }`}>
                        <span>▲</span>
                        <span>{take.upvotes || 0}</span>
                      </button>

                      {/* Share on X */}
                      <button
                        onClick={() => shareToX(take)}
                        className="text-xs text-gray-500 hover:text-black transition-colors font-medium">
                        Share on X
                      </button>

                      {/* Copy */}
                      <button
                        onClick={() => copyTake(take)}
                        className="text-xs text-gray-500 hover:text-black transition-colors font-medium">
                        {copiedId === take.id ? '✓ Copied!' : 'Copy'}
                      </button>
                    </div>

                    {/* Time */}
                    <span className="text-xs text-gray-400">{timeAgo(take.created_at)}</span>
                  </div>

                  <Comments takeId={take.id} />
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar — desktop only */}
          <div className="w-64 shrink-0 hidden lg:block">
            <div className="sticky top-20 space-y-4">
              {/* Trending */}
              <div className="bg-white rounded-xl p-5 border border-black/5">
                <h3 className="font-serif text-lg font-bold mb-4 flex items-center gap-2">
                  🔥 <span>Trending Topics</span>
                </h3>
                {trending.length === 0 && (
                  <p className="text-sm text-gray-400">No trending topics yet.</p>
                )}
                <div className="space-y-2">
                  {trending.map(({ topic, count }, i) => (
                    <button
                      key={topic}
                      onClick={() => filterByTopic(topic)}
                      className="w-full flex items-center justify-between group hover:bg-gray-50 rounded-lg px-2 py-1.5 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[#4dd9c0] w-4">{i + 1}</span>
                        <span className="text-sm font-medium capitalize group-hover:text-[#e85d3a] transition-colors">{topic}</span>
                      </div>
                      <span className="text-xs text-gray-400">{count} takes</span>
                    </button>
                  ))}
                </div>
                <div className="mt-5 pt-4 border-t border-black/5">
                  <Link href="/"
                    className="block w-full bg-[#0d1117] text-[#4dd9c0] text-sm font-bold px-4 py-2.5 rounded-lg text-center hover:bg-[#1a2a3a] transition-colors">
                    + Generate a Take
                  </Link>
                </div>
              </div>

              {/* OpinionBot upsell */}
              <div className="bg-[#0d1117] rounded-xl p-5 border border-[#1a2a3a]">
                <p className="text-xs font-bold uppercase tracking-widest text-[#e85d3a] mb-2">Desktop App</p>
                <h4 className="font-serif text-base font-bold text-white mb-2">Get OpinionBot 🤖</h4>
                <p className="text-xs text-[#8b949e] leading-relaxed mb-4">AI takes from your taskbar — no browser needed.</p>
                <Link href="/opinionbot"
                  className="block w-full bg-[#e85d3a] text-white text-xs font-bold px-4 py-2.5 rounded-lg text-center hover:bg-orange-700 transition-colors uppercase tracking-wider">
                  Get it — $4.99
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
