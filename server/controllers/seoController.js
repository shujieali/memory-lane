const { getPublicMemory, getPublicMemories } = require('./memoryController')

async function generateMetaTags(memory, baseUrl) {
  const title = memory.title
  const description = memory.description
  const imageUrl = memory.image_urls?.[0] || `${baseUrl}/icons/memorylane.png`

  return `
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${description}" />
    <meta property="og:image" content="${imageUrl}" />
    <meta property="og:type" content="article" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${title}" />
    <meta name="twitter:description" content="${description}" />
    <meta name="twitter:image" content="${imageUrl}" />
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
          // Redirect non-bot users to the actual app
          if (!navigator.userAgent.includes('bot') &&
              !navigator.userAgent.includes('facebookexternalhit') &&
              !navigator.userAgent.includes('WhatsApp')) {
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
      memory = await getPublicMemory({ params: { public_id: id } })
      redirectUrl = `${frontendUrl}/public/memory/${id}`
    } else if (type === 'lane') {
      const memories = await getPublicMemories({ params: { user_id: id } })
      memory = {
        title: 'Memory Lane',
        description: `Check out this collection of ${memories.length} memories`,
        image_urls: memories[0]?.image_urls || [],
      }
      redirectUrl = `${frontendUrl}/public/lane/${id}`
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
