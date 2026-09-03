import { LegalPage, LegalSection } from '../components/LegalPage'

export default function Privacy() {
  return (
    <LegalPage title="Privacy Policy">
      <LegalSection heading="1. Overview">
        This policy describes what LeadEasyGen collects and why. This is placeholder text pending
        legal review — the final policy will be published before public launch.
      </LegalSection>
      <LegalSection heading="2. What we collect">
        Account details you provide (name, email), billing records for your purchases, and the
        scraping jobs you run. Payment card details are handled by our payment processor and never
        touch our servers.
      </LegalSection>
      <LegalSection heading="3. How we use it">
        To operate the service: running your jobs, maintaining your credit balance, and sending
        transactional email such as receipts and password resets.
      </LegalSection>
      <LegalSection heading="4. Data retention">
        Job results stay in your account until you delete them. You can request deletion of your
        account and its data at any time.
      </LegalSection>
      <LegalSection heading="5. Contact">
        Privacy questions can be sent to privacy@leadeasygen.com.
      </LegalSection>
    </LegalPage>
  )
}
