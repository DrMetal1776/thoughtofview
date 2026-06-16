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
    mode: 'subscription',
    customer_email: email,
    line_items: [
      {
        price: process.env.STRIPE_PRICE_ID!,
        quantity: 1,
      },
    ],
    success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/premium?success=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/premium?canceled=true`,
    metadata: {
      userId,
    },
  })

  return NextResponse.json({ url: session.url })
}
