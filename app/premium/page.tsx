'use client'
import { Suspense } from 'react'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import type { User } from '@supabase/supabase-js'

const FREE_FEATURES = [
  { text: '5 takes per day', included: true },
  { text: 'All 5 angles', included: true },
  { text: 'Public feed access', included: true },
  { text: 'Upvoting & comments', included: true },
  { text: 'No ads', included: false },
  { text: 'Unlimited takes', included: false },
  { text: 'Priority generation', included: false },
]

const PREMIUM_FEATURES = [
  { text: 'Unlimited takes per day', included: true },
  { text: 'All 5 angles', included: true },
  { text: 'Public feed access', included: true },
  { text: 'Upvoting & comments', included: true },
  { text: 'No ads — ever', included: true },
  { text: 'Priority AI generation', included: true },
  { text: 'Support independent development', included: true },
]

const FAQS = [
  {
    q: 'What happens after I subscribe?',
    a: 'Your Premium status activates instantly. You\'ll get unlimited takes, no ads, and priority generation immediately after payment.',
  },
  {
    q: 'Can I cancel anytime?',
    a: 'Yes — cancel anytime from your profile page. You\'ll keep Premium access until the end of your current billing period.',
  },
  {
    q: 'Is my payment secure?',
    a: 'All payments are processed by Stripe, one of the world\'s most trusted payment platforms. We never store your card details.',
  },
  {
    q: 'What\'s the difference between Premium and OpinionBot?',
    a: 'Premium is a monthly subscription for unlimited takes on the website. OpinionBot is a separate one-time purchase — a desktop app that lets you get AI takes without opening a browser.',
  },
  {
    q: 'What does "priority generation" mean?',
    a: 'Premium members\' takes are processed first during high-traffic periods, so you get faster responses even when the platform is busy.',
  },
]

