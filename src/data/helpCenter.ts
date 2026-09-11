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
import type { Messages } from '../locales'

export interface HelpCategory {
  id: string
  icon: Icon
}

// Single source of truth for Help Center categories, shared by the hub's
// filter chips and the article pages' badges. Labels live in the locale
// dictionaries under help.categories.
export const helpCategories: HelpCategory[] = [
  { id: 'all', icon: BookOpen },
  { id: 'getting-started', icon: FileText },
  { id: 'scraping', icon: MagnifyingGlass },
  { id: 'jobs', icon: Briefcase },
  { id: 'billing', icon: Coin },
  { id: 'account', icon: UserCircle },
  { id: 'security', icon: ShieldCheck },
]

export const categoryLabel = (m: Messages, id: string): string =>
  (m.help.categories as Record<string, string | undefined>)[id] ?? id

export interface ArticleSection {
  heading: string
  body: string[]
}

export interface HelpArticle {
  slug: string
  category: string // one of helpCategories[].id (excluding 'all')
  title: string
  updated: string
  summary: string
  sections: ArticleSection[]
}

// Structure only — slug and category, in display order. All copy (title,
// summary, sections) lives in the locale dictionaries under help.articles.
const articleIndex: { slug: string; category: string }[] = [
  { slug: 'getting-started', category: 'getting-started' },
  { slug: 'first-lead-scrape', category: 'scraping' },
  { slug: 'credit-costs', category: 'billing' },
  { slug: 'export-csv', category: 'scraping' },
  { slug: 'leads-to-jobs', category: 'jobs' },
  { slug: 'subscription-plan', category: 'account' },
]

type ArticleCopy = Messages['help']['articles'][keyof Messages['help']['articles']]

// Slugs come from the URL, so index into the dictionary as an open record.
const articleCopy = (m: Messages, slug: string): ArticleCopy | undefined =>
  (m.help.articles as Record<string, ArticleCopy | undefined>)[slug]

export function getHelpArticles(m: Messages): HelpArticle[] {
  return articleIndex.flatMap(({ slug, category }) => {
    const copy = articleCopy(m, slug)
    return copy ? [{ slug, category, ...copy }] : []
  })
}

export function getHelpArticle(m: Messages, slug: string): HelpArticle | undefined {
  const entry = articleIndex.find((a) => a.slug === slug)
  const copy = articleCopy(m, slug)
  return entry && copy ? { ...entry, ...copy } : undefined
}
