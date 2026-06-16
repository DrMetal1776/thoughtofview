'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

const ANGLE_COLORS: Record<string, string> = {
  'Hot Take': 'bg-red-500',
  'Balanced': 'bg-blue-500',
  "Devil's Advocate": 'bg-purple-500',
  'Contrarian': 'bg-yellow-600',
  'Expert Analysis': 'bg-green-600',
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
    await supabase.from('takes').update({ upvotes: current + 1 }).eq('id', id)
    setTakes(takes.map(t => t.id === id ? { ...t, upvotes: current + 1 } : t))
  }

  const shareToX = (take: Take) => {
    const text = `${take.headline}\n\n${take.body.slice(0, 200)}...\n\nGet AI takes on anything at thoughtofview.com`
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, '_blank')
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="flex gap-8">
        <div className="flex-1 min-w-0">
          <h1 className="font-serif text-4xl font-bold mb-2">The Feed</h1>
          <p className="text-brand-muted mb-6">AI takes from the community — upvote the sharpest ones.</p>

          <div className="flex flex-wrap gap-3 mb-6">
            <div className="flex gap-2">
              <button onClick={() => setSortBy('new')}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${sortBy === 'new' ? 'bg-black text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`}>
                🆕 New
              </button>
              <button onClick={() => setSortBy('top')}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${sortBy === 'top' ? 'bg-black text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`}>
                🔥 Top
              </button>
            </div>
            <div className="flex gap-2 flex-wrap">
              {ANGLES.map(a => (
                <button key={a} onClick={() => setAngleFilter(a)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${angleFilter === a ? 'bg-brand-orange text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`}>
                  {a}
                </button>
              ))}
            </div>
          </div>

          {loading && (
            <div className="space-y-4">
              {[1,2,3].map(i => (
                <div key={i} className="bg-white rounded-xl p-6 animate-pulse">
                  <div className="h-4 bg-gray-200 rounded mb-3 w-1/3" />
                  <div className="h-6 bg-gray-200 rounded mb-2" />
                  <div className="h-4 bg-gray-200 rounded w-4/5" />
                </div>
              ))}
            </div>
          )}

          {!loading && takes.length === 0 && (
            <div className="text-center py-20 text-brand-muted">
              <p className="text-lg mb-2">No takes yet.</p>
              <p className="text-sm">Be the first — <Link href="/" className="text-brand-orange hover:underline">generate a take</Link> on the home page!</p>
            </div>
          )}

          <div className="space-y-4">
            {takes.map(take => (
              <div key={take.id} className="bg-white rounded-xl p-6 border border-black/5 hover:border-black/20 transition-colors">
                <div className="flex gap-2 mb-3">
                  <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full uppercase tracking-wider">{take.topic}</span>
                  <span className={`text-xs text-white px-3 py-1 rounded-full uppercase tracking-wider ${ANGLE_COLORS[take.angle] || 'bg-gray-500'}`}>{take.angle}</span>
                </div>
                <h2 className="font-serif text-xl font-bold mb-2">{take.headline}</h2>
                <p className={`text-sm text-gray-600 leading-relaxed mb-2 ${expandedId === take.id ? '' : 'line-clamp-3'}`}>{take.body}</p>
                <button onClick={() => setExpandedId(expandedId === take.id ? null : take.id)}
                  className="text-xs text-brand-orange mb-3 hover:underline">
                  {expandedId === take.id ? 'Show less' : 'Read more'}
                </button>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <button onClick={() => upvote(take.id, take.upvotes || 0)}
                      className="flex items-center gap-1.5 text-sm text-brand-muted hover:text-brand-orange transition-colors">
                      <span>▲</span><span>{take.upvotes || 0}</span>
                    </button>
                    <button onClick={() => shareToX(take)}
                      className="text-xs text-brand-muted hover:text-black transition-colors">
                      Share on X
                    </button>
                  </div>
                  <span className="text-xs text-gray-400">{new Date(take.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="w-64 shrink-0 hidden lg:block">
          <div className="bg-white rounded-xl p-5 border border-black/5 sticky top-20">
            <h3 className="font-serif text-lg font-bold mb-4">🔥 Trending Topics</h3>
            {trending.length === 0 && <p className="text-sm text-brand-muted">No trending topics yet.</p>}
            <div className="space-y-2">
              {trending.map(({ topic, count }) => (
                <div key={topic} className="flex items-center justify-between">
                  <span className="text-sm font-medium capitalize">{topic}</span>
                  <span className="text-xs text-brand-muted">{count} takes</span>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-4 border-t border-black/5">
              <Link href="/" className="block w-full bg-brand-orange text-white text-sm font-medium px-4 py-2 rounded-lg text-center hover:bg-orange-700 transition-colors">
                + Generate a Take
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
