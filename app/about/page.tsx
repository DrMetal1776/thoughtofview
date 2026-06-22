import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About',
  description: 'Learn about Thought of View — the AI-powered opinion platform built for sharp thinkers.',
}

export default function AboutPage() {
  return (
    <main style={{ minHeight: '100vh', backgroundColor: '#0d1117', color: '#e6edf3', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ maxWidth: '760px', margin: '0 auto', padding: '80px 24px' }}>

        {/* Header */}
        <div style={{ marginBottom: '56px' }}>
          <p style={{ color: '#4dd9c0', fontSize: '13px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '16px' }}>
            About
          </p>
          <h1 style={{ fontSize: '48px', fontWeight: 700, lineHeight: 1.15, margin: '0 0 24px', color: '#ffffff' }}>
            Thought of View
          </h1>
          <p style={{ fontSize: '20px', color: '#8b949e', lineHeight: 1.7, margin: 0 }}>
            AI-powered perspectives on anything — politics, tech, finance, culture, and beyond.
          </p>
        </div>

        {/* Divider */}
        <div style={{ height: '1px', backgroundColor: '#21262d', marginBottom: '56px' }} />

        {/* What is it */}
        <section style={{ marginBottom: '48px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 600, color: '#ffffff', marginBottom: '16px' }}>What is Thought of View?</h2>
          <p style={{ fontSize: '17px', color: '#8b949e', lineHeight: 1.8, margin: '0 0 16px' }}>
            Thought of View is a platform where you can get instant AI-generated perspectives on any topic. Submit a question or statement, and our AI engine delivers hot takes, balanced analysis, devil's advocate arguments, and contrarian views — all in seconds.
          </p>
          <p style={{ fontSize: '17px', color: '#8b949e', lineHeight: 1.8, margin: 0 }}>
            It's built for curious people who want to think sharper, debate better, and see every side of an issue before forming their own view.
          </p>
        </section>

        {/* How it works */}
        <section style={{ marginBottom: '48px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 600, color: '#ffffff', marginBottom: '24px' }}>How it works</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {[
              { step: '01', title: 'Submit a topic', desc: 'Type any question, statement, or topic you want perspectives on.' },
              { step: '02', title: 'AI generates views', desc: 'Our engine produces multiple angles — hot takes, balanced takes, contrarian views, and more.' },
              { step: '03', title: 'Explore the feed', desc: 'Browse opinions from the community, upvote the takes you agree with, and join the conversation.' },
            ].map(({ step, title, desc }) => (
              <div key={step} style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
                <span style={{ color: '#4dd9c0', fontWeight: 700, fontSize: '13px', minWidth: '28px', paddingTop: '2px' }}>{step}</span>
                <div>
                  <p style={{ color: '#ffffff', fontWeight: 600, fontSize: '17px', margin: '0 0 6px' }}>{title}</p>
                  <p style={{ color: '#8b949e', fontSize: '15px', lineHeight: 1.7, margin: 0 }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Tech stack / built with */}
        <section style={{ marginBottom: '48px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 600, color: '#ffffff', marginBottom: '16px' }}>Built with</h2>
          <p style={{ fontSize: '17px', color: '#8b949e', lineHeight: 1.8, margin: '0 0 16px' }}>
            Thought of View is powered by cutting-edge AI language models and built on a modern web stack — Next.js, Supabase, and Groq — designed for speed and reliability.
          </p>
          <p style={{ fontSize: '17px', color: '#8b949e', lineHeight: 1.8, margin: 0 }}>
            Premium members get access to deeper analysis, unlimited opinions, and OpinionBot — a desktop app that brings AI perspectives right to your workflow.
          </p>
        </section>

        {/* Divider */}
        <div style={{ height: '1px', backgroundColor: '#21262d', marginBottom: '48px' }} />

        {/* Contact */}
        <section>
          <h2 style={{ fontSize: '24px', fontWeight: 600, color: '#ffffff', marginBottom: '16px' }}>Get in touch</h2>
          <p style={{ fontSize: '17px', color: '#8b949e', lineHeight: 1.8, margin: 0 }}>
            Questions, feedback, or partnership inquiries? Reach us at{' '}
            <a href="mailto:thoughtofview@gmail.com" style={{ color: '#4dd9c0', textDecoration: 'none' }}>
              thoughtofview@gmail.com
            </a>
          </p>
        </section>

      </div>
    </main>
  )
}
