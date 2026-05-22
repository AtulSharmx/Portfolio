import React from 'react'
import { LegalLayout } from '@/components/internhunt/legal-layout'

export default function CookiePolicyPage() {
  return (
    <LegalLayout title="InternHunt Cookie Policy" lastUpdated="May 21, 2026">
      <p>
        InternHunt may use cookies and similar technologies to support a better user experience.
      </p>

      <h2 className="text-lg font-bold text-white mt-8 mb-3">How We Use Cookies</h2>
      <p>We use these technologies to:</p>
      <ul className="list-disc pl-5 space-y-2 mt-2">
        <li>keep you signed in to your account</li>
        <li>remember your preferences and profile details</li>
        <li>improve platform performance and speed</li>
        <li>analyze aggregate usage trends</li>
      </ul>

      <h2 className="text-lg font-bold text-white mt-8 mb-3">Your Choices</h2>
      <p>
        You can control cookies through your browser settings. Disabling cookies may affect some features of the platform (such as persistent login).
      </p>
    </LegalLayout>
  )
}
