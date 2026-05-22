import React from 'react'
import { LegalLayout } from '@/components/internhunt/legal-layout'

export default function RefundPolicyPage() {
  return (
    <LegalLayout title="InternHunt Refund Policy" lastUpdated="May 21, 2026">
      <p>
        If paid plans are introduced in the future, refund rules will be stated clearly before purchase.
      </p>

      <h2 className="text-lg font-bold text-white mt-8 mb-3">General Rules</h2>
      <p>Our general refund principles may include:</p>
      <ul className="list-disc pl-5 space-y-2 mt-2">
        <li>subscription fees are billed in advance</li>
        <li>users may cancel future renewals anytime</li>
        <li>refunds may not be available for partially used periods unless required by law</li>
        <li>any special refund rules will be shown on the pricing page</li>
      </ul>
    </LegalLayout>
  )
}
