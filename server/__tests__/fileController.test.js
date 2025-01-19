const { getUploadUrl, deleteFiles } = require('../controllers/fileController')
const { StorageFactory } = require('../services/storage/StorageFactory')

// Mock the StorageFactory and its providers
jest.mock('../services/storage/StorageFactory')

describe('File Controller', () => {
  let req
  let res
  let mockStorageProvider

  beforeEach(() => {
    req = {
      body: {},
    }
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    }

    // Create mock storage provider
    mockStorageProvider = {
      generateUploadUrl: jest.fn(),
      deleteFiles: jest.fn(),
    }

    // Mock StorageFactory to return our mock provider
    StorageFactory.getProvider.mockReturnValue(mockStorageProvider)

    jest.clearAllMocks()
  })

  describe('getUploadUrl', () => {
    it('generates upload URL successfully', async () => {
      const mockResponse = {
        url: 'https://example.com/upload',
        fields: { key: 'test-file' },
        fileUrl: 'https://example.com/test-file',
      }

      mockStorageProvider.generateUploadUrl.mockResolvedValueOnce(mockResponse)

      await getUploadUrl(req, res)

      expect(mockStorageProvider.generateUploadUrl).toHaveBeenCalled()
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          uploadUrl: mockResponse.url,
          fields: mockResponse.fields,
          fileUrl: mockResponse.fileUrl,
        }),
      )
    })

    it('handles provider errors', async () => {
      mockStorageProvider.generateUploadUrl.mockRejectedValueOnce(
        new Error('Provider error'),
      )

      await getUploadUrl(req, res)

      expect(res.status).toHaveBeenCalledWith(500)
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: expect.any(String),
        }),
      )
    })
  })

  describe('deleteFiles', () => {
    beforeEach(() => {
      req.body = {
        keys: ['file1.jpg', 'file2.jpg'],
      }
    })

    it('deletes files successfully', async () => {
      mockStorageProvider.deleteFiles.mockResolvedValueOnce()

      await deleteFiles(req, res)

      expect(mockStorageProvider.deleteFiles).toHaveBeenCalledWith(
        req.body.keys,
      )
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: expect.any(String),
        }),
      )
    })

    it('handles missing keys in request', async () => {
      req.body = {}

      await deleteFiles(req, res)

      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: expect.any(String),
        }),
      )
    })

    it('handles empty keys array', async () => {
      req.body.keys = []

      await deleteFiles(req, res)

      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: expect.any(String),
        }),
      )
    })

    it('handles provider deletion errors', async () => {
      mockStorageProvider.deleteFiles.mockRejectedValueOnce(
        new Error('Deletion failed'),
      )

      await deleteFiles(req, res)

      expect(res.status).toHaveBeenCalledWith(500)
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: expect.any(String),
        }),
      )
    })
  })
})
