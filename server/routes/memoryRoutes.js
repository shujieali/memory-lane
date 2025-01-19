const express = require('express')
const { query, param, body } = require('express-validator')
const {
  getMemories,
  createMemory,
  updateMemory,
  deleteMemory,
  toggleFavorite,
  getMemory,
  getRandomMemories,
  getAllMemories,
  getPublicMemory,
  getPublicMemories,
} = require('../controllers/memoryController')
const { authenticateToken } = require('../utils/auth')
const { validateRequest } = require('../utils/validation')

const router = express.Router()

router.get(
  '/all',
  authenticateToken,
  [
    query('user_id').notEmpty(),
    query('search').optional().isString(),
    query('sort').optional().isString().isIn(['title', 'timestamp']),
    query('order').optional().isString().isIn(['asc', 'desc']),
  ],
  validateRequest,
  getAllMemories,
)

router.get(
  '/random',
  authenticateToken,
  [query('user_id').notEmpty()],
  validateRequest,
  getRandomMemories,
)

router.get(
  '/:id',
  authenticateToken,
  [param('id').isInt()],
  validateRequest,
  getMemory,
)

router.put(
  '/:id',
  authenticateToken,
  [
    param('id').isInt(),
    body('title').trim().notEmpty(),
    body('description').trim().notEmpty(),
    body('image_urls').isArray(),
    body('timestamp').isISO8601(),
    body('tags').optional().isArray(),
  ],
  validateRequest,
  updateMemory,
)

router.delete(
  '/:id',
  authenticateToken,
  [param('id').isInt()],
  validateRequest,
  deleteMemory,
)

router.post(
  '/:id/favorite',
  authenticateToken,
  [param('id').isInt()],
  validateRequest,
  toggleFavorite,
)
router.get(
  '/',
  authenticateToken,
  [
    query('user_id').notEmpty(),
    query('page').isInt({ min: 1 }).optional(),
    query('search').optional().isString(),
    query('sort').optional().isString().isIn(['title', 'timestamp']),
    query('order').optional().isString().isIn(['asc', 'desc']),
  ],
  validateRequest,
  getMemories,
)

router.post(
  '/',
  authenticateToken,
  [
    body('user_id').notEmpty(),
    body('title').trim().notEmpty(),
    body('description').trim().notEmpty(),
    body('image_urls').isArray(),
    body('timestamp').isISO8601(),
    body('tags').optional().isArray(),
  ],
  validateRequest,
  createMemory,
)

router.get(
  '/public/:public_id',
  [param('public_id').isUUID()],
  validateRequest,
  getPublicMemory,
)

router.get(
  '/public/user/:user_id',
  [param('user_id').notEmpty()],
  validateRequest,
  getPublicMemories,
)

module.exports = router
