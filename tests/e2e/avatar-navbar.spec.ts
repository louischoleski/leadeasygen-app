import { expect, test } from '@playwright/test'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { registerViaUi } from './helpers/auth'

const AVATAR = join(dirname(fileURLToPath(import.meta.url)), 'fixtures', 'avatar.png')

/**
 * Regression for the top-nav avatar not reflecting an upload: the Navbar
 * rendered the bundled placeholder unconditionally instead of the session's
 * user.profileImageUrl, so a changed avatar only showed in the Settings card.
 *
 * Drives the real upload through the UI and asserts BOTH the Settings card and
 * the nav-bar avatar switch to the served /media/:id URL. Needs the backend
 * stack up (no email needed — the app runs with verification disabled).
 */
test('uploaded avatar shows in the top nav, not just the profile card', async ({ page }) => {
  test.setTimeout(60_000)

  const email = `avatar-${Date.now()}@leadeasygen.dev`
  await registerViaUi(page, { email, password: 'TestPassw0rd!2026' })

  await page.goto('/settings')

  const navAvatar = page.getByRole('button', { name: /^Account:/ }).locator('img')
  // Before upload the nav shows the bundled placeholder — never a /media/ URL.
  const before = (await navAvatar.getAttribute('src')) ?? ''
  expect(before).not.toContain('/media/')

  // The "Change avatar" input is hidden; setInputFiles fires its change handler.
  await page.setInputFiles('input[type="file"]', AVATAR)
  await expect(page.getByText('Avatar updated')).toBeVisible({ timeout: 20_000 })

  const cardAvatar = page.locator('#profile img').first()
  // The fix: both the profile card AND the nav bar now point at the served asset.
  await expect(cardAvatar).toHaveAttribute('src', /\/media\//, { timeout: 15_000 })
  await expect(navAvatar).toHaveAttribute('src', /\/media\//, { timeout: 15_000 })

  const cardSrc = await cardAvatar.getAttribute('src')
  const navSrc = await navAvatar.getAttribute('src')
  expect(navSrc).toBe(cardSrc)
  const uploadedUrl = navSrc as string

  // Remove reverts both avatars to the bundled placeholder and deletes the asset.
  await page.locator('#profile').getByRole('button', { name: 'Remove' }).click()
  await expect(page.getByText('Avatar removed')).toBeVisible({ timeout: 20_000 })
  await expect(cardAvatar).not.toHaveAttribute('src', /\/media\//, { timeout: 15_000 })
  await expect(navAvatar).not.toHaveAttribute('src', /\/media\//, { timeout: 15_000 })
  // The stored asset is gone (deleted), so the served URL now 404s.
  expect((await page.request.get(uploadedUrl)).status()).toBe(404)
})
