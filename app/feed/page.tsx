'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

const ANGLE_COLORS: Record<string, string> = {
  'Hot Take': 'bg-red-500',
  'Balanced': 'bg-blue-500',
  "Devil's Advocate": 'bg-purple-500',
  'Contrarian': 'bg-yellow-500',
  'Expert Analysis': 'bg-green-500',
}

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

export default function FeedPage() {
  const [takes, setTakes] = useState<Take[]>([])
  const [loading, setLoading] = useState(true)
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUserId(data.user?.id ?? null))
    fetchTakes()
  }, [])

  const fetchTakes = async () => {
    const { data } = await supabase
      .from('takes')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50)
    setTakes(data || [])
    setLoading(false)
  }

  const upvote = async (id: string, current: number) => {
    await supabase.from('takes').update({ upvotes: current + 1 }).eq('id', id)
    setTakes(takes.map(t => t.id === id ? { ...t, upvotes: current + 1 } : t))
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="font-serif text-4xl font-bold mb-2">The Feed</h1>
      <p className="text-brand-muted mb-8">AI takes from the community — upvote the sharpest ones.</p>

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
          <p className="text-sm">Be the first — sign in and generate a take on the home page!</p>
        </div>
      )}

      <div className="space-y-4">
        {takes.map(take => (
          <div key={take.id} className="bg-white rounded-xl p-6 border border-black/5 hover:border-black/20 transition-colors">
            <div className="flex gap-2 mb-3">
              <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full uppercase tracking-wider">
                {take.topic}
              </span>
              <span className={`text-xs text-white px-3 py-1 rounded-full uppercase tracking-wider ${ANGLE_COLORS[take.angle] || 'bg-gray-500'}`}>
                {take.angle}
              </span>
            </div>
            <h2 className="font-serif text-xl font-bold mb-2">{take.headline}</h2>
            <p className="text-sm text-gray-600 leading-relaxed mb-4 line-clamp-3">{take.body}</p>
            <div className="flex items-center justify-between">
              <button
                onClick={() => upvote(take.id, take.upvotes || 0)}
                className="flex items-center gap-2 text-sm text-brand-muted hover:text-brand-orange transition-colors"
              >
                <span>▲</span>
                <span>{take.upvotes || 0}</span>
              </button>
              <span className="text-xs text-gray-400">
                {new Date(take.created_at).toLocaleDateString()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
