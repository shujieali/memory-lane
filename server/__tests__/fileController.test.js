const { deleteFiles } = require('../controllers/fileController')
const { StorageFactory } = require('../services/storage/StorageFactory')

jest.mock('../services/storage/StorageFactory', () => ({
  StorageFactory: {
    getInstance: jest.fn(),
  },
}))

describe('File Controller', () => {
  let req
  let res
  let mockStorageProvider

  beforeEach(() => {
    req = {
      body: {},
      user: {
        userId: '1',
      },
    }
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    }

    mockStorageProvider = {
      generateUploadUrl: jest.fn(),
      deleteFiles: jest.fn(),
    }

    StorageFactory.getInstance.mockReturnValue(mockStorageProvider)
    jest.clearAllMocks()
  })

  describe('deleteFiles', () => {
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
  })
})
