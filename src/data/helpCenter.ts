import {
  BookOpen,
  Briefcase,
  Coin,
  FileText,
  type Icon,
  MagnifyingGlass,
  ShieldCheck,
  UserCircle,
} from '@phosphor-icons/react'

export interface HelpCategory {
  id: string
  label: string
  icon: Icon
}

// Single source of truth for Help Center categories, shared by the hub's
// filter chips and the article pages' badges.
export const helpCategories: HelpCategory[] = [
  { id: 'all', label: 'All Topics', icon: BookOpen },
  { id: 'getting-started', label: 'Getting Started', icon: FileText },
  { id: 'scraping', label: 'Lead Scraping', icon: MagnifyingGlass },
  { id: 'jobs', label: 'Jobs & Estimates', icon: Briefcase },
  { id: 'billing', label: 'Billing & Credits', icon: Coin },
  { id: 'account', label: 'Account', icon: UserCircle },
  { id: 'security', label: 'Security', icon: ShieldCheck },
]

export const categoryLabel = (id: string): string =>
  helpCategories.find((c) => c.id === id)?.label ?? id

export interface ArticleSection {
  heading: string
  body: string[]
}

export interface HelpArticle {
  slug: string
  title: string
  category: string // one of helpCategories[].id (excluding 'all')
  updated: string
  summary: string
  sections: ArticleSection[]
}

export const helpArticles: HelpArticle[] = [
  {
    slug: 'getting-started',
    title: 'Getting started with LeadEasyGen',
    category: 'getting-started',
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
  {
    slug: 'first-lead-scrape',
    title: 'Running your first lead scrape',
    category: 'scraping',
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
  {
    slug: 'credit-costs',
    title: 'Understanding credit costs',
    category: 'billing',
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
  {
    slug: 'export-csv',
    title: 'Exporting leads to CSV',
    category: 'scraping',
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
  {
    slug: 'leads-to-jobs',
    title: 'Turning leads into jobs & estimates',
    category: 'jobs',
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
  {
    slug: 'subscription-plan',
    title: 'Managing your subscription plan',
    category: 'account',
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
]

export const getHelpArticle = (slug: string): HelpArticle | undefined =>
  helpArticles.find((a) => a.slug === slug)
