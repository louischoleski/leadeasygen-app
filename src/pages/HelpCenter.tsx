import {
  ArrowRight,
  ArrowSquareOut,
  BookOpen,
  Briefcase,
  CaretRight,
  ChatCircleDots,
  CheckCircle,
  Clock,
  Coin,
  DownloadSimple,
  EnvelopeSimple,
  FileText,
  type Icon,
  Info,
  Lightning,
  MagnifyingGlass,
  Play,
  ShieldCheck,
  UserCircle,
  VideoCamera,
  WarningCircle,
} from '@phosphor-icons/react'
import { useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'
import { Accordion } from '../components/Accordion'
import { Button } from '../components/Button'
import { Card } from '../components/Card'
import { cn } from '../lib/cn'

const SUPPORT_EMAIL = 'support@leadeasygen.com'

interface Category {
  id: string
  label: string
  icon: Icon
}

const categories: Category[] = [
  { id: 'all', label: 'All Topics', icon: BookOpen },
  { id: 'getting-started', label: 'Getting Started', icon: FileText },
  { id: 'scraping', label: 'Lead Scraping', icon: MagnifyingGlass },
  { id: 'jobs', label: 'Jobs & Estimates', icon: Briefcase },
  { id: 'billing', label: 'Billing & Credits', icon: Coin },
  { id: 'account', label: 'Account', icon: UserCircle },
  { id: 'security', label: 'Security', icon: ShieldCheck },
]

const categoryLabel = (id: string) => categories.find((c) => c.id === id)?.label ?? id

interface Article {
  id: string
  title: string
  category: string
  meta: string
}

const articles: Article[] = [
  { id: 'a1', title: 'Getting started with LeadEasyGen', category: 'getting-started', meta: 'Updated 2 days ago' },
  { id: 'a2', title: 'Running your first lead scrape', category: 'scraping', meta: 'Updated 1 week ago' },
  { id: 'a3', title: 'Understanding credit costs', category: 'billing', meta: 'Updated 3 days ago' },
  { id: 'a4', title: 'Exporting leads to CSV', category: 'scraping', meta: 'Updated 5 days ago' },
  { id: 'a5', title: 'Turning leads into jobs & estimates', category: 'jobs', meta: 'Updated 1 day ago' },
  { id: 'a6', title: 'Managing your subscription plan', category: 'account', meta: 'Updated 4 days ago' },
]

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

const tutorials = [
  { id: 't1', title: 'Complete platform walkthrough', duration: '12:34' },
  { id: 't2', title: 'Running a lead scrape', duration: '8:45' },
  { id: 't3', title: 'From lead to estimate', duration: '15:21' },
  { id: 't4', title: 'CSV export & integrations', duration: '10:15' },
]

interface Resource {
  id: string
  title: string
  description: string
  icon: Icon
}

const resources: Resource[] = [
  { id: 'r1', title: 'API documentation', description: 'Complete API reference and guides', icon: FileText },
  { id: 'r2', title: 'Scraping guides', description: 'Downloadable lead-sourcing playbooks', icon: DownloadSimple },
  { id: 'r3', title: 'Field-ops templates', description: 'Estimate and invoice templates', icon: Lightning },
  { id: 'r4', title: 'Security best practices', description: 'Guidelines for keeping data safe', icon: WarningCircle },
]

const supportTeam = [
  { initials: 'AJ', online: true },
  { initials: 'SC', online: true },
  { initials: 'MR', online: false },
]

export default function HelpCenter() {
  useEffect(() => {
    document.title = 'LeadEasyGen — Help Center'
  }, [])

  const [query, setQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('all')

  const q = query.trim().toLowerCase()

  const filteredArticles = useMemo(
    () =>
      articles.filter(
        (a) =>
          (activeCategory === 'all' || a.category === activeCategory) &&
          (q === '' || a.title.toLowerCase().includes(q)),
      ),
    [activeCategory, q],
  )

  const filteredFaqs = useMemo(
    () =>
      faqs.filter(
        (f) => q === '' || f.title.toLowerCase().includes(q) || f.content.toLowerCase().includes(q),
      ),
    [q],
  )

  const soon = (label: string) => toast(`${label} isn't available yet`, { description: 'Coming soon.' })
  const emailSupport = () => {
    window.location.href = `mailto:${SUPPORT_EMAIL}`
  }

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div className="space-y-1.5">
        <h1 className="text-2xl font-semibold tracking-tight text-ink">Help Center</h1>
        <p className="text-sm text-ink-subtle">
          Find answers, guides, and support for everything LeadEasyGen.
        </p>
      </div>

      {/* Search + primary actions */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="md:col-span-2">
          <div className="relative">
            <MagnifyingGlass
              size={16}
              aria-hidden="true"
              className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-ink-subtle"
            />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Search the Help Center"
              placeholder="Search help articles, guides, and FAQs…"
              className="h-10 w-full rounded-md border border-hairline bg-surface-1 pr-3 pl-9 text-sm text-ink shadow-sm transition-colors placeholder:text-ink-subtle focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary-focus/40 focus-visible:outline-none"
            />
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" fullWidth iconLeft={ChatCircleDots} onClick={() => soon('Live chat')}>
            Live Chat
          </Button>
          <Button fullWidth iconLeft={EnvelopeSimple} onClick={emailSupport}>
            Contact Support
          </Button>
        </div>
      </div>

      {/* Category chips */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7">
        {categories.map((cat) => {
          const active = cat.id === activeCategory
          const CatIcon = cat.icon
          return (
            <button
              key={cat.id}
              type="button"
              aria-pressed={active}
              onClick={() => setActiveCategory(cat.id)}
              className={cn(
                'flex cursor-pointer flex-col items-center justify-center rounded-xl border p-4 text-center transition-colors',
                active
                  ? 'border-primary bg-primary/5'
                  : 'border-hairline bg-surface-1 hover:bg-surface-2/50',
              )}
            >
              <CatIcon
                size={28}
                aria-hidden="true"
                className={cn('mb-2', active ? 'text-primary' : 'text-ink-subtle')}
              />
              <span className="text-sm font-medium text-ink">{cat.label}</span>
            </button>
          )
        })}
      </div>

      {/* Main grid */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left column */}
        <div className="space-y-8 lg:col-span-2">
          {/* Popular articles */}
          <Card className="overflow-hidden">
            <div className="space-y-1 p-6">
              <h2 className="flex items-center text-lg font-semibold text-ink">
                <FileText size={20} aria-hidden="true" className="mr-2 text-ink-subtle" />
                Popular articles
              </h2>
              <p className="text-sm text-ink-subtle">Browse our most helpful guides and resources.</p>
            </div>
            <div className="space-y-3 px-6">
              {filteredArticles.length === 0 ? (
                <p className="pb-2 text-sm text-ink-subtle">No articles match your search.</p>
              ) : (
                filteredArticles.map((a) => (
                  <button
                    key={a.id}
                    type="button"
                    onClick={() => soon(a.title)}
                    className="flex w-full cursor-pointer items-start justify-between gap-3 rounded-lg border border-hairline p-4 text-left transition-colors hover:bg-surface-2/50"
                  >
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-medium text-ink">{a.title}</span>
                        <span className="inline-flex items-center rounded-md border border-hairline px-2 py-0.5 text-xs font-medium text-ink-subtle">
                          {categoryLabel(a.category)}
                        </span>
                      </div>
                      <p className="text-xs text-ink-tertiary">{a.meta}</p>
                    </div>
                    <CaretRight size={16} aria-hidden="true" className="mt-1 shrink-0 text-ink-subtle" />
                  </button>
                ))
              )}
            </div>
            <div className="p-6">
              <Button variant="secondary" fullWidth iconRight={ArrowRight} onClick={() => soon('The full article library')}>
                View all articles
              </Button>
            </div>
          </Card>

          {/* FAQ */}
          <Card className="overflow-hidden">
            <div className="space-y-1 p-6">
              <h2 className="flex items-center text-lg font-semibold text-ink">
                <Info size={20} aria-hidden="true" className="mr-2 text-ink-subtle" />
                Frequently asked questions
              </h2>
              <p className="text-sm text-ink-subtle">Quick answers to common questions.</p>
            </div>
            <div className="px-6">
              {filteredFaqs.length === 0 ? (
                <p className="text-sm text-ink-subtle">No FAQs match your search.</p>
              ) : (
                <Accordion items={filteredFaqs} />
              )}
            </div>
            <div className="p-6">
              <Button variant="secondary" fullWidth iconRight={ArrowRight} onClick={emailSupport}>
                Still need help? Contact support
              </Button>
            </div>
          </Card>
        </div>

        {/* Right column */}
        <div className="space-y-8 lg:col-span-1">
          {/* Video tutorials */}
          <Card className="overflow-hidden">
            <div className="space-y-1 p-6">
              <h2 className="flex items-center text-lg font-semibold text-ink">
                <VideoCamera size={20} aria-hidden="true" className="mr-2 text-ink-subtle" />
                Video tutorials
              </h2>
              <p className="text-sm text-ink-subtle">Learn visually with step-by-step guides.</p>
            </div>
            <div className="space-y-4 px-6">
              {tutorials.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => soon(t.title)}
                  className="group block w-full overflow-hidden rounded-lg border border-hairline text-left transition-colors hover:bg-surface-2/50"
                >
                  <div className="relative flex aspect-video w-full items-center justify-center bg-surface-2">
                    <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-on-primary shadow-sm transition-transform group-hover:scale-105">
                      <Play size={22} weight="fill" aria-hidden="true" />
                    </span>
                    <span className="absolute right-2 bottom-2 rounded bg-ink/70 px-1.5 py-0.5 text-xs font-medium text-surface-1">
                      {t.duration}
                    </span>
                  </div>
                  <div className="p-3">
                    <h3 className="text-sm font-medium text-ink">{t.title}</h3>
                  </div>
                </button>
              ))}
            </div>
            <div className="p-6">
              <Button variant="secondary" fullWidth iconRight={ArrowRight} onClick={() => soon('The tutorial library')}>
                View all tutorials
              </Button>
            </div>
          </Card>

          {/* Contact support */}
          <Card className="overflow-hidden">
            <div className="space-y-1 p-6">
              <h2 className="flex items-center text-lg font-semibold text-ink">
                <ChatCircleDots size={20} aria-hidden="true" className="mr-2 text-ink-subtle" />
                Contact support
              </h2>
              <p className="text-sm text-ink-subtle">Get personalized help from our team.</p>
            </div>
            <div className="space-y-5 px-6">
              <div className="flex items-center -space-x-2">
                {supportTeam.map((m) => (
                  <span key={m.initials} className="relative">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-surface-1 bg-surface-2 text-xs font-medium text-ink-subtle">
                      {m.initials}
                    </span>
                    <span
                      className={cn(
                        'absolute right-0 bottom-0 h-2.5 w-2.5 rounded-full border-2 border-surface-1',
                        m.online ? 'bg-success' : 'bg-warning',
                      )}
                    />
                  </span>
                ))}
              </div>
              <div className="space-y-4 border-t border-hairline pt-4">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                    <ChatCircleDots size={20} aria-hidden="true" className="text-primary" />
                  </span>
                  <div>
                    <h3 className="text-sm font-medium text-ink">Live chat</h3>
                    <p className="text-xs text-ink-subtle">Included on paid plans</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                    <EnvelopeSimple size={20} aria-hidden="true" className="text-primary" />
                  </span>
                  <div>
                    <h3 className="text-sm font-medium text-ink">Email support</h3>
                    <p className="text-xs text-ink-subtle">{SUPPORT_EMAIL}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                    <Clock size={20} aria-hidden="true" className="text-primary" />
                  </span>
                  <div>
                    <h3 className="text-sm font-medium text-ink">Response time</h3>
                    <p className="flex items-center text-xs text-ink-subtle">
                      <CheckCircle size={12} aria-hidden="true" className="mr-1 text-success" />
                      Typically under 2 hours
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2 p-6">
              <Button fullWidth iconLeft={ChatCircleDots} onClick={() => soon('Live chat')}>
                Start live chat
              </Button>
              <Button variant="secondary" fullWidth iconLeft={EnvelopeSimple} onClick={emailSupport}>
                Send email
              </Button>
            </div>
          </Card>

          {/* Resources */}
          <Card className="overflow-hidden">
            <div className="space-y-1 p-6">
              <h2 className="flex items-center text-lg font-semibold text-ink">
                <BookOpen size={20} aria-hidden="true" className="mr-2 text-ink-subtle" />
                Resources
              </h2>
              <p className="text-sm text-ink-subtle">Additional materials and documentation.</p>
            </div>
            <div className="space-y-3 px-6 pb-6">
              {resources.map((r) => {
                const ResIcon = r.icon
                return (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => soon(r.title)}
                    className="flex w-full cursor-pointer items-center justify-between gap-3 rounded-lg border border-hairline p-4 text-left transition-colors hover:bg-surface-2/50"
                  >
                    <span className="flex items-center gap-3">
                      <ResIcon size={20} aria-hidden="true" className="shrink-0 text-primary" />
                      <span>
                        <span className="block font-medium text-ink">{r.title}</span>
                        <span className="block text-xs text-ink-subtle">{r.description}</span>
                      </span>
                    </span>
                    <ArrowSquareOut size={16} aria-hidden="true" className="shrink-0 text-ink-subtle" />
                  </button>
                )
              })}
            </div>
          </Card>
        </div>
      </div>

      {/* Platform status */}
      <Card className="p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <span className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-success" />
              <span className="text-sm font-medium text-ink">All systems operational</span>
            </span>
            <span className="hidden h-5 w-px bg-hairline sm:block" />
            <span className="text-sm text-ink-subtle">Last updated: 10 minutes ago</span>
          </div>
          <Button variant="ghost" size="sm" onClick={() => soon('The status page')}>
            View status page
          </Button>
        </div>
      </Card>
    </div>
  )
}
