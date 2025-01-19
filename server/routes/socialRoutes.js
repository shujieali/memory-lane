const express = require('express')
const { param } = require('express-validator')
const { handleSocialShare } = require('../controllers/seoController')
const { validateRequest } = require('../utils/validation')
const socialBotDetector = require('../middleware/socialBotDetector')

const router = express.Router()

/**
 * @swagger
 * tags:
 *   name: Social
 *   description: Social media sharing and SEO operations
 */

/**
 * @swagger
 * /social/{type}/{id}:
 *   get:
 *     summary: Handle social media sharing metadata
 *     description: Returns appropriate metadata for social media platforms when sharing memories or memory lanes
 *     tags: [Social]
 *     parameters:
 *       - in: path
 *         name: type
 *         required: true
 *         schema:
 *           type: string
 *           enum: [memory, lane]
 *         description: Type of content being shared
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the memory or memory lane
 *     responses:
 *       200:
 *         description: HTML page with appropriate social media meta tags
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *               example: |
 *                 <!DOCTYPE html>
 *                 <html>
 *                   <head>
 *                     <meta property="og:title" content="Memory Title">
 *                     <meta property="og:description" content="Memory Description">
 *                     <meta property="og:image" content="https://example.com/image.jpg">
 *                   </head>
 *                 </html>
 *       404:
 *         description: Content not found
 */
router.get(
  '/:type/:id',
  socialBotDetector,
  [param('type').isIn(['memory', 'lane']), param('id').notEmpty()],
  validateRequest,
  handleSocialShare,
)

module.exports = router
