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
  const [isPremium, setIsPremium] = useState(false)
  const [canceling, setCanceling] = useState(false)
  const [canceled, setCanceled] = useState(false)
  const router = useRouter()

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) { router.push('/'); return }
      setUser(data.user)
      fetchMyTakes(data.user.id)
      checkPremium(data.user.id)
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

  const checkPremium = async (userId: string) => {
    const { data } = await supabase
      .from('subscriptions')
      .select('status')
      .eq('user_id', userId)
      .single()
    setIsPremium(data?.status === 'active')
  }

  const deleteTake = async (id: string) => {
    await supabase.from('takes').delete().eq('id', id)
    setTakes(takes.filter(t => t.id !== id))
  }

  const cancelSubscription = async () => {
    if (!user) return
    const confirmed = window.confirm('Are you sure you want to cancel your Premium subscription? You will lose access at the end of your billing period.')
    if (!confirmed) return
    setCanceling(true)
    try {
      const res = await fetch('/api/cancel-subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id }),
      })
      if (res.ok) {
        setIsPremium(false)
        setCanceled(true)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setCanceling(false)
    }
  }

  if (!user) return null

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="font-serif text-4xl font-bold mb-1">My Profile</h1>
        <p className="text-brand-muted">{user.email}</p>
      </div>

      {/* Subscription section */}
      <div className="bg-white rounded-xl p-6 border border-black/5 mb-8">
        <h2 className="font-serif text-2xl font-bold mb-4">Subscription</h2>
        {isPremium ? (
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="bg-brand-orange text-white text-xs font-bold px-3 py-1 rounded-full">PRO</span>
              <span className="text-sm text-gray-600">You're on the Premium plan — unlimited takes, no ads.</span>
            </div>
            {canceled ? (
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                <p className="text-yellow-800 text-sm font-semibold">Your subscription has been canceled. You'll keep Premium access until the end of your billing period.</p>
              </div>
            ) : (
              <button
                onClick={cancelSubscription}
                disabled={canceling}
                className="text-sm text-red-400 hover:text-red-600 transition-colors disabled:opacity-50"
              >
                {canceling ? 'Canceling...' : 'Cancel subscription'}
              </button>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">You're on the Free plan.</p>
              <p className="text-xs text-brand-muted">5 takes per day.</p>
            </div>
            <a href="/premium" className="bg-brand-orange text-white text-sm px-4 py-2 rounded-full hover:bg-orange-700 transition-colors font-semibold">
              Upgrade to Premium →
            </a>
          </div>
        )}
      </div>

      {/* Takes section */}
      <h2 className="font-serif text-2xl font-bold mb-4">My Takes</h2>

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
