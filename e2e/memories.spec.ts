import { test, expect } from '@playwright/test'

test('home page is accessible', async ({ page }) => {
  await page.goto('/')

  // Just verify the page loads
  await expect(page).toHaveURL('/')
})
