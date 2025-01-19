import { test, expect } from '@playwright/test'

test.describe('Memories Feature', () => {
  // Setup: Log in before tests
  test.beforeEach(async ({ page }) => {
    await page.goto('/login')
    await page.getByLabel(/email/i).fill('test@example.com')
    await page.getByLabel(/password/i).fill('Password123!')
    await page.getByRole('button', { name: /login/i }).click()
    await expect(page).toHaveURL('/dashboard')
  })

  test('creates and views a new memory', async ({ page }) => {
    // Navigate to memories page
    await page.goto('/memories')
    await page.getByRole('button', { name: /add memory/i }).click()

    // Fill memory form
    await page.getByLabel(/title/i).fill('Test Memory')
    await page.getByLabel(/description/i).fill('This is a test memory')

    // Mock file upload by intercepting the request
    await page.route('**/api/storage/url', async (route) => {
      await route.fulfill({
        status: 200,
        body: JSON.stringify({
          uploadUrl: 'https://example.com',
          fields: {},
          fileUrl: 'https://example.com/test.jpg',
        }),
      })
    })

    // Add image (mock the file input)
    const fileInput = page.getByLabel(/upload image/i)
    await fileInput.setInputFiles({
      name: 'test.jpg',
      mimeType: 'image/jpeg',
      buffer: Buffer.from('fake image data'),
    })

    // Submit form
    await page.getByRole('button', { name: /save/i }).click()

    // Verify memory was created
    await expect(page.getByText('Test Memory')).toBeVisible()
    await expect(page.getByText('This is a test memory')).toBeVisible()
  })

  test('filters and sorts memories', async ({ page }) => {
    await page.goto('/memories')

    // Test search
    await page.getByPlaceholder(/search/i).fill('vacation')
    await expect(page).toHaveURL(/search=vacation/)

    // Test sorting
    await page.getByRole('button', { name: /sort/i }).click()
    await page.getByText(/date/i).click()
    await expect(page).toHaveURL(/sort=timestamp/)
  })

  test('toggles memory favorite status', async ({ page }) => {
    await page.goto('/memories')

    // Find first memory and favorite it
    const favoriteButton = page
      .getByRole('button', { name: /add to favorites/i })
      .first()
    await favoriteButton.click()

    // Verify favorite status changed
    await expect(
      page.getByRole('button', { name: /remove from favorites/i }),
    ).toBeVisible()
  })

  test('deletes a memory', async ({ page }) => {
    await page.goto('/memories')

    const memoryTitle = 'Test Memory'

    // Store initial count of memories
    const initialMemories = await page.getByTestId('memory-card').count()

    // Click delete on the first memory
    await page
      .getByRole('button', { name: /delete/i })
      .first()
      .click()

    // Confirm deletion in dialog
    await page.getByRole('button', { name: /confirm/i }).click()

    // Verify memory was deleted
    const finalMemories = await page.getByTestId('memory-card').count()
    expect(finalMemories).toBe(initialMemories - 1)
  })

  test('handles offline mode', async ({ page }) => {
    // Simulate offline mode
    await page.context().setOffline(true)

    await page.goto('/memories')

    // Verify offline message is shown
    await expect(page.getByText(/offline mode/i)).toBeVisible()

    // Try to add memory while offline
    await page.getByRole('button', { name: /add memory/i }).click()
    await expect(page.getByText(/not available offline/i)).toBeVisible()

    // Restore online mode
    await page.context().setOffline(false)
  })

  test('shares a memory', async ({ page }) => {
    await page.goto('/memories')

    // Click share on the first memory
    await page.getByRole('button', { name: /share/i }).first().click()

    // Verify share dialog appears with link
    await expect(page.getByRole('dialog')).toBeVisible()
    await expect(page.getByText(/copy link/i)).toBeVisible()

    // Verify copy functionality
    await page.getByRole('button', { name: /copy/i }).click()
    await expect(page.getByText(/link copied/i)).toBeVisible()
  })
})
