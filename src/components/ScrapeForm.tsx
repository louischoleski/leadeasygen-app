import { Tag } from '@phosphor-icons/react'
import { useState } from 'react'
import { Controller, useForm, useWatch } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import { subscriptionTiers, useBilling } from '../data/billing'
import { createJob, jobCategories, jobCategoryLabel, jobCreditCost, useJobs } from '../data/jobs'
import { useTranslation } from '../hooks/useTranslation'
import { Button } from './Button'
import { Card } from './Card'
import { ConfirmDialog } from './ConfirmDialog'
import { Input } from './Input'
import { LocationSearch } from './LocationSearch'
import { Select } from './Select'

const radiusOptions = [5, 10, 25, 50].map((km) => ({ value: km, label: `${km} km` }))

const labelClass = 'mb-1 block text-sm font-medium text-ink'

const parseKeywords = (raw: string) =>
  raw
    .split(',')
    .map((k) => k.trim())
    .filter(Boolean)

interface ScrapeFormValues {
  location: string
  radiusKm: number
  keywords: string
  category: string | null
}

export function ScrapeForm() {
  const { t, m } = useTranslation()
  const { creditBalance, subscriptionTier, creditsUnlimited } = useBilling()
  const { jobs } = useJobs()

  // Values stay canonical (they're the server contract); labels follow the locale.
  const categoryOptions = jobCategories.map((c) => ({ value: c, label: jobCategoryLabel(m, c) }))

  const {
    control,
    register,
    handleSubmit,
    resetField,
    formState: { errors, isSubmitting },
  } = useForm<ScrapeFormValues>({
    defaultValues: { location: '', radiusKm: 10, keywords: '', category: null },
    mode: 'all',
  })

  const keywords = useWatch({ control, name: 'keywords' })
  const keywordList = parseKeywords(keywords)
  const estimatedCost = jobCreditCost(keywordList.length)
  // Unlimited-plan users never run out — don't gate scraping on the balance.
  const insufficient = !creditsUnlimited && creditBalance < estimatedCost

  const tier = subscriptionTiers.find((s) => s.id === subscriptionTier)
  const activeJobs = jobs.filter((j) => j.status === 'queued' || j.status === 'running').length
  const jobLimit = tier?.limits.activeJobs ?? null
  const atJobLimit = jobLimit !== null && activeJobs >= jobLimit

  // Held while the confirm dialog is open: the search context plus only the
  // keywords the server flagged as recent duplicates, so confirming force-runs
  // just those (never the new keywords that already got queued).
  const [duplicatePrompt, setDuplicatePrompt] = useState<{
    location: string
    radiusKm: number
    category: string | null
    keywords: string[]
  } | null>(null)

  const run = (params: {
    location: string
    radiusKm: number
    category: string | null
    keywords: string[]
    force: boolean
  }) =>
    createJob({
      location: params.location.trim(),
      radiusKm: params.radiusKm,
      category: params.category ?? undefined,
      keywords: params.keywords,
      force: params.force,
    }).then((result) => {
      if (!result.ok) {
        if (result.error === 'duplicate') {
          // New keywords (if any) were already queued — acknowledge them, then
          // warn only about the duplicates and offer to force just those.
          if (result.created > 0) {
            toast.success(t('jobs.form.started'), {
              description: t(
                result.created === 1 ? 'jobs.form.keywordsQueuedOne' : 'jobs.form.keywordsQueued',
                { count: result.created },
              ),
            })
          }
          setDuplicatePrompt({
            location: params.location,
            radiusKm: params.radiusKm,
            category: params.category,
            keywords: result.duplicates.map((d) => d.keyword),
          })
          return
        }
        toast.error(
          t(
            result.error === 'insufficient-credits'
              ? 'jobs.form.insufficientForJob'
              : result.error === 'at-limit'
                ? 'jobs.form.atLimit'
                : 'jobs.errors.scraperUnreachable',
          ),
        )
        return
      }
      toast.success(t('jobs.form.started'), {
        description: t(
          result.creditCost === 1 ? 'jobs.chargedOnCompletionOne' : 'jobs.chargedOnCompletion',
          { count: result.creditCost },
        ),
      })
      resetField('location')
      resetField('keywords')
    })

  const onSubmit = (data: ScrapeFormValues) =>
    run({
      location: data.location,
      radiusKm: data.radiusKm,
      category: data.category,
      keywords: parseKeywords(data.keywords),
      force: false,
    })

  const confirmDuplicate = () => {
    const prompt = duplicatePrompt
    setDuplicatePrompt(null)
    if (prompt) void run({ ...prompt, force: true })
  }

  return (
    <Card as="section" className="p-5">
      <h2 className="text-card-title text-ink">{t('jobs.form.title')}</h2>
      <p className="mt-1 mb-4 text-sm text-ink-subtle">{t('jobs.form.subtitle')}</p>
      <form noValidate onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-x-4 gap-y-3 md:grid-cols-2 lg:grid-cols-[2fr_2fr_1fr_1.5fr_auto]">
          <Controller
            name="location"
            control={control}
            rules={{
              required: t('jobs.form.errors.locationRequired'),
              validate: (value) => value.trim().length >= 2 || t('jobs.form.errors.locationRequired'),
            }}
            render={({ field }) => (
              <LocationSearch
                label={t('jobs.form.location')}
                id="job-location"
                placeholder={t('jobs.form.locationPlaceholder')}
                required
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                error={errors.location?.message}
              />
            )}
          />
          <Input
            label={t('jobs.form.keywords')}
            id="job-keywords"
            placeholder={t('jobs.form.keywordsPlaceholder')}
            iconLeft={Tag}
            required
            helperText={t('jobs.form.keywordsHelper')}
            error={errors.keywords?.message}
            {...register('keywords', {
              validate: (value) =>
                parseKeywords(value).length > 0 || t('jobs.form.errors.keywordsRequired'),
            })}
          />
          <div>
            <label className={labelClass} htmlFor="job-radius">{t('jobs.form.radius')}</label>
            <Controller
              name="radiusKm"
              control={control}
              render={({ field }) => (
                <Select
                  inputId="job-radius"
                  options={radiusOptions}
                  value={radiusOptions.find((o) => o.value === field.value)}
                  onChange={(option) => option && field.onChange(option.value)}
                />
              )}
            />
          </div>
          <div>
            <label className={labelClass} htmlFor="job-category">{t('jobs.form.category')}</label>
            <Controller
              name="category"
              control={control}
              render={({ field }) => (
                <Select
                  inputId="job-category"
                  options={categoryOptions}
                  isClearable
                  placeholder={t('jobs.form.allCategories')}
                  value={categoryOptions.find((o) => o.value === field.value) ?? null}
                  onChange={(option) => field.onChange(option?.value ?? null)}
                />
              )}
            />
          </div>
          <div className="md:col-span-2 lg:col-span-1 lg:self-start lg:pt-6">
            {insufficient ? (
              <Button variant="secondary" fullWidth className="lg:h-11" asChild>
                <Link to="/billing#packages">{t('jobs.form.buyCredits')}</Link>
              </Button>
            ) : (
              <Button type="submit" fullWidth className="lg:h-11" disabled={atJobLimit || isSubmitting}>
                {t('jobs.form.submit')}
              </Button>
            )}
          </div>
        </div>

        <p className="mt-3 text-sm text-ink-subtle">
          {t('jobs.form.estimatedCost')}{' '}
          <span className="font-medium text-ink">{t('jobs.credits', { count: estimatedCost })}</span>
          {insufficient && (
            <span className="ml-2 font-medium text-error">{t('jobs.form.insufficientBalance')}</span>
          )}
          {atJobLimit && !insufficient && (
            <span className="ml-2 font-medium text-warning">
              {t(jobLimit === 1 ? 'jobs.form.planAllowsOne' : 'jobs.form.planAllows', {
                count: jobLimit ?? 0,
              })}
            </span>
          )}
        </p>
      </form>

      <ConfirmDialog
        open={duplicatePrompt !== null}
        title={t(
          duplicatePrompt && duplicatePrompt.keywords.length > 1
            ? 'jobs.form.duplicate.title'
            : 'jobs.form.duplicate.titleOne',
        )}
        description={
          duplicatePrompt
            ? t(
                duplicatePrompt.keywords.length > 1
                  ? 'jobs.form.duplicate.description'
                  : 'jobs.form.duplicate.descriptionOne',
                { keywords: duplicatePrompt.keywords.join(', ') },
              )
            : ''
        }
        confirmLabel={t(
          duplicatePrompt && duplicatePrompt.keywords.length > 1
            ? 'jobs.form.duplicate.confirm'
            : 'jobs.form.duplicate.confirmOne',
        )}
        cancelLabel={t('jobs.form.duplicate.cancel')}
        onConfirm={confirmDuplicate}
        onClose={() => setDuplicatePrompt(null)}
      />
    </Card>
  )
}
