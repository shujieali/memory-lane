const SOCIAL_MEDIA_BOTS = [
  'facebookexternalhit',
  'WhatsApp',
  'Twitterbot',
  'LinkedInBot',
  'Pinterest',
  'Slackbot',
  'Discordbot',
  'TelegramBot',
]

function isSocialMediaBot(userAgent) {
  return SOCIAL_MEDIA_BOTS.some((bot) =>
    userAgent.toLowerCase().includes(bot.toLowerCase()),
  )
}

function socialBotDetector(req, res, next) {
  const userAgent = req.get('user-agent') || ''
  req.isSocialBot = isSocialMediaBot(userAgent)
  next()
}

module.exports = socialBotDetector
