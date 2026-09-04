import { defineConfig, devices } from '@playwright/test'

/**
 * E2E config. The suite drives the real app in a browser against a running API,
 * so it needs the backend stack up (api on :3000, its DB, and SMTP/IMAP creds
 * for the email-dependent specs — see tests/e2e/README.md).
 *
 * The app dev server is started automatically (or reused if already running).
 */
const BASE_URL = process.env.E2E_BASE_URL ?? 'http://localhost:5173'

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    baseURL: BASE_URL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: 'npm run dev',
    url: BASE_URL,
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
})
