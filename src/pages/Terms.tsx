import { LegalPage, LegalSection } from '../components/LegalPage'

export default function Terms() {
  return (
    <LegalPage title="Terms of Service">
      <LegalSection heading="1. Acceptance of terms">
        By creating a LeadEasyGen account you agree to these terms. This is placeholder text pending
        legal review — the final terms will be published before public launch.
      </LegalSection>
      <LegalSection heading="2. The service">
        LeadEasyGen finds publicly listed local-business information and delivers it as lead lists.
        Scraping jobs consume credits, purchased as one-time packs or included with a subscription.
      </LegalSection>
      <LegalSection heading="3. Credits and billing">
        Credits are prepaid and non-transferable. Failed or cancelled jobs are refunded to your
        credit balance. Subscription plans renew until cancelled; cancellation takes effect at the
        end of the billing period.
      </LegalSection>
      <LegalSection heading="4. Acceptable use">
        You are responsible for using exported data in compliance with applicable laws, including
        anti-spam and data-protection regulations in your jurisdiction.
      </LegalSection>
      <LegalSection heading="5. Contact">
        Questions about these terms can be sent to support@leadeasygen.com.
      </LegalSection>
    </LegalPage>
  )
}
