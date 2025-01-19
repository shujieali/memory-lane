import { test, expect } from '@playwright/test'

test.describe('Authentication', () => {
  test('login page is accessible', async ({ page }) => {
    await page.goto('/login')
    await expect(page).toHaveURL('/login')
    await expect(page.getByRole('heading', { name: /login/i })).toBeVisible()
  })

  test('shows validation errors for invalid inputs', async ({ page }) => {
    await page.goto('/login')

    // Try to submit empty form
    await page.getByRole('button', { name: /login/i }).click()

    // Check for validation messages
    await expect(page.getByText(/email is required/i)).toBeVisible()
    await expect(page.getByText(/password is required/i)).toBeVisible()
  })

  test('shows error for invalid credentials', async ({ page }) => {
    await page.goto('/login')

    // Fill in invalid credentials
    await page.getByLabel(/email/i).fill('test@example.com')
    await page.getByLabel(/password/i).fill('wrongpassword')
    await page.getByRole('button', { name: /login/i }).click()

    // Check for error message
    await expect(page.getByText(/invalid credentials/i)).toBeVisible()
  })

  test('navigates to signup page', async ({ page }) => {
    await page.goto('/login')
    await page.getByRole('link', { name: /sign up/i }).click()
    await expect(page).toHaveURL('/signup')
  })
})
