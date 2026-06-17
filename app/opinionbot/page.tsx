'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'

export default function OpinionBotPage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
  }, [])

  const handlePurchase = async () => {
    if (!user) {
      supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: window.location.origin + '/auth/callback?next=/opinionbot' } })
      return
    }
    setLoading(true)
    const res = await fetch('/api/create-opinionbot-checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: user.id, email: user.email }),
    })
    const { url } = await res.json()
    window.location.href = url
  }

  return (
    <div className="min-h-screen bg-[#F0EDE6]">
      <div className="max-w-5xl mx-auto px-4 pt-16 pb-8 text-center">
        <div className="inline-block bg-brand-orange text-white text-xs font-bold px-3 py-1 rounded-full mb-4 uppercase tracking-wider">New Digital Product</div>
        <h1 className="font-serif text-6xl font-bold mb-4">Meet OpinionBot</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">An animated AI-powered robot that reacts to any topic with hot takes, devil advocate arguments, and expert analysis. Embed on your site or run standalone.</p>
        <div className="flex items-center justify-center gap-4 mb-12">
          <div className="text-5xl font-bold">$4.99</div>
          <div className="text-left">
            <div className="text-sm font-semibold text-gray-800">One-time purchase</div>
            <div className="text-sm text-gray-500">Download forever. No subscription.</div>
          </div>
        </div>
        <button onClick={handlePurchase} disabled={loading} className="bg-brand-orange text-white font-bold text-lg px-10 py-4 rounded-xl hover:bg-orange-700 transition-colors disabled:opacity-50 mb-4">
          {loading ? 'Redirecting...' : user ? 'Buy and Download - $4.99' : 'Sign in to Purchase'}
        </button>
        <p className="text-xs text-gray-400">Secure payment via Stripe. Instant download after purchase.</p>
      </div>
      <div className="max-w-5xl mx-auto px-4 pb-16">
        <div className="bg-[#1a1a1a] rounded-2xl p-8 mb-16 text-center">
          <p className="text-gray-400 text-sm uppercase tracking-widest mb-6">Live Preview - Try it now</p>
          <iframe src="/opinionbot.html" className="w-full rounded-xl border-0" style={{height: '520px'}} title="OpinionBot Preview" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {[
            { title: 'Fully Animated', desc: 'OpinionBot bobs, shakes, and bounces differently for each opinion mode.' },
            { title: '5 Opinion Modes', desc: 'Hot Take, Balanced, Devils Advocate, Contrarian, and Expert Analysis.' },
            { title: 'Reacts to Topics', desc: 'Type any topic and OpinionBot instantly reacts with a sharp perspective.' },
            { title: 'Embed Anywhere', desc: 'Drop a single HTML file into any website. No dependencies required.' },
            { title: 'Instant Download', desc: 'After purchase you get a single HTML file ready to use immediately.' },
            { title: 'Yours Forever', desc: 'One-time purchase. No subscriptions, no licenses, no expiry.' },
          ].map(f => (
            <div key={f.title} className="bg-white rounded-xl p-6 border border-gray-100">
              <h3 className="font-serif font-bold text-lg mb-2">{f.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
        <div className="text-center">
          <h2 className="font-serif text-4xl font-bold mb-4">Get OpinionBot today</h2>
          <p className="text-gray-500 mb-8">One file. One price. Infinite opinions.</p>
          <button onClick={handlePurchase} disabled={loading} className="bg-brand-orange text-white font-bold text-lg px-10 py-4 rounded-xl hover:bg-orange-700 transition-colors disabled:opacity-50">
            {loading ? 'Redirecting...' : user ? 'Buy and Download - $4.99' : 'Sign in to Purchase'}
          </button>
          <p className="text-xs text-gray-400 mt-4">Secure payment via Stripe. Instant download after purchase.</p>
        </div>
      </div>
    </div>
  )
}