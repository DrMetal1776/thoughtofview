'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
    const { data: listener } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null)
    })
    return () => listener.subscription.unsubscribe()
  }, [])

  const signIn = () => supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: window.location.origin }
  })

  const signOut = () => supabase.auth.signOut()

  return (
    <nav className="border-b border-black/10 bg-[#F0EDE6] sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="font-serif text-xl font-bold tracking-tight">
          Thought of View
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/feed" className="text-sm hover:text-brand-orange transition-colors">
            Feed
          </Link>
          {user ? (
            <div className="flex items-center gap-3">
              <Link href="/profile" className="text-sm hover:text-brand-orange transition-colors">
                {user.email?.split('@')[0]}
              </Link>
              <button onClick={signOut} className="text-sm text-brand-muted hover:text-black transition-colors">
                Sign out
              </button>
            </div>
          ) : (
            <button
              onClick={signIn}
              className="bg-brand-orange text-white text-sm px-4 py-1.5 rounded-full hover:bg-orange-700 transition-colors"
            >
              Sign in
            </button>
          )}
        </div>
      </div>
    </nav>
  )
}
