const express = require('express')
const multer = require('multer')
const { getUploadUrl, deleteFiles } = require('../controllers/fileController')
const { authenticateToken } = require('../utils/auth')

const router = express.Router()

/**
 * @swagger
 * components:
 *   schemas:
 *     UploadUrlResponse:
 *       type: object
 *       properties:
 *         uploadUrl:
 *           type: string
 *           description: Pre-signed URL for file upload
 *         key:
 *           type: string
 *           description: File key/path in storage
 */

/**
 * @swagger
 * /api/storage/url:
 *   get:
 *     summary: Get a pre-signed URL for file upload
 *     security:
 *       - bearerAuth: []
 *     tags: [Storage]
 *     responses:
 *       200:
 *         description: Upload URL generated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UploadUrlResponse'
 */
router.get('/url', authenticateToken, getUploadUrl)

/**
 * @swagger
 * /api/storage/delete:
 *   post:
 *     summary: Delete files from storage
 *     security:
 *       - bearerAuth: []
 *     tags: [Storage]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - keys
 *             properties:
 *               keys:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Array of file keys/paths to delete
 *     responses:
 *       200:
 *         description: Files deleted successfully
 *       400:
 *         description: Invalid request
 */
router.post('/delete', authenticateToken, deleteFiles)

/**
 * @swagger
 * /api/storage/upload:
 *   post:
 *     summary: Direct file upload (local storage only)
 *     security:
 *       - bearerAuth: []
 *     tags: [Storage]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - file
 *               - key
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *               key:
 *                 type: string
 *     responses:
 *       200:
 *         description: File uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 fileUrl:
 *                   type: string
 */
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    if (process.env.STORAGE_TYPE === 'local') {
      const uploadDir = process.env.LOCAL_STORAGE_PATH || 'uploads'
      const fullPath = `${uploadDir}/${req.body.key}`
      cb(null, fullPath)
    } else {
      cb(new Error('Direct upload only supported for local storage'))
    }
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname)
  },
})

const upload = multer({
  storage,
  limits: {
    fileSize: parseInt(process.env.S3_MAX_CONTENT_SIZE || '104857600'), // 100MB default
  },
})

router.post('/upload', upload.single('file'), (req, res) => {
  try {
    const baseUrl =
      process.env.BASE_URL || `http://localhost:${process.env.PORT || 4001}`
    const fileUrl = `${baseUrl}/uploads/${req.body.key}`
    res.json({ success: true, fileUrl })
  } catch (error) {
    console.error('Upload error:', error)
    res.status(500).json({ error: 'Upload failed' })
  }
})

module.exports = router
