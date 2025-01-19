const express = require('express')
const { body } = require('express-validator')
const { register, login } = require('../controllers/authController')
const { validateRequest } = require('../utils/validation')

const router = express.Router()

router.post(
  '/register',
  [
    body('email').isEmail().normalizeEmail(),
    body('password')
      .isLength({ min: 8 })
      .matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/)
      .withMessage(
        'Password must be at least 8 characters long and include at least one letter, one number, and one special character',
      ),
    body('name').trim().notEmpty(),
  ],
  validateRequest,
  register,
)

router.post(
  '/login',
  [body('email').isEmail().normalizeEmail(), body('password').notEmpty()],
  validateRequest,
  login,
)

module.exports = router
