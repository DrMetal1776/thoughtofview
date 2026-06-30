import { NextRequest, NextResponse } from 'next/server'

const ANGLE_PERSONAS: Record<string, string> = {
  'Hot Take': 'You take bold, provocative, confident positions. You speak with conviction and aren\'t afraid to be blunt.',
  'Balanced': 'You weigh both sides fairly but ultimately land on a measured, nuanced position. You acknowledge merit in opposing views.',
  "Devil's Advocate": 'You argue the side most people would oppose, and you do it persuasively. You enjoy being contrarian for the sake of sharpening the debate.',
  'Contrarian': 'You take the mainstream view and flip it. You\'re skeptical of consensus and look for the angle everyone is missing.',
  'Expert Analysis': 'You bring data, frameworks, and deep domain knowledge. You speak like a seasoned expert, citing mechanisms and trends.',
}

const ROUNDS = 4

export async function POST(req: NextRequest) {
  const { topic, angleA, angleB } = await req.json()

  if (!topic || !angleA || !angleB) {
    return NextResponse.json({ error: 'Missing topic or angles' }, { status: 400 })
  }

  const personaA = ANGLE_PERSONAS[angleA] || ANGLE_PERSONAS['Hot Take']
  const personaB = ANGLE_PERSONAS[angleB] || ANGLE_PERSONAS["Devil's Advocate"]

  const messages: { speaker: string; angle: string; text: string }[] = []
  let conversationHistory = ''

  try {
    for (let round = 0; round < ROUNDS; round++) {
      // Speaker A's turn
      const promptA = `You are debating the topic: "${topic}"
Your persona: ${personaA}
You are arguing the "${angleA}" position.

${conversationHistory ? `Conversation so far:\n${conversationHistory}\n\nRespond directly to what was just said. Counter it, build on it, or push back — but stay in character.` : `Open the debate with a strong opening statement on this topic.`}

RULES:
- Keep your response to 2-3 sentences MAX. This is a fast-paced debate, not an essay.
- Be punchy and direct.
- Respond ONLY with your statement, nothing else — no labels, no quotes.`

      const resA = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          max_tokens: 200,
          messages: [{ role: 'user', content: promptA }],
        }),
      })

      if (resA.status === 429) {
        return NextResponse.json({ error: 'The AI is a little overwhelmed right now. Wait a moment and try again!', rateLimited: true, partialMessages: messages }, { status: 429 })
      }
      if (!resA.ok) {
        return NextResponse.json({ error: 'Battle generation failed. Please try again.', partialMessages: messages }, { status: 500 })
      }

      const dataA = await resA.json()
      const textA = dataA.choices?.[0]?.message?.content?.trim() || ''
      if (textA) {
        messages.push({ speaker: 'A', angle: angleA, text: textA })
        conversationHistory += `${angleA}: ${textA}\n`
      }

      // Speaker B's turn
      const promptB = `You are debating the topic: "${topic}"
Your persona: ${personaB}
You are arguing the "${angleB}" position.

Conversation so far:\n${conversationHistory}\n\nRespond directly to what was just said. Counter it, build on it, or push back — but stay in character.

RULES:
- Keep your response to 2-3 sentences MAX. This is a fast-paced debate, not an essay.
- Be punchy and direct.
- Respond ONLY with your statement, nothing else — no labels, no quotes.`

      const resB = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          max_tokens: 200,
          messages: [{ role: 'user', content: promptB }],
        }),
      })

      if (resB.status === 429) {
        return NextResponse.json({ error: 'The AI is a little overwhelmed right now. Wait a moment and try again!', rateLimited: true, partialMessages: messages }, { status: 429 })
      }
      if (!resB.ok) {
        return NextResponse.json({ error: 'Battle generation failed. Please try again.', partialMessages: messages }, { status: 500 })
      }

      const dataB = await resB.json()
      const textB = dataB.choices?.[0]?.message?.content?.trim() || ''
      if (textB) {
        messages.push({ speaker: 'B', angle: angleB, text: textB })
        conversationHistory += `${angleB}: ${textB}\n`
      }
    }

    // Judge round — pick a winner
    const judgePrompt = `You just watched a debate on "${topic}" between ${angleA} and ${angleB}.

Transcript:
${conversationHistory}

Judge this debate. Respond in EXACTLY this format:
WINNER: [${angleA} or ${angleB}]
REASON: [one punchy sentence explaining why, max 20 words]`

    const judgeRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        max_tokens: 100,
        messages: [{ role: 'user', content: judgePrompt }],
      }),
    })

    let winner = null
    let reason = null
    if (judgeRes.ok) {
      const judgeData = await judgeRes.json()
      const judgeText = judgeData.choices?.[0]?.message?.content || ''
      const winnerMatch = judgeText.match(/WINNER:\s*(.+)/)
      const reasonMatch = judgeText.match(/REASON:\s*(.+)/)
      winner = winnerMatch ? winnerMatch[1].trim() : null
      reason = reasonMatch ? reasonMatch[1].trim() : null
    }

    return NextResponse.json({ messages, winner, reason, angleA, angleB, topic })
  } catch (err) {
    console.error('Battle error:', err)
    return NextResponse.json({ error: 'Connection error. Please try again.', partialMessages: messages }, { status: 503 })
  }
}
