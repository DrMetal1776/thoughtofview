'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'

type Comment = {
  id: string
  take_id: string
  user_id: string
  user_email: string
  body: string
  created_at: string
}

export default function Comments({ takeId }: { takeId: string }) {
  const [comments, setComments] = useState<Comment[]>([])
  const [body, setBody] = useState('')
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [showComments, setShowComments] = useState(false)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
    supabase.auth.onAuthStateChange((_e, session) => setUser(session?.user ?? null))
  }, [])

  useEffect(() => {
    if (showComments) fetchComments()
  }, [showComments, takeId])

  const fetchComments = async () => {
    const { data } = await supabase
      .from('comments')
      .select('*')
      .eq('take_id', takeId)
      .order('created_at', { ascending: true })
    setComments(data || [])
  }

  const submitComment = async () => {
    if (!body.trim() || !user) return
    setLoading(true)
    await supabase.from('comments').insert({
      take_id: takeId,
      user_id: user.id,
      user_email: user.email,
      body: body.trim(),
    })
    setBody('')
    await fetchComments()
    setLoading(false)
  }

  const deleteComment = async (id: string) => {
    await supabase.from('comments').delete().eq('id', id)
    setComments(comments.filter(c => c.id !== id))
  }

  return (
    <div className="mt-3 border-t border-gray-100 pt-3">
      <button
        onClick={() => setShowComments(!showComments)}
        className="text-xs text-brand-muted hover:text-black transition-colors flex items-center gap-1"
      >
        💬 {showComments ? 'Hide' : 'Show'} comments {comments.length > 0 && !showComments ? `(${comments.length})` : ''}
      </button>

      {showComments && (
        <div className="mt-3 space-y-3">
          {comments.length === 0 && (
            <p className="text-xs text-gray-400">No comments yet. Be the first!</p>
          )}
          {comments.map(comment => (
            <div key={comment.id} className="flex gap-2 group">
              <div className="w-6 h-6 rounded-full bg-brand-orange flex items-center justify-center text-white text-xs shrink-0 mt-0.5">
                {comment.user_email?.[0]?.toUpperCase() || '?'}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-xs font-semibold">{comment.user_email?.split('@')[0]}</span>
                  <span className="text-xs text-gray-400">{new Date(comment.created_at).toLocaleDateString()}</span>
                  {user?.id === comment.user_id && (
                    <button
                      onClick={() => deleteComment(comment.id)}
                      className="text-xs text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity ml-auto"
                    >
                      Delete
                    </button>
                  )}
                </div>
                <p className="text-sm text-gray-700">{comment.body}</p>
              </div>
            </div>
          ))}

          {user ? (
            <div className="flex gap-2 mt-3">
              <div className="w-6 h-6 rounded-full bg-brand-orange flex items-center justify-center text-white text-xs shrink-0 mt-0.5">
                {user.email?.[0]?.toUpperCase()}
              </div>
              <div className="flex-1 flex gap-2">
                <input
                  value={body}
                  onChange={e => setBody(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && submitComment()}
                  placeholder="Add a comment..."
                  className="flex-1 text-sm border border-gray-200 rounded-lg px-3 py-1.5 outline-none focus:border-brand-orange"
                />
                <button
                  onClick={submitComment}
                  disabled={loading || !body.trim()}
                  className="text-xs bg-brand-orange text-white px-3 py-1.5 rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50"
                >
                  {loading ? '...' : 'Post'}
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: window.location.origin + '/feed' } })}
              className="text-xs text-brand-orange hover:underline mt-2"
            >
              Sign in to comment →
            </button>
          )}
        </div>
      )}
    </div>
  )
}
