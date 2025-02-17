const express = require('express')
const multer = require('multer')
const path = require('path')
const fs = require('fs')
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
 *         url:
 *           type: string
 *           description: Upload endpoint URL
 *           example: "http://localhost:4001/api/storage/upload"
 *         fields:
 *           type: object
 *           description: Fields to include in the upload form
 *           properties:
 *             key:
 *               type: string
 *               description: Unique file identifier
 *               example: "user123/1234567890_image.jpg"
 *             userId:
 *               type: string
 *               description: ID of the user uploading the file
 *               example: "user123"
 *             timestamp:
 *               type: number
 *               description: Current timestamp (for URL expiry)
 *               example: 1737503356848
 *             contentType:
 *               type: string
 *               description: MIME type of the file
 *               example: "image/jpeg"
 *         fileUrl:
 *           type: string
 *           description: URL where the file will be accessible after upload
 *           example: "http://localhost:4001/uploads/user123/1234567890_image.jpg"
 */

/**
 * @swagger
 * /api/storage/url:
 *   get:
 *     summary: Get a pre-signed URL for file upload
 *     description: Get upload URL and form fields for local storage. URL expires in 5 minutes.
 *     security:
 *       - bearerAuth: []
 *     tags: [Storage]
 *     parameters:
 *       - in: query
 *         name: contentType
 *         schema:
 *           type: string
 *         description: MIME type of the file to be uploaded
 *         example: "image/jpeg"
 *     responses:
 *       200:
 *         description: Upload URL and fields generated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UploadUrlResponse'
 *       500:
 *         description: Failed to generate upload URL
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Failed to generate upload URL"
 */
router.get('/url', authenticateToken, getUploadUrl)

/**
 * @swagger
 * /api/storage/delete:
 *   post:
 *     summary: Delete files from storage
 *     description: Delete one or more files using either file keys or complete URLs.
 *     security:
 *       - bearerAuth: []
 *     tags: [Storage]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             oneOf:
 *               - required:
 *                 - keys
 *                 properties:
 *                   keys:
 *                     type: array
 *                     items:
 *                       type: string
 *                     description: Array of file keys in format "userId/filename"
 *                     example: ["user123/1234567890_image.jpg"]
 *               - required:
 *                 - fileUrls
 *                 properties:
 *                   fileUrls:
 *                     type: array
 *                     items:
 *                       type: string
 *                     description: Array of complete file URLs
 *                     example: ["http://localhost:4001/uploads/user123/1234567890_image.jpg"]
 *     responses:
 *       200:
 *         description: Files deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 deletedKeys:
 *                   type: array
 *                   items:
 *                     type: string
 *                   description: Array of deleted file keys
 *                   example: ["user123/1234567890_image.jpg"]
 *       400:
 *         description: Invalid request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Request must include either keys or fileUrls array"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Failed to delete files"
 */
router.post('/delete', authenticateToken, deleteFiles)

/**
 * @swagger
 * /api/storage/upload:
 *   post:
 *     summary: Direct file upload (local storage only)
 *     description: Upload a file with required metadata. All fields must match those provided by getUploadUrl.
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
 *               - userId
 *               - timestamp
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: The file to upload
 *               key:
 *                 type: string
 *                 description: File key in format "userId/filename"
 *                 example: "user123/1234567890_image.jpg"
 *               userId:
 *                 type: string
 *                 description: ID of the user uploading the file
 *                 example: "user123"
 *               timestamp:
 *                 type: string
 *                 description: Timestamp when the upload URL was generated (expires in 5 minutes)
 *                 example: "1737503356848"
 *               contentType:
 *                 type: string
 *                 description: MIME type of the file (optional)
 *                 example: "image/jpeg"
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
 *                   example: true
 *                 fileUrl:
 *                   type: string
 *                   description: URL to access the uploaded file
 *                   example: "http://localhost:4001/uploads/user123/1234567890_image.jpg"
 *                 key:
 *                   type: string
 *                   description: File key used for future operations
 *                   example: "user123/1234567890_image.jpg"
 *                 userId:
 *                   type: string
 *                   description: ID of the user who uploaded the file
 *                   example: "user123"
 *       400:
 *         description: Invalid request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Missing required fields"
 *       403:
 *         description: Upload URL expired
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Upload URL expired"
 *       500:
 *         description: Upload failed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Upload failed: File was not saved properly"
 */
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    if (process.env.STORAGE_TYPE === 'local') {
      const uploadDir = process.env.LOCAL_STORAGE_PATH || 'uploads'
      const keyPath = path.dirname(req.body.key)
      const fullPath = path.join(uploadDir, keyPath)

      // Create directory if it doesn't exist
      fs.mkdirSync(fullPath, { recursive: true })
      cb(null, fullPath)
    } else {
      cb(new Error('Direct upload only supported for local storage'))
    }
  },
  filename: (req, file, cb) => {
    // Use the filename from the key
    cb(null, path.basename(req.body.key))
  },
})

const upload = multer({
  storage,
  limits: {
    fileSize: parseInt(process.env.S3_MAX_CONTENT_SIZE || '104857600'), // 100MB default
  },
})

router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file || !req.body.key || !req.body.userId || !req.body.timestamp) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    // Validate timestamp to prevent replay attacks
    const timestamp = parseInt(req.body.timestamp)
    const now = Date.now()
    if (isNaN(timestamp) || now - timestamp > 300000) {
      // 5 minutes expiry
      return res.status(403).json({ error: 'Upload URL expired' })
    }

    const baseUrl =
      process.env.BASE_URL || `http://localhost:${process.env.PORT || 4001}`
    const fileUrl = `${baseUrl}/uploads/${req.body.key}`

    // Verify file was saved
    const filePath = path.join(
      process.env.LOCAL_STORAGE_PATH || 'uploads',
      req.body.key,
    )
    if (!fs.existsSync(filePath)) {
      throw new Error('File was not saved properly')
    }

    res.json({
      success: true,
      fileUrl,
      key: req.body.key,
      userId: req.body.userId,
    })
  } catch (error) {
    console.error('Upload error:', error)
    res.status(500).json({ error: 'Upload failed: ' + error.message })
  }
})

module.exports = router
