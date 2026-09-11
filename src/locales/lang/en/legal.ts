// Legal pages: shared chrome plus the Terms and Privacy documents as
// structured sections, rendered by pages/Terms.tsx and pages/Privacy.tsx.
const legal = {
  lastUpdated: 'Last updated: June 1, 2025',
  terms: {
    title: 'Terms of Service',
    sections: [
      {
        heading: '1. Acceptance of terms',
        body: 'By creating a LeadEasyGen account you agree to these terms. This is placeholder text pending legal review — the final terms will be published before public launch.',
      },
      {
        heading: '2. The service',
        body: 'LeadEasyGen finds publicly listed local-business information and delivers it as lead lists. Scraping jobs consume credits, purchased as one-time packs or included with a subscription.',
      },
      {
        heading: '3. Credits and billing',
        body: 'Credits are prepaid and non-transferable. Failed or cancelled jobs are refunded to your credit balance. Subscription plans renew until cancelled; cancellation takes effect at the end of the billing period.',
      },
      {
        heading: '4. Acceptable use',
        body: 'You are responsible for using exported data in compliance with applicable laws, including anti-spam and data-protection regulations in your jurisdiction.',
      },
      {
        heading: '5. Contact',
        body: 'Questions about these terms can be sent to support@leadeasygen.com.',
      },
    ],
  },
  privacy: {
    title: 'Privacy Policy',
    sections: [
      {
        heading: '1. Overview',
        body: 'This policy describes what LeadEasyGen collects and why. This is placeholder text pending legal review — the final policy will be published before public launch.',
      },
      {
        heading: '2. What we collect',
        body: 'Account details you provide (name, email), billing records for your purchases, and the scraping jobs you run. Payment card details are handled by our payment processor and never touch our servers.',
      },
      {
        heading: '3. How we use it',
        body: 'To operate the service: running your jobs, maintaining your credit balance, and sending transactional email such as receipts and password resets.',
      },
      {
        heading: '4. Data retention',
        body: 'Job results stay in your account until you delete them. You can request deletion of your account and its data at any time.',
      },
      {
        heading: '5. Contact',
        body: 'Privacy questions can be sent to privacy@leadeasygen.com.',
      },
    ],
  },
}
export default legal
