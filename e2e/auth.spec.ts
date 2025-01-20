import { test, expect } from '@playwright/test'

test('login page is accessible', async ({ page }) => {
  await page.goto('/login')

  // Just verify the page loads with a form
  await expect(page.locator('form')).toBeVisible()
})
