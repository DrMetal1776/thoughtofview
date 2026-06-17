import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

export async function POST(req: NextRequest) {
  const { userId, email } = await req.json()

  if (!userId || !email) {
    return NextResponse.json({ error: 'Missing user info' }, { status: 400 })
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'payment',
    customer_email: email,
    line_items: [
      {
        price: 'price_1TjNW835k2AWDoI0NDiJcCTW',
        quantity: 1,
      },
    ],
    success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/opinionbot/success`,
    cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/opinionbot`,
    metadata: { userId },
  })

  return NextResponse.json({ url: session.url })
}
