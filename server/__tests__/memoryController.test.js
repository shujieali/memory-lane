const {
  getMemories,
  createMemory,
  getMemory,
} = require('../controllers/memoryController')
const db = require('../utils/db')

jest.mock('../utils/db')
jest.mock('../controllers/fileController')

describe('Memory Controller', () => {
  let req
  let res

  beforeEach(() => {
    req = {
      params: {},
      query: {
        user_id: '1',
        page: 1,
        limit: 10,
      },
      body: {},
      user: {
        userId: '1',
      },
    }
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    }
    jest.clearAllMocks()
  })

  describe('getMemories', () => {
    it('returns memories list', async () => {
      const mockMemories = [
        {
          id: 1,
          title: 'Memory 1',
          description: 'Test',
          image_urls: JSON.stringify(['test.jpg']),
          tags: JSON.stringify(['tag1']),
        },
      ]

      db.all.mockImplementation((query, params, callback) => {
        callback(null, mockMemories)
      })

      db.get.mockImplementation((query, params, callback) => {
        callback(null, { count: 1 })
      })

      await getMemories(req, res)

      expect(res.json).toHaveBeenCalledWith({
        memories: expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(Number),
            title: expect.any(String),
          }),
        ]),
      })
    })
  })

  describe('createMemory', () => {
    it('creates memory successfully', async () => {
      req.body = {
        user_id: '1',
        title: 'Test Memory',
        description: 'Test Description',
        image_urls: ['test.jpg'],
        timestamp: new Date().toISOString(),
      }

      db.run.mockImplementation((query, params, callback) => {
        callback(null)
      })

      await createMemory(req, res)

      expect(res.status).toHaveBeenCalledWith(201)
    })
  })

  describe('getMemory', () => {
    it('returns memory by id', async () => {
      const mockMemory = {
        id: 1,
        title: 'Test',
        user_id: '1',
        image_urls: JSON.stringify(['test.jpg']),
        tags: JSON.stringify(['tag1']),
      }
      req.params.id = '1'

      db.get.mockImplementation((query, params, callback) => {
        callback(null, mockMemory)
      })

      await getMemory(req, res)

      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          id: expect.any(Number),
          title: expect.any(String),
        }),
      )
    })
  })
})
