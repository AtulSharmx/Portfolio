import React from 'react'
import { LegalLayout } from '@/components/internhunt/legal-layout'

export default function DisclaimerPage() {
  return (
    <LegalLayout title="InternHunt Disclaimer" lastUpdated="May 21, 2026">
      <p className="text-base">
        InternHunt is an AI-powered assistant platform for internships and fresher jobs.
      </p>

      <h2 className="text-lg font-bold text-white mt-8 mb-3">No Guarantees</h2>
      <p>We do not guarantee:</p>
      <ul className="list-disc pl-5 space-y-2 mt-2">
        <li>job placement</li>
        <li>interview calls</li>
        <li>internship approval</li>
        <li>accuracy of all third-party listings</li>
        <li>success of any application</li>
      </ul>

      <h2 className="text-lg font-bold text-white mt-8 mb-3">Independent Verification</h2>
      <p>
        All users should verify details independently before applying. You are responsible for validating the legitimacy of the company, stipend details, job profile, and eligibility criteria.
      </p>

      <h2 className="text-lg font-bold text-white mt-8 mb-3">AI-Generated Material</h2>
      <p>
        AI-generated content is meant to help, not replace, human judgment. Do not rely entirely on the match scores or AI cover letters without careful personal review.
      </p>
    </LegalLayout>
  )
}
