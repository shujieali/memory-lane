import sharp from 'sharp'
import fs from 'fs/promises'
import path from 'path'

const ICONS_DIR = 'public/icons'
const SOURCE_IMAGE = 'public/icons/memorylane.png'

const SIZES = [
  { size: 192, filename: 'icon-192x192.png' },
  { size: 512, filename: 'icon-512x512.png' },
]

async function generateIcons() {
  try {
    // Create icons directory if it doesn't exist
    await fs.mkdir(ICONS_DIR, { recursive: true })

    for (const { size, filename } of SIZES) {
      await sharp(SOURCE_IMAGE)
        .resize(size, size, {
          fit: 'contain',
          background: { r: 255, g: 255, b: 255, alpha: 0 },
        })
        .png()
        .toFile(path.join(ICONS_DIR, filename))

      console.log(`Generated ${filename}`)
    }

    console.log('PWA icons generated successfully!')
  } catch (error) {
    console.error('Error generating PWA icons:', error)
    process.exit(1)
  }
}

generateIcons()
