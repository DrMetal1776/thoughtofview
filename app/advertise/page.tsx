'use client'
import { useState } from 'react'

export default function AdvertisePage() {
  const [submitted, setSubmitted] = useState(false)

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="font-serif text-5xl font-bold mb-4">Advertise on Thought of View</h1>
      <p className="text-xl text-gray-600 mb-12 max-w-2xl">
        Reach a sharp, engaged audience of critical thinkers, debaters, and idea enthusiasts. Our readers are curious, opinionated, and highly engaged.
      </p>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
        {[
          { stat: 'Growing', label: 'Monthly Visitors' },
          { stat: 'High', label: 'Engagement Rate' },
          { stat: 'Global', label: 'Audience Reach' },
          { stat: 'Diverse', label: 'Topic Categories' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl p-5 border border-gray-200 text-center">
            <div className="font-serif text-3xl font-bold text-[#C2522B] mb-1">{s.stat}</div>
            <div className="text-sm text-gray-500">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Who visits */}
      <div className="mb-16">
        <h2 className="font-serif text-3xl font-bold mb-6">Who Visits Thought of View?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { icon: '🧠', title: 'Critical Thinkers', desc: 'People who love to debate, argue, and explore different perspectives on every topic.' },
            { icon: '📈', title: 'Finance & Crypto Enthusiasts', desc: 'Readers interested in investing, Bitcoin, markets, and economic trends.' },
            { icon: '💻', title: 'Tech & AI Fans', desc: 'Early adopters and professionals following the latest in AI, technology, and innovation.' },
          ].map(a => (
            <div key={a.title} className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="text-3xl mb-3">{a.icon}</div>
              <h3 className="font-bold text-lg mb-2">{a.title}</h3>
              <p className="text-sm text-gray-500">{a.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Ad options */}
      <div className="mb-16">
        <h2 className="font-serif text-3xl font-bold mb-6">Advertising Options</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { title: 'Display Ads', desc: 'Banner ads placed in high-visibility positions across the site — leaderboard, sidebar, and in-content placements.', badge: 'Google AdSense' },
            { title: 'Sponsored Takes', desc: 'Have our AI generate a branded perspective on a topic of your choice, displayed in the public feed with a "Sponsored" label.', badge: 'Native Content' },
            { title: 'Newsletter Sponsorship', desc: 'Reach our email subscribers directly with a dedicated sponsorship slot in our daily AI takes newsletter.', badge: 'Email' },
            { title: 'Custom Partnership', desc: "Have something else in mind? We're open to creative partnerships, affiliate arrangements, and co-marketing opportunities.", badge: 'Flexible' },
          ].map(o => (
            <div key={o.title} className="bg-white rounded-xl p-6 border border-gray-200">
              <span className="text-xs font-bold uppercase tracking-wider text-[#C2522B] bg-orange-50 px-2 py-1 rounded-full">{o.badge}</span>
              <h3 className="font-bold text-xl mt-3 mb-2">{o.title}</h3>
              <p className="text-sm text-gray-500">{o.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Contact form */}
      <div className="bg-[#1A1A1A] rounded-2xl p-8 md:p-10">
        <h2 className="font-serif text-3xl font-bold text-white mb-2">Get in Touch</h2>
        <p className="text-gray-400 mb-8">Tell us about your brand and advertising goals. We'll get back to you within 1-2 business days.</p>

        {submitted ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-3">✅</div>
            <h3 className="font-serif text-2xl font-bold text-white mb-2">Inquiry Received!</h3>
            <p className="text-gray-400">Thanks for reaching out. We'll be in touch shortly.</p>
          </div>
        ) : (
          <form
            action="https://formsubmit.co/thoughtofview@gmail.com"
            method="POST"
            onSubmit={() => setSubmitted(true)}
            className="space-y-4"
          >
            <input type="hidden" name="_subject" value="New advertising inquiry - ThoughtofView.com" />
            <input type="hidden" name="_captcha" value="false" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-400 mb-1">Your Name</label>
                <input type="text" name="name" required placeholder="Jane Smith"
                  className="w-full px-4 py-3 rounded-xl bg-[#2A2A2A] text-white border border-[#444] outline-none focus:border-[#C2522B]" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-400 mb-1">Company</label>
                <input type="text" name="company" placeholder="Acme Inc."
                  className="w-full px-4 py-3 rounded-xl bg-[#2A2A2A] text-white border border-[#444] outline-none focus:border-[#C2522B]" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-400 mb-1">Email</label>
              <input type="email" name="email" required placeholder="you@company.com"
                className="w-full px-4 py-3 rounded-xl bg-[#2A2A2A] text-white border border-[#444] outline-none focus:border-[#C2522B]" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-400 mb-1">Advertising Interest</label>
              <select name="type" className="w-full px-4 py-3 rounded-xl bg-[#2A2A2A] text-white border border-[#444] outline-none focus:border-[#C2522B]">
                <option>Display Ads</option>
                <option>Sponsored Takes</option>
                <option>Newsletter Sponsorship</option>
                <option>Custom Partnership</option>
                <option>Not sure yet</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-400 mb-1">Message</label>
              <textarea name="message" rows={4} placeholder="Tell us about your brand, budget, and goals..."
                className="w-full px-4 py-3 rounded-xl bg-[#2A2A2A] text-white border border-[#444] outline-none focus:border-[#C2522B] resize-none" />
            </div>
            <button type="submit"
              className="w-full bg-[#C2522B] text-white font-bold py-3 rounded-xl hover:bg-orange-700 transition-colors">
              Send Inquiry →
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
