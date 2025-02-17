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

/**
 * @swagger
 * components:
 *   schemas:
 *     Memory:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         user_id:
 *           type: string
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         image_urls:
 *           type: array
 *           items:
 *             type: string
 *         timestamp:
 *           type: string
 *           format: date-time
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *         is_favorite:
 *           type: boolean
 */

/**
 * @swagger
 * /memories/all:
 *   get:
 *     summary: Get all memories for a user
 *     security:
 *       - bearerAuth: []
 *     tags: [Memories]
 *     parameters:
 *       - in: query
 *         name: user_id
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [title, timestamp]
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *     responses:
 *       200:
 *         description: List of all memories
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Memory'
 */
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

/**
 * @swagger
 * /memories/random:
 *   get:
 *     summary: Get random memories for a user
 *     security:
 *       - bearerAuth: []
 *     tags: [Memories]
 *     parameters:
 *       - in: query
 *         name: user_id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of random memories
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Memory'
 */
router.get(
  '/random',
  authenticateToken,
  [query('user_id').notEmpty()],
  validateRequest,
  getRandomMemories,
)

/**
 * @swagger
 * /memories/{id}:
 *   get:
 *     summary: Get a specific memory
 *     security:
 *       - bearerAuth: []
 *     tags: [Memories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Memory details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Memory'
 *       404:
 *         description: Memory not found
 */
router.get(
  '/:id',
  authenticateToken,
  [param('id').isInt()],
  validateRequest,
  getMemory,
)

/**
 * @swagger
 * /memories/{id}:
 *   put:
 *     summary: Update a memory
 *     security:
 *       - bearerAuth: []
 *     tags: [Memories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - image_urls
 *               - timestamp
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               image_urls:
 *                 type: array
 *                 items:
 *                   type: string
 *               timestamp:
 *                 type: string
 *                 format: date-time
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Memory updated successfully
 *       404:
 *         description: Memory not found
 */
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

/**
 * @swagger
 * /memories/{id}:
 *   delete:
 *     summary: Delete a memory
 *     security:
 *       - bearerAuth: []
 *     tags: [Memories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Memory deleted successfully
 *       404:
 *         description: Memory not found
 */
router.delete(
  '/:id',
  authenticateToken,
  [param('id').isInt()],
  validateRequest,
  deleteMemory,
)

/**
 * @swagger
 * /memories/{id}/favorite:
 *   post:
 *     summary: Toggle favorite status of a memory
 *     security:
 *       - bearerAuth: []
 *     tags: [Memories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Favorite status toggled successfully
 *       404:
 *         description: Memory not found
 */
router.post(
  '/:id/favorite',
  authenticateToken,
  [param('id').isInt()],
  validateRequest,
  toggleFavorite,
)

/**
 * @swagger
 * /memories:
 *   get:
 *     summary: Get paginated memories
 *     security:
 *       - bearerAuth: []
 *     tags: [Memories]
 *     parameters:
 *       - in: query
 *         name: user_id
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [title, timestamp]
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *     responses:
 *       200:
 *         description: List of memories with pagination
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 memories:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Memory'
 *                 total:
 *                   type: integer
 *                 totalPages:
 *                   type: integer
 *                 currentPage:
 *                   type: integer
 */
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

/**
 * @swagger
 * /memories:
 *   post:
 *     summary: Create a new memory
 *     security:
 *       - bearerAuth: []
 *     tags: [Memories]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user_id
 *               - title
 *               - description
 *               - image_urls
 *               - timestamp
 *             properties:
 *               user_id:
 *                 type: string
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               image_urls:
 *                 type: array
 *                 items:
 *                   type: string
 *               timestamp:
 *                 type: string
 *                 format: date-time
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Memory created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Memory'
 */
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

/**
 * @swagger
 * /memories/public/{public_id}:
 *   get:
 *     summary: Get a publicly shared memory
 *     tags: [Public Memories]
 *     parameters:
 *       - in: path
 *         name: public_id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Public memory details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Memory'
 *       404:
 *         description: Memory not found
 */
router.get(
  '/public/:public_id',
  [param('public_id').isUUID()],
  validateRequest,
  getPublicMemory,
)

/**
 * @swagger
 * /memories/public/user/{user_id}:
 *   get:
 *     summary: Get all public memories for a user
 *     tags: [Public Memories]
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of public memories
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Memory'
 */
router.get(
  '/public/user/:user_id',
  [param('user_id').notEmpty()],
  validateRequest,
  getPublicMemories,
)

module.exports = router
