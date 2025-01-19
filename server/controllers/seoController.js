const { getPublicMemory, getPublicMemories } = require('./memoryController')
const { SOCIAL_MEDIA_BOTS } = require('../middleware/socialBotDetector')

async function generateMetaTags(memory, baseUrl) {
  const title = memory.title
  const description = memory.description

  // Ensure image URL is absolute
  let imageUrl = memory.image_urls?.[0] || `${baseUrl}/icons/memorylane.png`
  if (!imageUrl.startsWith('http')) {
    imageUrl = `${baseUrl}${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`
  }

  return `
    <!-- Primary Meta Tags -->
    <meta name="title" content="${title}" />
    <meta name="description" content="${description}" />

    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="article" />
    <meta property="og:site_name" content="Memory Lane" />
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${description}" />
    <meta property="og:image" content="${imageUrl}" />
    <meta property="og:image:secure_url" content="${imageUrl}" />
    <meta property="og:image:type" content="image/jpeg" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />

    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:site" content="@memorylane" />
    <meta name="twitter:title" content="${title}" />
    <meta name="twitter:description" content="${description}" />
    <meta name="twitter:image" content="${imageUrl}" />

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

    const metaTags = await generateMetaTags(memory, baseUrl)
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
