const express = require('express')
const { body } = require('express-validator')
const { sendAnonymousEmail } = require('../controllers/emailController')
const { validateRequest } = require('../utils/validation')

const router = express.Router()

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
