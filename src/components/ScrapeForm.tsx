import { Tag } from '@phosphor-icons/react'
import { Controller, useForm, useWatch } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import { subscriptionTiers, useBilling } from '../data/billing'
import { createJob, jobCategories, jobCreditCost, useJobs } from '../data/jobs'
import { Button } from './Button'
import { Card } from './Card'
import { Input } from './Input'
import { LocationSearch } from './LocationSearch'
import { Select } from './Select'

const radiusOptions = [5, 10, 25, 50].map((km) => ({ value: km, label: `${km} km` }))
const categoryOptions = jobCategories.map((c) => ({ value: c, label: c }))

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
  const { creditBalance, subscriptionTier } = useBilling()
  const { jobs } = useJobs()

  const {
    control,
    register,
    handleSubmit,
    resetField,
    formState: { errors },
  } = useForm<ScrapeFormValues>({
    defaultValues: { location: '', radiusKm: 10, keywords: '', category: null },
    mode: 'all',
  })

  const [radiusKm, keywords] = useWatch({ control, name: ['radiusKm', 'keywords'] })
  const keywordList = parseKeywords(keywords)
  const estimatedCost = jobCreditCost(radiusKm, keywordList.length || 1)
  const insufficient = creditBalance < estimatedCost

  const tier = subscriptionTiers.find((t) => t.id === subscriptionTier)
  const activeJobs = jobs.filter((j) => j.status === 'queued' || j.status === 'running').length
  const jobLimit = tier?.limits.activeJobs ?? null
  const atJobLimit = jobLimit !== null && activeJobs >= jobLimit

  const onSubmit = (data: ScrapeFormValues) => {
    const result = createJob({
      location: data.location.trim(),
      radiusKm: data.radiusKm,
      keywords: parseKeywords(data.keywords),
      category: data.category ?? undefined,
    })
    if (!result.ok) {
      toast.error('Not enough credits for this job')
      return
    }
    toast.success('Scrape job started', { description: `${result.job.creditCost} credits deducted.` })
    resetField('location')
    resetField('keywords')
  }

  return (
    <Card as="section" className="p-5">
      <h2 className="text-card-title text-ink">New scrape job</h2>
      <p className="mt-1 mb-4 text-sm text-ink-subtle">Find local businesses on Google Maps</p>
      <form noValidate onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-x-4 gap-y-3 md:grid-cols-2 lg:grid-cols-[2fr_2fr_1fr_1.5fr_auto]">
          <Controller
            name="location"
            control={control}
            rules={{
              required: 'Enter a location to search',
              validate: (value) => value.trim().length >= 2 || 'Enter a location to search',
            }}
            render={({ field }) => (
              <LocationSearch
                label="Location"
                id="job-location"
                placeholder="New York, NY"
                required
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                error={errors.location?.message}
              />
            )}
          />
          <Input
            label="Keywords"
            id="job-keywords"
            placeholder="lawyers, child care, ..."
            iconLeft={Tag}
            required
            helperText="Comma-separated search terms"
            error={errors.keywords?.message}
            {...register('keywords', {
              validate: (value) => parseKeywords(value).length > 0 || 'Enter at least one keyword',
            })}
          />
          <div>
            <label className={labelClass} htmlFor="job-radius">Radius</label>
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
            <label className={labelClass} htmlFor="job-category">Category (optional)</label>
            <Controller
              name="category"
              control={control}
              render={({ field }) => (
                <Select
                  inputId="job-category"
                  options={categoryOptions}
                  isClearable
                  placeholder="All categories"
                  value={categoryOptions.find((o) => o.value === field.value) ?? null}
                  onChange={(option) => field.onChange(option?.value ?? null)}
                />
              )}
            />
          </div>
          <div className="md:col-span-2 lg:col-span-1 lg:self-start lg:pt-6">
            {insufficient ? (
              <Button variant="secondary" fullWidth className="lg:h-11" asChild>
                <Link to="/billing#packages">Buy credits</Link>
              </Button>
            ) : (
              <Button type="submit" fullWidth className="lg:h-11" disabled={atJobLimit}>
                Start scrape
              </Button>
            )}
          </div>
        </div>

        <p className="mt-3 text-sm text-ink-subtle">
          Estimated cost: <span className="font-medium text-ink">{estimatedCost} credits</span>
          {insufficient && <span className="ml-2 font-medium text-error">Insufficient balance</span>}
          {atJobLimit && !insufficient && (
            <span className="ml-2 font-medium text-warning">
              Your plan allows {jobLimit} active {jobLimit === 1 ? 'job' : 'jobs'}
            </span>
          )}
        </p>
      </form>
    </Card>
  )
}
