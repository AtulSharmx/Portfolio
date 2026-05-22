import React from 'react'
import { LegalLayout } from '@/components/internhunt/legal-layout'

export default function PrivacyPolicyPage() {
  return (
    <LegalLayout title="InternHunt Privacy Policy" lastUpdated="May 21, 2026">
      <p>
        InternHunt (“we,” “our,” or “us”) respects your privacy. This Privacy Policy explains how we collect, use, store, and protect your information when you use our website, app, and related services.
      </p>
      <p>
        By using InternHunt, you agree to the practices described in this policy.
      </p>

      <h2 className="text-lg font-bold text-white mt-8 mb-3">1. What InternHunt Does</h2>
      <p>
        InternHunt is an AI-powered platform that helps students and freshers find internships and entry-level job opportunities. The platform may:
      </p>
      <ul className="list-disc pl-5 space-y-2 mt-2">
        <li>collect user profile details</li>
        <li>match users with relevant opportunities</li>
        <li>generate personalized cover letters</li>
        <li>send email digests and alerts</li>
        <li>track applications and user activity</li>
        <li>use AI to improve recommendations and insights</li>
      </ul>

      <h2 className="text-lg font-bold text-white mt-8 mb-3">2. Information We Collect</h2>
      <p>We may collect the following information from you:</p>
      
      <div className="space-y-4 mt-3">
        <div>
          <h3 className="text-sm font-semibold text-white/90">Account Information</h3>
          <ul className="list-disc pl-5 space-y-1 text-white/60">
            <li>Name</li>
            <li>Email address</li>
            <li>Login and authentication details</li>
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-white/90">Profile Information</h3>
          <ul className="list-disc pl-5 space-y-1 text-white/60">
            <li>College or university name</li>
            <li>Course or degree</li>
            <li>Skills</li>
            <li>Preferred domain or role</li>
            <li>Location preference</li>
            <li>Resume-related details</li>
            <li>Preferred time for daily agent runs</li>
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-white/90">Usage Information</h3>
          <ul className="list-disc pl-5 space-y-1 text-white/60">
            <li>Pages you visit</li>
            <li>Features you use</li>
            <li>Actions you take inside the platform</li>
            <li>Application tracking activity</li>
            <li>Device, browser, and session information</li>
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-white/90">AI-Related Information</h3>
          <p className="text-white/60">When you use InternHunt, our system may process:</p>
          <ul className="list-disc pl-5 space-y-1 text-white/60">
            <li>your profile details</li>
            <li>internship listings</li>
            <li>match scores</li>
            <li>cover letters</li>
            <li>skill-gap insights</li>
            <li>recommendation outputs</li>
          </ul>
        </div>
      </div>

      <h2 className="text-lg font-bold text-white mt-8 mb-3">3. How We Use Your Information</h2>
      <p>We use your information to:</p>
      <ul className="list-disc pl-5 space-y-2 mt-2">
        <li>create and manage your account</li>
        <li>personalize your experience</li>
        <li>find internships and job matches for you</li>
        <li>generate AI-based match scores</li>
        <li>create personalized cover letters</li>
        <li>send email notifications and daily digests</li>
        <li>improve platform performance</li>
        <li>detect abuse, fraud, or misuse</li>
        <li>maintain security and reliability</li>
        <li>support future product features</li>
      </ul>

      <h2 className="text-lg font-bold text-white mt-8 mb-3">4. AI-Generated Content</h2>
      <p>InternHunt uses AI to help with:</p>
      <ul className="list-disc pl-5 space-y-1 mt-2">
        <li>match scoring</li>
        <li>cover letter generation</li>
        <li>recommendation insights</li>
        <li>skill-gap analysis</li>
      </ul>
      <p className="mt-3">
        AI-generated content may not always be correct, complete, or suitable for every situation. You should review all AI-generated content carefully before using it.
      </p>
      <p className="mt-2">
        InternHunt is not responsible for errors in AI-generated output.
      </p>

      <h2 className="text-lg font-bold text-white mt-8 mb-3">5. Internship Listings and Third-Party Sources</h2>
      <p>
        InternHunt may show internship or job listings collected from public or third-party sources such as:
      </p>
      <ul className="list-disc pl-5 space-y-1 mt-2">
        <li>Internshala</li>
        <li>AICTE Internship Portal</li>
        <li>PM Internship Scheme</li>
        <li>other public internship or job sources</li>
      </ul>
      <p className="mt-3">
        We are not officially connected with these platforms unless clearly stated.
      </p>
      <p className="mt-2">
        You are responsible for checking the company name, job details, deadlines, stipend, eligibility, and application process before applying.
      </p>

      <h2 className="text-lg font-bold text-white mt-8 mb-3">6. Sharing of Information</h2>
      <p>We do not sell your personal information.</p>
      <p className="mt-2">We may share your information only in limited situations, such as:</p>
      <ul className="list-disc pl-5 space-y-2 mt-2">
        <li>with trusted service providers that help us run the platform</li>
        <li>when required by law</li>
        <li>to protect our rights, users, or systems</li>
        <li>to prevent fraud, abuse, or misuse</li>
        <li>during a business transfer, merger, or acquisition</li>
      </ul>

      <h2 className="text-lg font-bold text-white mt-8 mb-3">7. Data Storage and Security</h2>
      <p>
        We take reasonable steps to protect your information. Your data may be stored using secure third-party infrastructure and services such as:
      </p>
      <ul className="list-disc pl-5 space-y-1 mt-2">
        <li>Supabase</li>
        <li>Vercel</li>
        <li>Koyeb</li>
        <li>email delivery services</li>
        <li>AI providers</li>
      </ul>
      <p className="mt-3">
        No online system is completely secure. While we work to protect your data, we cannot guarantee absolute security.
      </p>

      <h2 className="text-lg font-bold text-white mt-8 mb-3">8. Cookies and Tracking</h2>
      <p>
        InternHunt may use cookies and similar technologies to keep you logged in, remember preferences, improve performance, understand usage patterns, and support analytics and product improvement.
      </p>
      <p className="mt-2">
        You may control cookies through your browser settings, but some parts of the platform may not work properly if cookies are disabled.
      </p>

      <h2 className="text-lg font-bold text-white mt-8 mb-3">9. Email Communication</h2>
      <p>We may send you account-related messages, internship digests, reminders, product updates, and service announcements. You may unsubscribe from non-essential emails at any time.</p>

      <h2 className="text-lg font-bold text-white mt-8 mb-3">10. Your Rights and Choices</h2>
      <p>
        Depending on your location and applicable law, you may have the right to access your data, update your data, request deletion of your account, object to certain types of processing, or unsubscribe from marketing emails.
      </p>
      <p className="mt-2">
        To make a request, contact us at the email below.
      </p>

      <h2 className="text-lg font-bold text-white mt-8 mb-3">11. Data Retention</h2>
      <p>
        We keep your information only for as long as needed to provide our services, meet legal requirements, resolve disputes, maintain records, and improve the platform.
      </p>
      <p className="mt-2">
        If you delete your account, we may still keep some information when required by law or for legitimate business purposes.
      </p>

      <h2 className="text-lg font-bold text-white mt-8 mb-3">12. Children’s Privacy</h2>
      <p>
        InternHunt is not intended for children under 13 years of age. We do not knowingly collect personal data from children under 13.
      </p>

      <h2 className="text-lg font-bold text-white mt-8 mb-3">13. Changes to This Policy</h2>
      <p>
        We may update this Privacy Policy from time to time. When we do, we will update the “Last Updated” date at the top of this page.
      </p>

      <h2 className="text-lg font-bold text-white mt-8 mb-3">14. Contact Us</h2>
      <p>For privacy-related questions, contact:</p>
      <div className="mt-3 p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] space-y-1 text-sm">
        <p><strong className="text-white/80">Email:</strong> support@internhunt.in</p>
        <p><strong className="text-white/80">Legal Name:</strong> Atul Sharma</p>
        <p><strong className="text-white/80">Address:</strong> Gurugram, Haryana</p>
      </div>
    </LegalLayout>
  )
}
