const probe = require('probe-image-size')
const { getPublicMemory, getPublicMemories } = require('./memoryController')
const { SOCIAL_MEDIA_BOTS } = require('../middleware/socialBotDetector')

async function getImageDimensions(imageUrl) {
  try {
    const dimensions = await probe(imageUrl)
    return {
      width: dimensions.width,
      height: dimensions.height,
    }
  } catch (error) {
    console.error('Error getting image dimensions:', error)
    // Return default dimensions
    return { width: 1200, height: 630 }
  }
}

async function generateMetaTags(memory, baseUrl, dimensions) {
  const title = memory.title
  const description = memory.description

  // Ensure image URL is absolute
  let imageUrl = memory.image_urls?.[0] || `${baseUrl}/icons/memorylane.png`
  if (!imageUrl.startsWith('http')) {
    imageUrl = `${baseUrl}${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`
  }

  return `
    <!-- Essential Meta Tags -->
    <meta property="og:locale" content="en_US" />
    <meta property="og:title" content="${title}">
    <meta property="og:description" content="${description}">
    <meta property="og:image" content="${imageUrl}">
    <meta property="og:image:width" content="${dimensions.width}" />
    <meta property="og:image:height" content="${dimensions.height}" />
    <meta property="og:type" content="website">
    <meta property="og:site_name" content="Memory Lane">

    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="article" />
    <meta property="og:site_name" content="Memory Lane" />
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${description}" />
    <meta property="og:image" content="${imageUrl}" />
    <meta property="og:image:secure_url" content="${imageUrl}" />
    <meta property="og:image:type" content="image/jpeg" />

    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:site" content="@memorylane" />
    <meta name="twitter:title" content="${title}" />
    <meta name="twitter:description" content="${description}" />
    <meta name="twitter:image" content="${imageUrl}" />
    <meta name="twitter:domain" content="memorylane.com" />

    <!-- Schema.org for Google -->
    <meta itemprop="name" content="${title}" />
    <meta itemprop="description" content="${description}" />
    <meta itemprop="image" content="${imageUrl}" />

    <!-- LinkedIn -->
    <meta property="linkedin:title" content="${title}" />
    <meta property="linkedin:description" content="${description}" />
    <meta property="linkedin:image" content="${imageUrl}" />

    <!-- Pinterest -->
    <meta property="pinterest:title" content="${title}" />
    <meta property="pinterest:description" content="${description}" />
    <meta property="pinterest:image" content="${imageUrl}" />
    <meta property="pinterest:media" content="${imageUrl}" />
    <meta name="pinterest" content="nopin" />

    <!-- KakaoTalk -->
    <meta property="kakao:title" content="${title}" />
    <meta property="kakao:description" content="${description}" />
    <meta property="kakao:image" content="${imageUrl}" />

    <!-- Additional social platforms -->
    <meta property="article:published_time" content="${new Date().toISOString()}" />
    <link rel="image_src" href="${imageUrl}" />
  `
}

function generateHtml(metaTags, redirectUrl) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Memory Lane</title>
        ${metaTags}
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <script>
          // Import bot list from socialBotDetector
          const SOCIAL_MEDIA_BOTS = ${SOCIAL_MEDIA_BOTS};
          // Check if current user agent matches any bot
          const isBot = SOCIAL_MEDIA_BOTS.some(bot =>
            navigator.userAgent.toLowerCase().includes(bot.toLowerCase())
          ) || navigator.userAgent.toLowerCase().includes('bot');

          // Redirect non-bot users to the actual app
          if (!isBot) {
            window.location.href = '${redirectUrl}';
          }
        </script>
      </head>
      <body>
        <div style="display: flex; justify-content: center; align-items: center; min-height: 100vh;">
          <h1>Redirecting to Memory Lane...</h1>
        </div>
      </body>
    </html>
  `
}

async function handleSocialShare(req, res) {
  try {
    const baseUrl = process.env.BASE_URL || 'http://localhost:4001'
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173'
    const { type, id } = req.params

    let memory
    let redirectUrl

    if (type === 'memory') {
      const mockReq = { params: { public_id: id } }
      const mockRes = {
        json: (data) => data,
        status: () => mockRes,
      }
      memory = await new Promise((resolve) => {
        getPublicMemory(mockReq, mockRes)
          .then((data) => resolve(data))
          .catch(() => resolve(null))
      })
      redirectUrl = `${frontendUrl}/shared/memory/${id}`
    } else if (type === 'lane') {
      const mockReq = { params: { user_id: id }, query: {} }
      const mockRes = {
        json: (data) => data,
        status: () => mockRes,
      }
      const response = await new Promise((resolve) => {
        return getPublicMemories(mockReq, mockRes)
          .then((data) => {
            resolve(data)
          })
          .catch(() => {
            resolve({ memories: [], user: null })
          })
      })
      const memories = response.memories
      const user = response.user
      memory = {
        title: `${user.name}'s Memory Lane`,
        description: `Check out this collection of ${memories.length} memories`,
        image_urls: memories[0]?.image_urls || [],
      }
      redirectUrl = `${frontendUrl}/shared/lane/${id}`
    } else {
      throw new Error('Invalid share type')
    }

    if (!memory) {
      throw new Error('Memory not found')
    }
    const dimensions = await getImageDimensions(memory.image_urls[0])
    const metaTags = await generateMetaTags(memory, baseUrl, dimensions)
    const html = generateHtml(metaTags, redirectUrl)

    if (req.isSocialBot) {
      res.send(html)
    } else {
      res.redirect(redirectUrl)
    }
  } catch (error) {
    console.error('Error in handleSocialShare:', error)
    res.status(404).send('Not found')
  }
}

module.exports = {
  handleSocialShare,
}
