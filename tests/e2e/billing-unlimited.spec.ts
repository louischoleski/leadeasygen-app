import { expect, test } from '@playwright/test'
import { registerViaUi } from './helpers/auth'

/**
 * On the Unlimited plan, buying credit packs is blocked server-side
 * (blockPacksWhileSubscribed), so every "Buy credits" CTA must disappear — the
 * user gets a consistent unlimited experience. We force an active Unlimited
 * subscription by intercepting GET /billing/subscription, then assert the CTAs
 * are gone on the Dashboard, Settings, and Billing surfaces (while the plan /
 * billing-management CTAs stay).
 *
 * Needs the backend stack up (no email — verification is off).
 */
test('unlimited plan hides every Buy Credits CTA', async ({ page }) => {
  test.setTimeout(60_000)

  await page.route('**/billing/subscription**', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        reason: 'OK',
        explanation: '',
        result: {
          subscription: {
            status: 'active',
            plan: 'unlimited',
            currentPeriodEnd: null,
            cancelAtPeriodEnd: false,
          },
        },
      }),
    })
  })

  await registerViaUi(page, { email: `unl-${Date.now()}@leadeasygen.dev`, password: 'TestPassw0rd!2026' })

  // Dashboard: the credits widget shows the balance but no Buy Credits link.
  await page.goto('/')
  await expect(page.getByText('Available Credits')).toBeVisible()
  await expect(page.getByRole('link', { name: 'Buy Credits' })).toHaveCount(0)

  // Settings credits card: no Buy credits, but Manage billing stays.
  await page.goto('/settings')
  await expect(page.locator('#credits')).toContainText('Unlimited')
  await expect(page.locator('#credits').getByRole('link', { name: 'Buy credits' })).toHaveCount(0)
  await expect(page.locator('#credits').getByRole('link', { name: 'Manage billing' })).toBeVisible()
  // Balance reads "Unlimited", not a numeric "N remaining".
  await expect(page.locator('#credits')).not.toContainText('remaining')
  // The nav pill shows Unlimited too (not "N credits").
  await expect(page.getByRole('link', { name: 'Unlimited' })).toBeVisible()

  // Billing page: widget Buy Credits gone + no packs toggle; View Plans stays.
  await page.goto('/billing')
  await expect(page.getByRole('button', { name: 'Buy Credits' })).toHaveCount(0)
  await expect(page.getByRole('button', { name: /View Plans/ })).toBeVisible()
})
