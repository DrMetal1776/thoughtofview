import type { Metadata } from 'next'
import FeedClient from './FeedClient'

export const metadata: Metadata = {
  title: 'The Feed — Community AI Takes',
  description: 'Browse AI-generated hot takes, balanced analysis, and contrarian views from the Thought of View community. Upvote the sharpest perspectives.',
  openGraph: {
    title: 'The Feed — Community AI Takes | Thought of View',
    description: 'Browse AI-generated perspectives from the community. Upvote the sharpest takes.',
  },
}

export default function FeedPage() {
  return <FeedClient />
}
