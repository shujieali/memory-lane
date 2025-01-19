const express = require('express')
const { body } = require('express-validator')
const { sendAnonymousEmail } = require('../controllers/emailController')
const { validateRequest } = require('../utils/validation')

const router = express.Router()

/**
 * @swagger
 * tags:
 *   name: Email
 *   description: Email sending operations
 */

/**
 * @swagger
 * /email/send-anonymous-email:
 *   post:
 *     summary: Send an anonymous email
 *     tags: [Email]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - title
 *               - description
 *               - url
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Recipient's email address
 *               title:
 *                 type: string
 *                 description: Email subject/title
 *               description:
 *                 type: string
 *                 description: Email content/description
 *               url:
 *                 type: string
 *                 description: URL to be included in the email
 *     responses:
 *       200:
 *         description: Email sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Email sending failed
 */
router.post(
  '/send-anonymous-email',
  [
    body('email').isEmail(),
    body('title').notEmpty(),
    body('description').notEmpty(),
    body('url').notEmpty(),
  ],
  validateRequest,
  sendAnonymousEmail,
)

module.exports = router
