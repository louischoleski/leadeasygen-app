import { useEffect } from 'react'
import { Accordion } from '../components/Accordion'
import { Card } from '../components/Card'

const faqs = [
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
]

export default function Faq() {
  useEffect(() => {
    document.title = 'LeadEasyGen — FAQ'
  }, [])

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-2xl font-semibold tracking-tight text-ink">Frequently Asked Questions</h1>
      <p className="mt-1 mb-6 text-sm text-ink-subtle">Credits, scraping, and billing — the short version.</p>
      <Card className="px-5">
        <Accordion items={faqs} />
      </Card>
    </div>
  )
}
