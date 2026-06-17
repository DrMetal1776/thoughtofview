'use client'
import { Suspense } from 'react'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useSearchParams } from 'next/navigation'
import type { User } from '@supabase/supabase-js'

function PremiumContent() {
  const [user, setUser] = useState<User | null>(null)
  const [isPremium, setIsPremium] = useState(false)
  const [loading, setLoading] = useState(false)
  const searchParams = useSearchParams()
  const success = searchParams.get('success')
  const canceled = searchParams.get('canceled')

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
      if (data.user) checkPremium(data.user.id)
    })
  }, [])

  const checkPremium = async (userId: string) => {
    const { data } = await supabase
      .from('subscriptions')
      .select('status')
      .eq('user_id', userId)
      .single()
    setIsPremium(data?.status === 'active')
  }

  const handleUpgrade = async () => {
    if (!user) {
      supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: window.location.origin + '/auth/callback?next=/premium' } })
      return
    }
    setLoading(true)
    const res = await fetch('/api/create-checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: user.id, email: user.email }),
    })
    const { url } = await res.json()
    window.location.href = url
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      {success && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-8 text-center">
          <p className="text-green-800 font-semibold">Welcome to Premium! Your subscription is now active.</p>
        </div>
      )}
      {canceled && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-8 text-center">
          <p className="text-yellow-800">No worries - you can upgrade anytime.</p>
        </div>
      )}
      <div className="text-center mb-12">
        <h1 className="font-serif text-5xl font-bold mb-4">Upgrade to Premium</h1>
        <p className="text-xl text-gray-600 max-w-xl mx-auto">
          Unlock unlimited AI takes, remove ads, and support the platform.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl p-8 border border-gray-200">
          <h2 className="font-serif text-2xl font-bold mb-2">Free</h2>
          <div className="text-4xl font-bold mb-6">$0<span className="text-lg font-normal text-gray-400">/mo</span></div>
          <ul className="space-y-3 mb-8">
            {['5 takes per day','All 5 angles','Public feed access','Upvoting & comments','Ads displayed'].map(f => (
              <li key={f} className="flex items-center gap-2 text-sm text-gray-600">
                <span className="text-gray-400">+</span> {f}
              </li>
            ))}
          </ul>
          <div className="w-full py-3 rounded-xl border border-gray-200 text-center text-sm font-medium text-gray-500">
            Current plan
          </div>
        </div>
        <div className="bg-[#1A1A1A] rounded-2xl p-8 border border-brand-orange relative overflow-hidden">
          <div className="absolute top-4 right-4 bg-brand-orange text-white text-xs font-bold px-3 py-1 rounded-full">
            POPULAR
          </div>
          <h2 className="font-serif text-2xl font-bold text-white mb-2">Premium</h2>
          <div className="text-4xl font-bold text-white mb-6">$5<span className="text-lg font-normal text-gray-400">/mo</span></div>
          <ul className="space-y-3 mb-8">
            {['Unlimited takes','All 5 angles','No ads','Priority generation','Public feed access','Upvoting & comments','Support the platform'].map(f => (
              <li key={f} className="flex items-center gap-2 text-sm text-gray-300">
                <span className="text-brand-orange">+</span> {f}
              </li>
            ))}
          </ul>
          {isPremium ? (
            <div className="w-full py-3 rounded-xl bg-green-600 text-white text-center text-sm font-bold">
              You are Premium!
            </div>
          ) : (
            <button
              onClick={handleUpgrade}
              disabled={loading}
              className="w-full py-3 rounded-xl bg-brand-orange text-white font-bold hover:bg-orange-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Redirecting...' : user ? 'Upgrade Now' : 'Sign in to Upgrade'}
            </button>
          )}
        </div>
      </div>
      <p className="text-center text-xs text-gray-400 mt-8">
        Secure payments via Stripe. Cancel anytime. No hidden fees.
      </p>
    </div>
  )
}

export default function PremiumPage() {
  return (
    <Suspense fallback={<div className="flex justify-center py-16">Loading...</div>}>
      <PremiumContent />
    </Suspense>
  )
}
