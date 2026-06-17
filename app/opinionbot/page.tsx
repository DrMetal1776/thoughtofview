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
      supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: window.location.origin + '/auth/callback?next=/opinionbot' }
      })
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
      {/* Hero */}
      <div className="max-w-5xl mx-auto px-4 pt-16 pb-8 text-center">
        <div className="inline-block bg-brand-orange text-white text-xs font-bold px-3 py-1 rounded-full mb-4 uppercase tracking-wider">
          New Digital Product
        </div>
        <h1 className="font-serif text-6xl font-bold mb-4">Meet OpinionBot</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
          An animated AI-powered robot that reacts to any topic with hot takes, devil's advocate arguments, and expert analysis. Embed it on your site or run it standalone.
        </p>
        <div className="flex items-center justify-center gap-4 mb-12">
          <div className="text-5xl font-bold">$4.99</div>
          <div className="text-left">
            <div className="text-sm font-semibold text-gray-800">One-time purchase</div>
            <div className="text-sm text-gray-500">Download forever. No subscription.</div>
          </div>
        </div>
        <button
          onClick={handlePurchase}
          disabled={loading}
          className="bg-brand-orange text-white font-bold text-lg px-10 py-4 rounded-xl hover:bg-orange-700 transition-colors disabled:opacity-50 mb-4"
        >
          {loading ? 'Redirecting...' : user ? 'Buy & Download — $4.99' : 'Sign in to Purchase'}
        </button>
        <p className="text-xs text-gray-400">Secure payment via Stripe. Instant download after purchase.</p>
      </div>

      {/* Preview */}
      <div className="max-w-5xl mx-auto px-4 pb-16">
        <div className="bg-[#1a1a1a] rounded-2xl p-8 mb-16 text-center">
          <p className="text-gray-400 text-sm uppercase tracking-widest mb-6">Live Preview — Try it now</p>
          <iframe
            src="/opinionbot.html"
            className="w-full rounded-xl border-0"
            style={{ height: '520px' }}
            title="OpinionBot Preview"
          />
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {[
            { icon: '🤖', title: 'Fully Animated', desc: 'OpinionBot bobs, shakes, bounces and nods differently for each opinion mode. Eyes change color, mouth changes expression.' },
            { icon: '🎯', title: '5 Opinion Modes', desc: 'Hot Take, Balanced, Devil\'s Advocate, Contrarian, and Expert Analysis — each with unique animations and responses.' },
            { icon: '💬', title: 'Reacts to Your Topics', desc: 'Type any topic and OpinionBot instantly reacts with a sharp perspective in whatever mode you choose.' },
            { icon: '🌐', title: 'Embed Anywhere', desc: 'Drop a single HTML file into any website. No dependencies, no frameworks, no setup required.' },
            { icon: '⚡', title: 'Instant Download', desc: 'After purchase you get a single HTML file. Open it in any browser or embed it on your site immediately.' },
            { icon: '♾️', title: 'Yours Forever', desc: 'One-time purchase. No subscriptions, no licenses, no expiry. Use it on as many sites as you want.' },
          ].map(f => (
            <div
