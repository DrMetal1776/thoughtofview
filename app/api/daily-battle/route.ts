import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SECRET_KEY!
)

const TOPICS = [
  'Tipping culture', 'Remote work', 'AI replacing jobs', 'Bitcoin', 'College degrees',
  'Social media and mental health', 'Universal Basic Income', 'The 4-day work week',
  'Electric vehicles', 'Cancel culture', 'Billionaires', 'Self-checkout machines',
  'Streaming vs movie theaters', 'Video games as a career', 'The housing market',
  'Fast fashion', 'Space exploration funding', 'Professional athlete salaries',
  'Homework in schools', 'Subscription services', 'Influencer culture',
  'Nuclear energy', 'The gig economy', 'Standardized testing', 'Open offices',
  'Daylight saving time', 'Meal kit services', 'Dating apps', 'Smart home devices',
  'Four-day school weeks',
]

const MATCHUPS = [
  { a: 'Hot Take', b: "Devil's Advocate" },
  { a: 'Contrarian', b: 'Expert Analysis' },
  { a: 'Hot Take', b: 'Balanced' },
  { a: "Devil's Advocate", b: 'Expert Analysis' },
  { a: 'Contrarian', b: 'Balanced' },
]

const ANGLE_PERSONAS: Record<string, string> = {
  'Hot Take': 'You take bold, provocative, confident positions. You speak with conviction and aren\'t afraid to be blunt.',
  'Balanced': 'You weigh both sides fairly but land on a measured, nuanced position. You acknowledge merit in opposing views.',
  "Devil's Advocate": 'You argue the side most people would oppose, persuasively. You enjoy being contrarian to sharpen the debate.',
  'Contrarian': 'You take the mainstream view and flip it. You\'re skeptical of consensus and look for the angle everyone is missing.',
  'Expert Analysis': 'You bring data, frameworks, and deep domain knowledge. You speak like a seasoned expert.',
}

const ROUNDS = 3

async function groqCall(prompt: string, maxTokens: number): Promise<string> {
  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      max_tokens: maxTokens,
      messages: [{ role: 'user', content: prompt }],
    }),
  })
  if (!res.ok) throw new Error(`Groq error ${res.status}`)
  const data = await res.json()
  return data.choices?.[0]?.message?.content?.trim() || ''
}

async function generateDailyBattle(topic: string, angleA: string, angleB: string) {
  const messages: { speaker: string; angle: string; text: string }[] = []
  let history = ''

  for (let round = 0; round < ROUNDS; round++) {
    for (const [angle, speaker] of [[angleA, 'A'], [angleB, 'B']] as const) {
      const prompt = `You are debating the topic: "${topic}"
Your persona: ${ANGLE_PERSONAS[angle]}
You are arguing the "${angle}" position.

${history ? `Conversation so far:\n${history}\n\nRespond directly to what was just said. Counter it or push back — stay in character.` : 'Open the debate with a strong opening statement on this topic.'}

RULES:
- 2-3 sentences MAX. This is a fast-paced debate.
- Be punchy and direct.
- Respond ONLY with your statement — no labels, no quotes.`

      const text = await groqCall(prompt, 180)
      if (text) {
        messages.push({ speaker, angle, text })
        history += `${angle}: ${text}\n`
      }
    }
  }

  const judgeText = await groqCall(
    `You just watched a debate on "${topic}" between ${angleA} and ${angleB}.

Transcript:
${history}

Judge this debate. Respond in EXACTLY this format:
WINNER: [${angleA} or ${angleB}]
REASON: [one punchy sentence, max 20 words]`,
    100
  )

  const winner = judgeText.match(/WINNER:\s*(.+)/)?.[1]?.trim() || null
  const reason = judgeText.match(/REASON:\s*(.+)/)?.[1]?.trim() || null

  return { messages, winner, reason }
}

export async function GET() {
  const today = new Date().toISOString().split('T')[0]

  // Return cached battle if it exists
  const { data: existing } = await supabase
    .from('daily_battles')
    .select('*')
    .eq('date', today)
    .single()

  if (existing) {
    return NextResponse.json(existing)
  }

  // Generate today's battle
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000
  )
  const topic = TOPICS[dayOfYear % TOPICS.length]
  const matchup = MATCHUPS[dayOfYear % MATCHUPS.length]

  try {
    const battle = await generateDailyBattle(topic, matchup.a, matchup.b)

    const { data: inserted, error } = await supabase
      .from('daily_battles')
      .insert({
        date: today,
        topic,
        angle_a: matchup.a,
        angle_b: matchup.b,
        messages: battle.messages,
        winner: battle.winner,
        reason: battle.reason,
      })
      .select()
      .single()

    if (error) {
      // Race condition: another request inserted first — fetch it
      const { data: raced } = await supabase
        .from('daily_battles')
        .select('*')
        .eq('date', today)
        .single()
      if (raced) return NextResponse.json(raced)
      throw error
    }

    return NextResponse.json(inserted)
  } catch (err) {
    console.error('Daily battle generation failed:', err)
    return NextResponse.json({ error: 'Could not generate today\'s battle' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const { id, side } = await req.json()

  if (!id || !['A', 'B'].includes(side)) {
    return NextResponse.json({ error: 'Invalid vote' }, { status: 400 })
  }

  const column = side === 'A' ? 'votes_a' : 'votes_b'

  const { data: current } = await supabase
    .from('daily_battles')
    .select('votes_a, votes_b')
    .eq('id', id)
    .single()

  if (!current) {
    return NextResponse.json({ error: 'Battle not found' }, { status: 404 })
  }

  const { data: updated, error } = await supabase
    .from('daily_battles')
    .update({ [column]: (current[column as 'votes_a' | 'votes_b'] || 0) + 1 })
    .eq('id', id)
    .select('votes_a, votes_b')
    .single()

  if (error) {
    return NextResponse.json({ error: 'Vote failed' }, { status: 500 })
  }

  return NextResponse.json(updated)
}
