import { ArrowLeft, ChatCircleDots } from '@phosphor-icons/react'
import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Button } from '../components/Button'
import { Card } from '../components/Card'
import { categoryLabel, getHelpArticle } from '../data/helpCenter'

const SUPPORT_EMAIL = 'support@leadeasygen.com'

export default function HelpArticle() {
  const { slug } = useParams<{ slug: string }>()
  const article = slug ? getHelpArticle(slug) : undefined

  useEffect(() => {
    document.title = article
      ? `LeadEasyGen — ${article.title}`
      : 'LeadEasyGen — Help Center'
  }, [article])

  if (!article) {
    return (
      <div className="mx-auto max-w-2xl space-y-4 py-8 text-center">
        <h1 className="text-2xl font-semibold tracking-tight text-ink">Article not found</h1>
        <p className="text-sm text-ink-subtle">
          That help article doesn’t exist or may have moved.
        </p>
        <Button asChild variant="secondary" iconLeft={ArrowLeft}>
          <Link to="/help">Back to Help Center</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6 pb-10">
      <Link
        to="/help"
        className="inline-flex items-center gap-1.5 text-sm text-ink-subtle transition-colors hover:text-ink"
      >
        <ArrowLeft size={16} aria-hidden="true" />
        Back to Help Center
      </Link>

      <div className="space-y-3">
        <span className="inline-flex items-center rounded-md border border-hairline px-2 py-0.5 text-xs font-medium text-ink-subtle">
          {categoryLabel(article.category)}
        </span>
        <h1 className="text-3xl font-bold tracking-tight text-ink">{article.title}</h1>
        <p className="text-base text-ink-subtle">{article.summary}</p>
        <p className="text-xs text-ink-tertiary">{article.updated}</p>
      </div>

      <Card as="article" className="space-y-6 p-6">
        {article.sections.map((section) => (
          <section key={section.heading} className="space-y-2">
            <h2 className="text-lg font-semibold text-ink">{section.heading}</h2>
            {section.body.map((paragraph, i) => (
              <p key={i} className="text-sm leading-relaxed text-ink-subtle">
                {paragraph}
              </p>
            ))}
          </section>
        ))}
      </Card>

      <Card className="flex flex-wrap items-center justify-between gap-3 p-6">
        <div>
          <h2 className="text-sm font-medium text-ink">Still need help?</h2>
          <p className="text-xs text-ink-subtle">Our support team typically replies within 2 hours.</p>
        </div>
        <Button
          variant="secondary"
          iconLeft={ChatCircleDots}
          onClick={() => {
            window.location.href = `mailto:${SUPPORT_EMAIL}`
          }}
        >
          Contact support
        </Button>
      </Card>
    </div>
  )
}
