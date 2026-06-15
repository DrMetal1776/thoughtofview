'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import type { User } from '@supabase/supabase-js'

type Take = {
  id: string
  topic: string
  angle: string
  headline: string
  body: string
  created_at: string
  upvotes: number
}

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null)
  const [takes, setTakes] = useState<Take[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) { router.push('/'); return }
      setUser(data.user)
      fetchMyTakes(data.user.id)
    })
  }, [])

  const fetchMyTakes = async (userId: string) => {
    const { data } = await supabase
      .from('takes')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    setTakes(data || [])
    setLoading(false)
  }

  const deleteTake = async (id: string) => {
    await supabase.from('takes').delete().eq('id', id)
    setTakes(takes.filter(t => t.id !== id))
  }

  if (!user) return null

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="font-serif text-4xl font-bold mb-1">My Takes</h1>
        <p className="text-brand-muted">{user.email}</p>
      </div>

      {loading && <p className="text-brand-muted">Loading...</p>}

      {!loading && takes.length === 0 && (
        <div className="text-center py-20 text-brand-muted">
          <p className="text-lg mb-2">No takes yet.</p>
          <p className="text-sm">Generate one on the home page!</p>
        </div>
      )}

      <div className="space-y-4">
        {takes.map(take => (
          <div key={take.id} className="bg-white rounded-xl p-6 border border-black/5">
            <div className="flex gap-2 mb-3">
              <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full uppercase tracking-wider">
                {take.topic}
              </span>
              <span className="text-xs bg-brand-orange text-white px-3 py-1 rounded-full uppercase tracking-wider">
                {take.angle}
              </span>
            </div>
            <h2 className="font-serif text-xl font-bold mb-2">{take.headline}</h2>
            <p className="text-sm text-gray-600 leading-relaxed mb-4 line-clamp-3">{take.body}</p>
            <div className="flex items-center justify-between">
              <span className="text-sm text-brand-muted">▲ {take.upvotes || 0} upvotes</span>
              <button
                onClick={() => deleteTake(take.id)}
                className="text-xs text-red-400 hover:text-red-600 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
