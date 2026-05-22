import React from 'react'
import { LegalLayout } from '@/components/internhunt/legal-layout'

export default function ContactPage() {
  return (
    <LegalLayout title="Contact Us" lastUpdated="May 21, 2026">
      <p>
        Have a question, feedback, or need help with your account? We&apos;d love to hear from you.
        Reach out through any of the channels below — we typically respond within 24–48 hours.
      </p>

      <h2 className="text-lg font-bold text-white mt-8 mb-3">📧 Email Support</h2>
      <p>
        The fastest way to reach us is by email. Whether it&apos;s a bug report, a billing question,
        or a feature suggestion — drop us a line:
      </p>
      <div className="mt-4 p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] space-y-2 text-sm">
        <p>
          <strong className="text-white/80">General &amp; Support:</strong>{' '}
          <a
            href="mailto:support@internhunt.in"
            className="text-violet-400 hover:underline"
          >
            support@internhunt.in
          </a>
        </p>
      </div>

      <h2 className="text-lg font-bold text-white mt-8 mb-3">🐛 Report a Bug</h2>
      <p>
        Found something broken? Please email us with:
      </p>
      <ul className="list-disc pl-5 space-y-1 mt-2">
        <li>a short description of the issue</li>
        <li>the steps to reproduce it</li>
        <li>the device and browser you&apos;re using</li>
        <li>a screenshot if possible</li>
      </ul>
      <p className="mt-3">
        Send bug reports to{' '}
        <a href="mailto:support@internhunt.in" className="text-violet-400 hover:underline">
          support@internhunt.in
        </a>{' '}
        with the subject line <strong className="text-white/70">&quot;Bug Report&quot;</strong>.
      </p>

      <h2 className="text-lg font-bold text-white mt-8 mb-3">💡 Feature Requests</h2>
      <p>
        We build InternHunt based on real student feedback. If there&apos;s something you wish
        InternHunt could do, let us know — many of our best features started as user suggestions.
      </p>
      <p className="mt-2">
        Email us at{' '}
        <a href="mailto:support@internhunt.in" className="text-violet-400 hover:underline">
          support@internhunt.in
        </a>{' '}
        with the subject <strong className="text-white/70">&quot;Feature Request&quot;</strong>.
      </p>

      <h2 className="text-lg font-bold text-white mt-8 mb-3">🌐 Social &amp; Community</h2>
      <p>You can also find us on social media for updates and announcements:</p>
      <div className="mt-4 p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] space-y-3 text-sm">
        <p>
          <strong className="text-white/80">Instagram:</strong>{' '}
          <a
            href="https://www.instagram.com/atul_sharmx_/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-violet-400 hover:underline"
          >
            @atul_sharmx_
          </a>
        </p>
        <p>
          <strong className="text-white/80">GitHub:</strong>{' '}
          <a
            href="https://github.com/AtulSharmx"
            target="_blank"
            rel="noopener noreferrer"
            className="text-violet-400 hover:underline"
          >
            github.com/AtulSharmx
          </a>
        </p>
      </div>

      <h2 className="text-lg font-bold text-white mt-8 mb-3">⏱️ Response Times</h2>
      <ul className="list-disc pl-5 space-y-1 mt-2">
        <li>Support emails: typically within 24–48 hours on business days</li>
        <li>Bug reports: acknowledged within 48 hours, fixed based on severity</li>
        <li>Feature requests: reviewed weekly — high-impact ones get prioritised</li>
      </ul>

      <h2 className="text-lg font-bold text-white mt-8 mb-3">📍 About the Team</h2>
      <div className="mt-3 p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] space-y-1 text-sm">
        <p><strong className="text-white/80">Legal Name:</strong> Atul Sharma</p>
        <p><strong className="text-white/80">Location:</strong> Gurugram, Haryana</p>
        <p>
          <strong className="text-white/80">Email:</strong>{' '}
          <a href="mailto:support@internhunt.in" className="text-violet-400 hover:underline">
            support@internhunt.in
          </a>
        </p>
      </div>
    </LegalLayout>
  )
}
