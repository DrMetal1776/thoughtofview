'use client'
import { useState } from 'react'

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false)

  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      <h1 className="font-serif text-5xl font-bold mb-4">Contact Us</h1>
      <p className="text-gray-600 mb-10">Have a question, feedback, or want to advertise on Thought of View? We'd love to hear from you.</p>

      {submitted ? (
        <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center">
          <div className="text-4xl mb-3">✅</div>
          <h2 className="font-serif text-2xl font-bold mb-2">Message Sent!</h2>
          <p className="text-gray-600">Thanks for reaching out. We'll get back to you within 1-2 business days.</p>
        </div>
      ) : (
        <form
          action="https://formsubmit.co/thoughtofview@gmail.com"
          method="POST"
          onSubmit={() => setSubmitted(true)}
          className="space-y-5"
        >
          <input type="hidden" name="_subject" value="New message from ThoughtofView.com" />
          <input type="hidden" name="_captcha" value="false" />
          <input type="hidden" name="_next" value="https://thoughtofview.com/contact" />

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Your Name</label>
            <input type="text" name="name" required placeholder="John Smith"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 outline-none focus:border-orange-500 bg-white" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Email Address</label>
            <input type="email" name="email" required placeholder="you@example.com"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 outline-none focus:border-orange-500 bg-white" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Subject</label>
            <select name="subject" className="w-full px-4 py-3 rounded-xl border border-gray-300 outline-none focus:border-orange-500 bg-white">
              <option>General Question</option>
              <option>Feedback / Suggestion</option>
              <option>Advertising Inquiry</option>
              <option>Bug Report</option>
              <option>Partnership</option>
              <option>Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Message</label>
            <textarea name="message" required rows={6} placeholder="Tell us what's on your mind..."
              className="w-full px-4 py-3 rounded-xl border border-gray-300 outline-none focus:border-orange-500 bg-white resize-none" />
          </div>
          <button type="submit"
            className="w-full bg-[#C2522B] text-white font-bold py-3 rounded-xl hover:bg-orange-700 transition-colors">
            Send Message →
          </button>
        </form>
      )}

      <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl p-5 border border-gray-200">
          <div className="text-2xl mb-2">📧</div>
          <h3 className="font-bold mb-1">Email</h3>
          <p className="text-sm text-gray-600">thoughtofview@gmail.com</p>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-200">
          <div className="text-2xl mb-2">⏱️</div>
          <h3 className="font-bold mb-1">Response Time</h3>
          <p className="text-sm text-gray-600">Usually within 1-2 business days.</p>
        </div>
      </div>
    </div>
  )
}