function PremiumContent() {
  const [user, setUser] = useState<User | null>(null)
  const [isPremium, setIsPremium] = useState(false)
  const [loading, setLoading] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const searchParams = useSearchParams()
  const success = searchParams.get('success')
  const canceled = searchParams.get('canceled')

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
      if (data.user) checkPremium(data.user.id)
    })
    if (success) setIsPremium(true)
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
    <div className="min-h-screen bg-[#F0EDE6]">

      {/* Success / Canceled banners */}
      {success && (
        <div className="bg-green-600 text-white text-center py-3 px-4 text-sm font-semibold">
          🎉 Welcome to Premium! Your subscription is now active.
        </div>
      )}
      {canceled && (
        <div className="bg-yellow-500 text-white text-center py-3 px-4 text-sm font-semibold">
          No worries — you can upgrade anytime below.
        </div>
      )}

      {/* Hero */}
      <div className="bg-[#0d1117] border-b border-[#1a2a3a]">
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <p className="text-xs font-sans uppercase tracking-widest text-[#4dd9c0] mb-4">Upgrade</p>
          <h1 className="font-serif text-5xl md:text-6xl font-bold text-white mb-4">
            Think sharper.<br />Go Premium.
          </h1>
          <p className="text-xl text-[#8b949e] max-w-xl mx-auto">
            Unlimited AI takes, no ads, and priority generation — for less than a coffee a month.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-16">

        {/* Pricing cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">

          {/* Free */}
          <div className="bg-white rounded-2xl p-8 border border-black/10">
            <h2 className="font-serif text-2xl font-bold mb-1">Free</h2>
            <p className="text-sm text-gray-500 mb-6">Get started with no commitment</p>
            <div className="text-4xl font-bold mb-8">
              $0<span className="text-lg font-normal text-gray-400">/mo</span>
            </div>
            <ul className="space-y-3 mb-8">
              {FREE_FEATURES.map(f => (
                <li key={f.text} className="flex items-center gap-3 text-sm">
                  <span className={f.included ? 'text-green-500' : 'text-gray-300'}>
                    {f.included ? '✓' : '✗'}
                  </span>
                  <span className={f.included ? 'text-gray-700' : 'text-gray-400 line-through'}>
                    {f.text}
                  </span>
                </li>
              ))}
            </ul>
            <div className="w-full py-3 rounded-xl border border-gray-200 text-center text-sm font-medium text-gray-400">
              Current plan
            </div>
          </div>

          {/* Premium */}
          <div className="bg-[#0d1117] rounded-2xl p-8 border-2 border-[#e85d3a] relative overflow-hidden">
            <div className="absolute top-4 right-4 bg-[#e85d3a] text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              Most Popular
            </div>
            <h2 className="font-serif text-2xl font-bold text-white mb-1">Premium</h2>
            <p className="text-sm text-[#8b949e] mb-6">For serious thinkers and debaters</p>
            <div className="text-4xl font-bold text-white mb-8">
              $5<span className="text-lg font-normal text-[#8b949e]">/mo</span>
            </div>
            <ul className="space-y-3 mb-8">
              {PREMIUM_FEATURES.map(f => (
                <li key={f.text} className="flex items-center gap-3 text-sm">
                  <span className="text-[#4dd9c0]">✓</span>
                  <span className="text-gray-200">{f.text}</span>
                </li>
              ))}
            </ul>
            {isPremium ? (
              <div className="w-full py-3 rounded-xl bg-green-600 text-white text-center text-sm font-bold">
                ✓ You are Premium!
              </div>
            ) : (
              <button
                onClick={handleUpgrade}
                disabled={loading}
                className="w-full py-3 rounded-xl bg-[#e85d3a] text-white font-bold hover:bg-orange-700 transition-colors disabled:opacity-50 text-sm uppercase tracking-wider"
              >
                {loading ? 'Redirecting...' : user ? 'Upgrade Now — $5/mo' : 'Sign in to Upgrade'}
              </button>
            )}
            <p className="text-xs text-[#8b949e] text-center mt-3">
              Cancel anytime · Secure via Stripe
            </p>
          </div>
        </div>

        {/* Why upgrade */}
        <div className="mb-16">
          <h2 className="font-serif text-3xl font-bold text-center mb-8">Why go Premium?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { icon: '⚡', title: 'Unlimited takes', desc: 'Never hit a daily limit again. Generate as many takes as you need, whenever you need them.' },
              { icon: '🚫', title: 'No ads', desc: 'A clean, distraction-free experience. Just you and the sharpest AI perspectives on the web.' },
              { icon: '🎯', title: 'Priority generation', desc: 'Your takes are always processed first — no waiting, even during peak hours.' },
            ].map(f => (
              <div key={f.title} className="bg-white rounded-xl p-6 border border-black/5 text-center">
                <div className="text-3xl mb-3">{f.icon}</div>
                <h3 className="font-serif font-bold text-lg mb-2">{f.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div className="mb-16">
          <h2 className="font-serif text-3xl font-bold text-center mb-8">Frequently asked questions</h2>
          <div className="space-y-3 max-w-2xl mx-auto">
            {FAQS.map((faq, i) => (
              <div key={i} className="bg-white rounded-xl border border-black/5 overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-6 py-4 text-left font-medium text-sm hover:bg-gray-50 transition-colors"
                >
                  <span>{faq.q}</span>
                  <span className="text-gray-400 ml-4">{openFaq === i ? '▲' : '▼'}</span>
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-4 text-sm text-gray-600 leading-relaxed border-t border-black/5 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* OpinionBot cross-sell */}
        <div className="bg-[#0d1117] rounded-2xl p-8 border border-[#1a2a3a] text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-[#e85d3a] mb-3">Also available</p>
          <h3 className="font-serif text-2xl font-bold text-white mb-3">Want AI takes on your desktop?</h3>
          <p className="text-[#8b949e] text-sm max-w-md mx-auto mb-6">
            OpinionBot is a one-time $4.99 purchase — a native desktop app for Windows and Mac that gives you AI takes from your taskbar without opening a browser.
          </p>
          <Link
            href="/opinionbot"
            className="inline-block bg-[#e85d3a] text-white font-bold px-8 py-3 rounded-xl hover:bg-orange-700 transition-colors text-sm uppercase tracking-wider"
          >
            Get OpinionBot — $4.99
          </Link>
          <p className="text-xs text-[#8b949e] mt-3">One-time purchase · No subscription required</p>
        </div>

      </div>
    </div>
  )
}

export default function PremiumPage() {
  return (
    <Suspense fallback={<div className="flex justify-center py-16 text-gray-400">Loading...</div>}>
      <PremiumContent />
    </Suspense>
  )
}
