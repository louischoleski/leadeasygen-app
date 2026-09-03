import { MapPin, Tag } from '@phosphor-icons/react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import { subscriptionTiers, useBilling } from '../data/billing'
import { createJob, jobCategories, jobCreditCost, useJobs } from '../data/jobs'
import { Button } from './Button'
import { Card } from './Card'
import { Input } from './Input'
import { Select } from './Select'

const radiusOptions = [5, 10, 25, 50].map((km) => ({ value: km, label: `${km} km` }))
const categoryOptions = jobCategories.map((c) => ({ value: c, label: c }))

const labelClass = 'mb-1 block text-sm font-medium text-ink'

const parseKeywords = (raw: string) =>
  raw
    .split(',')
    .map((k) => k.trim())
    .filter(Boolean)

export function ScrapeForm() {
  const { creditBalance, subscriptionTier } = useBilling()
  const { jobs } = useJobs()
  const [location, setLocation] = useState('')
  const [radiusKm, setRadiusKm] = useState(10)
  const [keywords, setKeywords] = useState('')
  const [category, setCategory] = useState(jobCategories[0])

  const keywordList = parseKeywords(keywords)
  const estimatedCost = jobCreditCost(radiusKm, keywordList.length || 1)
  const insufficient = creditBalance < estimatedCost

  const tier = subscriptionTiers.find((t) => t.id === subscriptionTier)
  const activeJobs = jobs.filter((j) => j.status === 'queued' || j.status === 'running').length
  const jobLimit = tier?.limits.activeJobs ?? null
  const atJobLimit = jobLimit !== null && activeJobs >= jobLimit

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (location.trim().length < 2) {
      toast.error('Enter a location to search')
      return
    }
    if (keywordList.length === 0) {
      toast.error('Enter at least one keyword')
      return
    }
    const result = createJob({ location: location.trim(), radiusKm, keywords: keywordList, category })
    if (!result.ok) {
      toast.error('Not enough credits for this job')
      return
    }
    toast.success('Scrape job started', { description: `${result.job.creditCost} credits deducted.` })
    setLocation('')
    setKeywords('')
  }

  return (
    <Card as="section" className="p-5">
      <h2 className="text-card-title text-ink">New scrape job</h2>
      <p className="mt-1 mb-4 text-sm text-ink-subtle">Find local businesses on Google Maps</p>
      <form noValidate onSubmit={handleSubmit}>
        <div className="grid gap-x-4 gap-y-3 md:grid-cols-2 lg:grid-cols-[2fr_2fr_1fr_1.5fr]">
          <Input
            label="Location"
            id="job-location"
            placeholder="New York, NY"
            iconLeft={MapPin}
            required
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
          <Input
            label="Keywords"
            id="job-keywords"
            placeholder="lawyers, child care, restaurants"
            iconLeft={Tag}
            required
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            helperText="Comma-separated search terms"
          />
          <div>
            <label className={labelClass} htmlFor="job-radius">Radius</label>
            <Select
              inputId="job-radius"
              options={radiusOptions}
              value={radiusOptions.find((o) => o.value === radiusKm)}
              onChange={(option) => option && setRadiusKm(option.value)}
            />
          </div>
          <div>
            <label className={labelClass} htmlFor="job-category">Category</label>
            <Select
              inputId="job-category"
              options={categoryOptions}
              value={categoryOptions.find((o) => o.value === category)}
              onChange={(option) => option && setCategory(option.value)}
            />
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-ink-subtle">
            Estimated cost: <span className="font-medium text-ink">{estimatedCost} credits</span>
            {insufficient && <span className="ml-2 font-medium text-error">Insufficient balance</span>}
            {atJobLimit && !insufficient && (
              <span className="ml-2 font-medium text-warning">
                Your plan allows {jobLimit} active {jobLimit === 1 ? 'job' : 'jobs'}
              </span>
            )}
          </p>
          <div className="w-full sm:w-auto sm:min-w-48">
            {insufficient ? (
              <Button variant="secondary" fullWidth asChild>
                <Link to="/billing#packages">Buy credits</Link>
              </Button>
            ) : (
              <Button type="submit" fullWidth disabled={atJobLimit}>
                Start scrape
              </Button>
            )}
          </div>
        </div>
      </form>
    </Card>
  )
}
