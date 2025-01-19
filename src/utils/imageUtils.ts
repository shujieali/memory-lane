const placeholderImages = {
  nature: [
    'https://images.pexels.com/photos/1761279/pexels-photo-1761279.jpeg',
    'https://images.pexels.com/photos/3225517/pexels-photo-3225517.jpeg',
    'https://images.pexels.com/photos/1770809/pexels-photo-1770809.jpeg',
    'https://images.pexels.com/photos/1287145/pexels-photo-1287145.jpeg',
  ],
  city: [
    'https://images.pexels.com/photos/466685/pexels-photo-466685.jpeg',
    'https://images.pexels.com/photos/1519088/pexels-photo-1519088.jpeg',
    'https://images.pexels.com/photos/1105766/pexels-photo-1105766.jpeg',
    'https://images.pexels.com/photos/1563256/pexels-photo-1563256.jpeg',
  ],
  people: [
    'https://images.pexels.com/photos/834863/pexels-photo-834863.jpeg',
    'https://images.pexels.com/photos/1243337/pexels-photo-1243337.jpeg',
    'https://images.pexels.com/photos/1650281/pexels-photo-1650281.jpeg',
    'https://images.pexels.com/photos/2923156/pexels-photo-2923156.jpeg',
  ],
  food: [
    'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg',
    'https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg',
    'https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg',
    'https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg',
  ],
} as const

export type ImageCategory = keyof typeof placeholderImages

export const getRandomImage = (category?: ImageCategory) => {
  const categories = Object.keys(placeholderImages) as ImageCategory[]
  const selectedCategory =
    category || categories[Math.floor(Math.random() * categories.length)]
  const images = placeholderImages[selectedCategory]
  return images[Math.floor(Math.random() * images.length)]
}

export const getDefaultImage = () => getRandomImage()

export const validateImageUrl = async (url: string): Promise<boolean> => {
  try {
    const response = await fetch(url, { method: 'HEAD' })
    const contentType = response.headers.get('content-type')
    return Boolean(response.ok && contentType?.startsWith('image/'))
  } catch {
    return false
  }
}
