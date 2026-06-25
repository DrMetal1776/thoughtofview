import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SECRET_KEY!
)

const angleInstructions: Record<string, string> = {
  'Hot Take': 'Give a bold, punchy hot take. Be direct and provocative. State a strong opinion. Short punchy headline, then 2-3 sharp paragraphs.',
  'Balanced': 'Give a genuinely balanced analysis. Acknowledge both sides fairly. Conclude with a nuanced synthesis. Headline, then 3 paragraphs.',
  "Devil's Advocate": 'Argue the side most people would oppose. Make the unpopular side sound surprisingly reasonable. Headline, then 2-3 paragraphs.',
  'Contrarian': 'Take the mainstream view and flip it entirely. Make a compelling case for why the consensus is wrong. Headline, then 2-3 paragraphs.',
  'Expert Analysis': 'Give a thoughtful expert-level analysis with data, frameworks, and nuance. Headline, then 3-4 paragraphs.',
}

export async function POST(req: NextRequest) {
  const { topic, angle, userId } = await req.json()

  if (!topic || !angle) {
    return NextResponse.json({ error: 'Missing topic or angle' }, { status: 400 })
  }

  // Check rate limit for logged-in users
  if (userId) {
    const { data: sub } = await supabase
      .from('subscriptions')
      .select('status')
      .eq('user_id', userId)
      .single()

    const isPremium = sub?.status === 'active'

    if (!isPremium) {
      const today = new Date().toISOString().split('T')[0]
      const { data: usage } = await supabase
        .from('take_usage')
        .select('count')
        .eq('user_id', userId)
        .eq('date', today)
        .single()

      if (usage && usage.count >= 5) {
        return NextResponse.json(
          { error: 'Daily limit reached. Upgrade to Premium for unlimited takes!', limitReached: true },
          { status: 429 }
        )
      }

      await supabase.from('take_usage').upsert({
        user_id: userId,
        date: today,
        count: (usage?.count || 0) + 1,
      }, { onConflict: 'user_id,date' })
    }
  }

  const prompt = `You are a sharp opinion writer for a website called Thought of View.

Topic: "${topic}"
Angle: ${angle}
Instruction: ${angleInstructions[angle]}

RESPOND IN THIS EXACT FORMAT — nothing else:
HEADLINE: [Your punchy headline here]
BODY:
[Your opinion content here]`

  let groqRes: Response
  try {
    groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        max_tokens: 1000,
        messages: [{ role: 'user', content: prompt }],
      }),
    })
  } catch (err) {
    console.error('Groq fetch error:', err)
    return NextResponse.json(
      { error: 'Failed to connect to AI. Please try again in a moment.' },
      { status: 503 }
    )
  }

  // Handle Groq rate limit
  if (groqRes.status === 429) {
    return NextResponse.json(
      { error: 'The AI is a little overwhelmed right now. Wait a moment and try again!', rateLimited: true },
      { status: 429 }
    )
  }

  // Handle other Groq errors
  if (!groqRes.ok) {
    console.error('Groq error status:', groqRes.status)
    return NextResponse.json(
      { error: 'AI generation failed. Please try again.' },
      { status: 500 }
    )
  }

  const data = await groqRes.json()
  const text = data.choices?.[0]?.message?.content || ''

  if (!text) {
    return NextResponse.json(
      { error: 'No response from AI. Please try again.' },
      { status: 500 }
    )
  }

  const headlineMatch = text.match(/HEADLINE:\s*(.+)/)
  const bodyMatch = text.match(/BODY:\s*([\s\S]+)/)
  const headline = headlineMatch ? headlineMatch[1].trim() : topic
  const body = bodyMatch ? bodyMatch[1].trim() : text

  if (userId) {
    await supabase.from('takes').insert({
      user_id: userId,
      topic,
      angle,
      headline,
      body,
    })
  }

  return NextResponse.json({ headline, body })
}
