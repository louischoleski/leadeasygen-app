// Help Center copy: hub chrome, article-page chrome, category labels, and the
// six articles keyed by slug. Structure (icons, slugs, category mapping) stays
// in data/helpCenter.ts.
const help = {
  title: 'Help Center',
  subtitle: 'Find answers, guides, and support for everything LeadEasyGen.',
  search: {
    label: 'Search the Help Center',
    placeholder: 'Search help articles, guides, and FAQs…',
  },
  actions: {
    liveChat: 'Live Chat',
    contactSupport: 'Contact Support',
  },
  soon: {
    toast: "{label} isn't available yet",
    description: 'Coming soon.',
    liveChat: 'Live chat',
    articleLibrary: 'The full article library',
    tutorialLibrary: 'The tutorial library',
    statusPage: 'The status page',
  },
  popular: {
    title: 'Popular articles',
    subtitle: 'Browse our most helpful guides and resources.',
    empty: 'No articles match your search.',
    viewAll: 'View all articles',
  },
  faq: {
    title: 'Frequently asked questions',
    subtitle: 'Quick answers to common questions.',
    empty: 'No FAQs match your search.',
    contact: 'Still need help? Contact support',
  },
  faqs: [
    {
      id: 'credits',
      title: 'How do credits work?',
      content:
        'You purchase credit packs via Stripe — they never expire. Each scrape job deducts credits based on its scope: a base of 10, plus 2 per keyword, plus a distance charge for the search radius. The form shows the exact cost before you start.',
    },
    {
      id: 'data',
      title: 'What data does a scrape return?',
      content:
        'Business name, category, rating, review count, phone number, website, address, and any discovered email addresses. Every completed job exports to CSV.',
    },
    {
      id: 'failed',
      title: 'Why did my job fail?',
      content:
        'Sources occasionally change their page layout or rate-limit scrapers. Failed and cancelled jobs are automatically refunded to your credit balance — you can see every refund in Billing under Credit Activity.',
    },
    {
      id: 'limits',
      title: 'Is there a limit to how many leads I can scrape?',
      content:
        'The Free plan allows 1 active job at a time; the Unlimited plan removes job and credit limits. Beyond that, your credit balance is the only practical cap.',
    },
    {
      id: 'refunds',
      title: 'Can I get a refund?',
      content:
        'Purchased credits are non-refundable, so start with a small pack to validate the service for your use case. Failed and cancelled jobs always refund their credits automatically.',
    },
  ],
  tutorials: {
    title: 'Video tutorials',
    subtitle: 'Learn visually with step-by-step guides.',
    viewAll: 'View all tutorials',
    items: [
      { id: 't1', title: 'Complete platform walkthrough', duration: '12:34' },
      { id: 't2', title: 'Running a lead scrape', duration: '8:45' },
      { id: 't3', title: 'From lead to estimate', duration: '15:21' },
      { id: 't4', title: 'CSV export & integrations', duration: '10:15' },
    ],
  },
  contact: {
    title: 'Contact support',
    subtitle: 'Get personalized help from our team.',
    liveChat: 'Live chat',
    liveChatNote: 'Included on paid plans',
    email: 'Email support',
    responseTime: 'Response time',
    responseValue: 'Typically under 2 hours',
    startChat: 'Start live chat',
    sendEmail: 'Send email',
  },
  resources: {
    title: 'Resources',
    subtitle: 'Additional materials and documentation.',
    items: [
      { id: 'r1', title: 'API documentation', description: 'Complete API reference and guides' },
      { id: 'r2', title: 'Scraping guides', description: 'Downloadable lead-sourcing playbooks' },
      { id: 'r3', title: 'Field-ops templates', description: 'Estimate and invoice templates' },
      { id: 'r4', title: 'Security best practices', description: 'Guidelines for keeping data safe' },
    ],
  },
  status: {
    operational: 'All systems operational',
    lastUpdated: 'Last updated: 10 minutes ago',
    viewPage: 'View status page',
  },
  article: {
    notFoundTitle: 'Article not found',
    notFoundBody: 'That help article doesn’t exist or may have moved.',
    back: 'Back to Help Center',
    stillNeedHelp: 'Still need help?',
    responseNote: 'Our support team typically replies within 2 hours.',
    contactSupport: 'Contact support',
  },
  categories: {
    all: 'All Topics',
    'getting-started': 'Getting Started',
    scraping: 'Lead Scraping',
    jobs: 'Jobs & Estimates',
    billing: 'Billing & Credits',
    account: 'Account',
    security: 'Security',
  },
  articles: {
    'getting-started': {
      title: 'Getting started with LeadEasyGen',
      updated: 'Updated 2 days ago',
      summary: 'Go from sign-up to your first exported lead list in a few minutes.',
      sections: [
        {
          heading: 'Create and verify your account',
          body: [
            'Sign up with your email and a password, then enter the 6-digit code we email you to verify the address. Verification unlocks credit purchases and keeps your account recoverable.',
          ],
        },
        {
          heading: 'Add credits',
          body: [
            'Every scrape spends credits, so buy a pack from Billing before your first job. Credits are purchased through Stripe and never expire — start with the smallest pack to try the service.',
          ],
        },
        {
          heading: 'Run your first scrape',
          body: [
            'From the dashboard, enter a location, a search radius, and one or more keywords. The form shows the exact credit cost before you launch. See "Running your first lead scrape" for a step-by-step walkthrough.',
          ],
        },
        {
          heading: 'Export your results',
          body: [
            'When a job completes, open it and export the leads to CSV. Each row includes the business name, contact details, rating, and any discovered emails.',
          ],
        },
      ],
    },
    'first-lead-scrape': {
      title: 'Running your first lead scrape',
      updated: 'Updated 1 week ago',
      summary: 'Configure keywords, location, and radius, then launch and monitor a job.',
      sections: [
        {
          heading: 'Choose your keywords',
          body: [
            'Keywords describe the businesses you want — for example "roofing", "hvac", or "landscaping". Combine keywords with a tight radius to target a specific trade in a specific area.',
          ],
        },
        {
          heading: 'Set location and radius',
          body: [
            'Enter a city or address as the center point and a radius in kilometers. A radius under 5km surfaces hyper-local businesses; widen it to cover a metro area.',
          ],
        },
        {
          heading: 'Review the cost estimate',
          body: [
            'The form shows the credit cost before you commit: a base charge plus a per-keyword charge plus a distance component. Adjust scope until the cost fits your budget.',
          ],
        },
        {
          heading: 'Launch and monitor',
          body: [
            'Start the job and watch its status on the dashboard. Completed jobs are ready to export; failed or cancelled jobs refund their credits automatically.',
          ],
        },
      ],
    },
    'credit-costs': {
      title: 'Understanding credit costs',
      updated: 'Updated 3 days ago',
      summary: "How each scrape job's credit cost is calculated — and when you're refunded.",
      sections: [
        {
          heading: 'The pricing formula',
          body: [
            'A job costs a base of 10 credits, plus 2 credits per keyword, plus a distance charge that scales with your search radius. More keywords and a larger radius mean a higher cost — and a broader set of leads.',
          ],
        },
        {
          heading: 'See the cost before you start',
          body: [
            'The scrape form recalculates the total as you change keywords and radius, so you always know the price before launching. Nothing is spent until you start the job.',
          ],
        },
        {
          heading: 'Refunds for failed jobs',
          body: [
            'If a job fails or you cancel it, its credits are returned to your balance automatically. You can review every charge and refund in Billing under Credit Activity.',
          ],
        },
      ],
    },
    'export-csv': {
      title: 'Exporting leads to CSV',
      updated: 'Updated 5 days ago',
      summary: 'Download completed job results as a CSV you can open anywhere.',
      sections: [
        {
          heading: "What's in the export",
          body: [
            'Each lead includes business name, category, rating, review count, phone number, website, address, and any email addresses discovered during the scrape.',
          ],
        },
        {
          heading: 'How to export',
          body: [
            'Open a completed job and choose Export. The CSV downloads to your device with one row per lead — ready for a spreadsheet, CRM import, or mail-merge.',
          ],
        },
        {
          heading: 'Using the data',
          body: [
            'Import the CSV into your CRM or outreach tool to start contacting leads. Emails found on a business\'s own website are often not listed on map profiles, so the export can surface contacts you won\'t find elsewhere.',
          ],
        },
      ],
    },
    'leads-to-jobs': {
      title: 'Turning leads into jobs & estimates',
      updated: 'Updated 1 day ago',
      summary: 'Move a scraped lead into your field-ops workflow and quote the work.',
      sections: [
        {
          heading: 'From lead to job',
          body: [
            'Promote a promising lead to a job to track it through your pipeline. The lead\'s contact details carry over so you don\'t re-enter anything.',
          ],
        },
        {
          heading: 'Build an estimate',
          body: [
            'Attach an estimate to the job with line items and pricing. Estimates keep the scope and the agreed number in one place.',
          ],
        },
        {
          heading: 'Send and track',
          body: [
            'Send the estimate to the customer and track its status as it moves toward an invoice. Everything stays linked to the original lead for a full history.',
          ],
        },
      ],
    },
    'subscription-plan': {
      title: 'Managing your subscription plan',
      updated: 'Updated 4 days ago',
      summary: 'Compare Free and Unlimited, and change plans when your needs grow.',
      sections: [
        {
          heading: 'Plan differences',
          body: [
            'The Free plan runs one active job at a time — enough to evaluate the service. The Unlimited plan removes job and credit limits so you can run scrapes in parallel.',
          ],
        },
        {
          heading: 'Upgrading',
          body: [
            'Upgrade from the Billing page. Changes take effect immediately, and your existing credit balance carries over unchanged.',
          ],
        },
        {
          heading: 'Managing billing',
          body: [
            'Review invoices, payment history, and credit activity in Billing. Purchased credits are non-refundable, but failed and cancelled jobs always refund automatically.',
          ],
        },
      ],
    },
  },
}
export default help
