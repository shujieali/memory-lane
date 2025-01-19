const express = require('express')
const { param } = require('express-validator')
const { handleSocialShare } = require('../controllers/seoController')
const { validateRequest } = require('../utils/validation')
const socialBotDetector = require('../middleware/socialBotDetector')

const router = express.Router()

router.get(
  '/:type/:id',
  socialBotDetector,
  [param('type').isIn(['memory', 'lane']), param('id').notEmpty()],
  validateRequest,
  handleSocialShare,
)

module.exports = router
