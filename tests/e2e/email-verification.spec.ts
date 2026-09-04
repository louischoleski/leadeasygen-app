import { expect, test } from '@playwright/test'
import { hasInboxCreds, waitForVerificationPin } from './helpers/ethereal'

/**
 * End-to-end email verification, exercised entirely through the app UI:
 *
 *   register form  ->  API sends the code over SMTP  ->  read it from the inbox
 *   ->  enter it on /verify  ->  app confirms and redirects to the dashboard.
 *
 * Requires the backend stack (api + db) running and a test inbox configured via
 * E2E_IMAP_* env vars. Skips cleanly when the inbox creds are absent so the
 * suite stays green in environments that can't reach email.
 */

const PASSWORD = 'TestPassw0rd!2026'

test.describe('email verification', () => {
  test.skip(!hasInboxCreds(), 'E2E_IMAP_USER / E2E_IMAP_PASS not set — see tests/e2e/README.md')

  test('a new user can register and verify their email through the UI', async ({ page }) => {
    const email = `e2e-${Date.now()}@leadeasygen.dev`

    // 1) Register through the real form.
    await page.goto('/register')
    await page.fill('#name', 'Ella Twoee')
    await page.fill('#email', email)
    await page.fill('#password', PASSWORD)
    await page.fill('#confirmPassword', PASSWORD)
    await page.check('#accept-terms')
    await page.click('button[type="submit"]')

    // Registration signs the user in and leaves the guest area.
    await expect(page).not.toHaveURL(/\/register/, { timeout: 15_000 })

    // 2) The API emailed a 6-digit code; read it from the inbox.
    const { code } = await waitForVerificationPin(email)
    expect(code).toMatch(/^\d{6}$/)

    // 3) Enter the code on /verify. OtpInput distributes a full paste across boxes.
    await page.goto('/verify')
    const boxes = page.locator('input[inputmode="numeric"]')
    await boxes.first().click()
    await boxes.first().fill(code)
    if ((await boxes.first().inputValue()).length <= 1) {
      for (let d = 0; d < code.length; d++) await boxes.nth(d).fill(code[d])
    }
    await page.click('button[type="submit"]')

    // 4) Success: a confirmation toast and a redirect to the dashboard.
    await expect(page.getByText('Email verified')).toBeVisible({ timeout: 15_000 })
    await expect(page).toHaveURL('/')
  })
})
