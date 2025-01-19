const SOCIAL_MEDIA_BOTS = [
  'facebookexternalhit', // Facebook
  'WhatsApp',
  'Twitterbot', // X/Twitter
  'LinkedInBot',
  'Pinterest',
  'TelegramBot',
  'redditbot', // Reddit
  'Kakao', // KakaoTalk
  'Line', // Line
  'Tumblr',
  'Mail.RU_Bot', // Email preview bots
  'Google-Mail-RFC822',
  'bingbot', // Search engines that may show previews
  'Googlebot',
]

function isSocialMediaBot(userAgent) {
  return exports.SOCIAL_MEDIA_BOTS.some((bot) =>
    userAgent.toLowerCase().includes(bot.toLowerCase()),
  )
}

function socialBotDetector(req, res, next) {
  const userAgent = req.get('user-agent') || ''
  req.isSocialBot = isSocialMediaBot(userAgent)
  next()
}

exports.SOCIAL_MEDIA_BOTS = SOCIAL_MEDIA_BOTS
module.exports = socialBotDetector
