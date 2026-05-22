import React from 'react'
import { LegalLayout } from '@/components/internhunt/legal-layout'

export default function TermsAndConditionsPage() {
  return (
    <LegalLayout title="InternHunt Terms & Conditions" lastUpdated="May 21, 2026">
      <p>
        Please read these Terms & Conditions carefully before using InternHunt.
      </p>
      <p>
        By accessing or using InternHunt, you agree to these terms. If you do not agree, you must not use the platform.
      </p>

      <h2 className="text-lg font-bold text-white mt-8 mb-3">1. Purpose of the Platform</h2>
      <p>
        InternHunt is a tool that helps users discover internships and fresher job opportunities, receive AI-based recommendations, generate cover letters, and manage applications.
      </p>
      <p className="mt-2">InternHunt does not guarantee:</p>
      <ul className="list-disc pl-5 space-y-1 mt-2">
        <li>interviews</li>
        <li>shortlisting</li>
        <li>job offers</li>
        <li>employment outcomes</li>
        <li>acceptance by any company</li>
      </ul>

      <h2 className="text-lg font-bold text-white mt-8 mb-3">2. Account Responsibility</h2>
      <p>You are responsible for:</p>
      <ul className="list-disc pl-5 space-y-1 mt-2">
        <li>maintaining the security of your account</li>
        <li>keeping your login details confidential</li>
        <li>ensuring the accuracy of the information you provide</li>
        <li>using the platform only for lawful purposes</li>
      </ul>
      <p className="mt-3">You are responsible for all activity under your account.</p>

      <h2 className="text-lg font-bold text-white mt-8 mb-3">3. Acceptable Use</h2>
      <p>You agree not to:</p>
      <ul className="list-disc pl-5 space-y-1 mt-2">
        <li>misuse the platform</li>
        <li>try to break, damage, or overload the system</li>
        <li>reverse engineer the product</li>
        <li>copy or steal platform code or content</li>
        <li>upload harmful, illegal, abusive, or false content</li>
        <li>use the platform for spam or fraud</li>
        <li>attempt unauthorized access to data or accounts</li>
      </ul>

      <h2 className="text-lg font-bold text-white mt-8 mb-3">4. AI Features</h2>
      <p>InternHunt uses AI to help generate:</p>
      <ul className="list-disc pl-5 space-y-1 mt-2">
        <li>match scores</li>
        <li>recommendations</li>
        <li>cover letters</li>
        <li>skill-gap insights</li>
        <li>summaries and suggestions</li>
      </ul>
      <p className="mt-3">
        AI output is provided for assistance only. You must review it before relying on it.
      </p>
      <p className="mt-2">
        We do not guarantee that AI-generated content will be error-free, complete, or suitable for every purpose.
      </p>

      <h2 className="text-lg font-bold text-white mt-8 mb-3">5. Third-Party Services</h2>
      <p>
        InternHunt may depend on third-party services for authentication, storage, email delivery, AI processing, hosting, and internship data sources.
      </p>
      <p className="mt-2">
        We are not responsible for outages, failures, or errors caused by third-party services.
      </p>

      <h2 className="text-lg font-bold text-white mt-8 mb-3">6. Third-Party Listings</h2>
      <p>
        InternHunt may display internship or job opportunities from external sources. We are not the employer, recruiter, or hiring authority for those listings.
      </p>
      <p className="mt-2">
        You should verify all opportunity details before applying.
      </p>

      <h2 className="text-lg font-bold text-white mt-8 mb-3">7. Payments, Subscriptions, and Future Features</h2>
      <p>Some features may be free, and some may become paid in the future.</p>
      <p className="mt-2">If we introduce paid plans:</p>
      <ul className="list-disc pl-5 space-y-1 mt-2">
        <li>pricing will be shown clearly</li>
        <li>billing terms will be stated before purchase</li>
        <li>subscription terms may apply</li>
        <li>refunds may be limited unless required by law</li>
      </ul>

      <h2 className="text-lg font-bold text-white mt-8 mb-3">8. Intellectual Property</h2>
      <p>
        All content, branding, design, software, and features of InternHunt are owned by us or our licensors unless otherwise stated.
      </p>
      <p className="mt-2">You may not:</p>
      <ul className="list-disc pl-5 space-y-1 mt-2">
        <li>copy the product</li>
        <li>resell it</li>
        <li>redistribute it</li>
        <li>use our branding without permission</li>
      </ul>

      <h2 className="text-lg font-bold text-white mt-8 mb-3">9. Suspension and Termination</h2>
      <p>We may suspend or terminate your account if:</p>
      <ul className="list-disc pl-5 space-y-1 mt-2">
        <li>you violate these terms</li>
        <li>you misuse the service</li>
        <li>you attempt fraud or abuse</li>
        <li>we are required to do so by law</li>
        <li>we believe your activity harms the platform or other users</li>
      </ul>

      <h2 className="text-lg font-bold text-white mt-8 mb-3">10. Limitation of Liability</h2>
      <p>
        To the maximum extent allowed by law, InternHunt is provided “as is” and “as available.”
      </p>
      <p className="mt-2">We are not responsible for:</p>
      <ul className="list-disc pl-5 space-y-2 mt-2">
        <li>internship scams or false listings on third-party sites</li>
        <li>missed deadlines</li>
        <li>AI mistakes</li>
        <li>loss caused by incorrect user input</li>
        <li>downtime or technical issues</li>
        <li>indirect, incidental, or consequential damages</li>
      </ul>

      <h2 className="text-lg font-bold text-white mt-8 mb-3">11. No Warranty</h2>
      <p>We do not guarantee that:</p>
      <ul className="list-disc pl-5 space-y-1 mt-2">
        <li>the platform will always be available</li>
        <li>the platform will be error-free</li>
        <li>the recommendations will always be accurate</li>
        <li>every internship listed will be legitimate or suitable</li>
      </ul>

      <h2 className="text-lg font-bold text-white mt-8 mb-3">12. User Responsibility</h2>
      <p>You are solely responsible for:</p>
      <ul className="list-disc pl-5 space-y-1 mt-2">
        <li>your applications</li>
        <li>your decisions</li>
        <li>your communication with recruiters</li>
        <li>verifying internship details</li>
        <li>using your own judgment before applying</li>
      </ul>

      <h2 className="text-lg font-bold text-white mt-8 mb-3">13. Changes to These Terms</h2>
      <p>
        We may update these Terms & Conditions at any time. Continued use of InternHunt after changes means you accept the updated terms.
      </p>

      <h2 className="text-lg font-bold text-white mt-8 mb-3">14. Governing Law</h2>
      <p>These terms shall be governed by the laws of India.</p>

      <h2 className="text-lg font-bold text-white mt-8 mb-3">15. Contact</h2>
      <p>For questions about these terms, contact:</p>
      <div className="mt-3 p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] space-y-1 text-sm">
        <p><strong className="text-white/80">Email:</strong> support@internhunt.in</p>
        <p><strong className="text-white/80">Legal Name:</strong> Atul Sharma</p>
        <p><strong className="text-white/80">Address:</strong> Gurugram, Haryana</p>
      </div>
    </LegalLayout>
  )
}
