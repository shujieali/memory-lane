import {
  getRandomImage,
  getDefaultImage,
  validateImageUrl,
  type ImageCategory,
} from '../imageUtils'
import '@testing-library/jest-dom'

describe('imageUtils', () => {
  describe('getRandomImage', () => {
    it('returns a valid image URL for specified category', () => {
      const categories: ImageCategory[] = ['nature', 'city', 'people', 'food']

      categories.forEach((category) => {
        const image = getRandomImage(category)
        expect(image).toMatch(/^https:\/\/images\.pexels\.com/)
        expect(image).toMatch(/\.jpeg$/)
      })
    })

    it('returns random image when no category specified', () => {
      const image = getRandomImage()
      expect(image).toMatch(/^https:\/\/images\.pexels\.com/)
      expect(image).toMatch(/\.jpeg$/)
    })

    it('returns different images on multiple calls', () => {
      const images = new Set()
      for (let i = 0; i < 10; i++) {
        images.add(getRandomImage())
      }
      // At least some of the images should be different
      expect(images.size).toBeGreaterThan(1)
    })
  })

  describe('getDefaultImage', () => {
    it('returns a valid image URL', () => {
      const image = getDefaultImage()
      expect(image).toMatch(/^https:\/\/images\.pexels\.com/)
      expect(image).toMatch(/\.jpeg$/)
    })
  })

  describe('validateImageUrl', () => {
    let fetchSpy: jest.SpyInstance

    beforeEach(() => {
      // Mock fetch for tests
      fetchSpy = jest.spyOn(global, 'fetch').mockImplementation()
    })

    it('returns true for valid image URLs', async () => {
      fetchSpy.mockResolvedValueOnce({
        ok: true,
        headers: new Headers({
          'content-type': 'image/jpeg',
        }),
      } as Response)

      const result = await validateImageUrl('https://example.com/image.jpg')
      expect(result).toBe(true)
      expect(fetchSpy).toHaveBeenCalledWith('https://example.com/image.jpg', {
        method: 'HEAD',
      })
    })

    it('returns false for non-image URLs', async () => {
      fetchSpy.mockResolvedValueOnce({
        ok: true,
        headers: new Headers({
          'content-type': 'text/html',
        }),
      } as Response)

      const result = await validateImageUrl('https://example.com/not-image')
      expect(result).toBe(false)
    })

    it('returns false for failed requests', async () => {
      fetchSpy.mockResolvedValueOnce({
        ok: false,
        headers: new Headers({
          'content-type': 'image/jpeg',
        }),
      } as Response)

      const result = await validateImageUrl('https://example.com/not-found.jpg')
      expect(result).toBe(false)
    })

    it('returns false for network errors', async () => {
      fetchSpy.mockRejectedValueOnce(new Error('Network error'))

      const result = await validateImageUrl('https://invalid-url')
      expect(result).toBe(false)
    })

    afterEach(() => {
      fetchSpy.mockRestore()
    })
  })
})
