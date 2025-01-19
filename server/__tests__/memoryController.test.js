const {
  getMemories,
  createMemory,
  updateMemory,
  deleteMemory,
  toggleFavorite,
  getMemory,
} = require('../controllers/memoryController')
const db = require('../utils/db')

// Mock database module
jest.mock('../utils/db')

describe('Memory Controller', () => {
  let req
  let res

  beforeEach(() => {
    req = {
      params: {},
      query: {},
      body: {},
    }
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    }
    jest.clearAllMocks()
  })

  describe('getMemories', () => {
    it('returns paginated memories', async () => {
      const mockMemories = [
        { id: 1, title: 'Memory 1' },
        { id: 2, title: 'Memory 2' },
      ]
      const mockCount = [{ count: 10 }]

      db.all.mockResolvedValueOnce(mockMemories)
      db.get.mockResolvedValueOnce(mockCount[0])

      req.query = {
        user_id: '1',
        page: '1',
        limit: '10',
      }

      await getMemories(req, res)

      expect(res.json).toHaveBeenCalledWith({
        memories: mockMemories,
        total: 10,
        currentPage: 1,
        totalPages: 1,
      })
    })

    it('handles database errors', async () => {
      db.all.mockRejectedValueOnce(new Error('Database error'))
      req.query.user_id = '1'

      await getMemories(req, res)

      expect(res.status).toHaveBeenCalledWith(500)
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: expect.any(String),
        }),
      )
    })
  })

  describe('createMemory', () => {
    beforeEach(() => {
      req.body = {
        user_id: '1',
        title: 'New Memory',
        description: 'Test description',
        image_urls: ['https://example.com/image.jpg'],
        timestamp: '2024-01-20T00:00:00Z',
      }
    })

    it('creates a new memory successfully', async () => {
      db.run.mockResolvedValueOnce({ lastID: 1 })
      db.get.mockResolvedValueOnce({
        id: 1,
        ...req.body,
      })

      await createMemory(req, res)

      expect(res.status).toHaveBeenCalledWith(201)
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          id: expect.any(Number),
          title: req.body.title,
        }),
      )
    })

    it('handles validation errors', async () => {
      delete req.body.title

      await createMemory(req, res)

      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: expect.any(String),
        }),
      )
    })
  })

  describe('updateMemory', () => {
    beforeEach(() => {
      req.params.id = '1'
      req.body = {
        title: 'Updated Memory',
        description: 'Updated description',
        image_urls: ['https://example.com/new-image.jpg'],
        timestamp: '2024-01-20T00:00:00Z',
      }
    })

    it('updates memory successfully', async () => {
      db.get.mockResolvedValueOnce({ id: 1 }) // Memory exists
      db.run.mockResolvedValueOnce({})
      db.get.mockResolvedValueOnce({
        id: 1,
        ...req.body,
      })

      await updateMemory(req, res)

      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 1,
          title: req.body.title,
        }),
      )
    })

    it('handles non-existent memory', async () => {
      db.get.mockResolvedValueOnce(null)

      await updateMemory(req, res)

      expect(res.status).toHaveBeenCalledWith(404)
    })
  })

  describe('deleteMemory', () => {
    it('deletes memory successfully', async () => {
      req.params.id = '1'
      db.get.mockResolvedValueOnce({ id: 1 }) // Memory exists
      db.run.mockResolvedValueOnce({})

      await deleteMemory(req, res)

      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: expect.any(String),
        }),
      )
    })

    it('handles non-existent memory', async () => {
      req.params.id = '999'
      db.get.mockResolvedValueOnce(null)

      await deleteMemory(req, res)

      expect(res.status).toHaveBeenCalledWith(404)
    })
  })

  describe('toggleFavorite', () => {
    beforeEach(() => {
      req.params.id = '1'
    })

    it('toggles favorite status successfully', async () => {
      const mockMemory = { id: 1, is_favorite: false }
      db.get.mockResolvedValueOnce(mockMemory)
      db.run.mockResolvedValueOnce({})
      db.get.mockResolvedValueOnce({ ...mockMemory, is_favorite: true })

      await toggleFavorite(req, res)

      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          is_favorite: true,
        }),
      )
    })

    it('handles non-existent memory', async () => {
      db.get.mockResolvedValueOnce(null)

      await toggleFavorite(req, res)

      expect(res.status).toHaveBeenCalledWith(404)
    })
  })

  describe('getMemory', () => {
    it('returns single memory by id', async () => {
      const mockMemory = {
        id: 1,
        title: 'Test Memory',
        description: 'Test Description',
      }

      req.params.id = '1'
      db.get.mockResolvedValueOnce(mockMemory)

      await getMemory(req, res)

      expect(res.json).toHaveBeenCalledWith(mockMemory)
    })

    it('handles non-existent memory', async () => {
      req.params.id = '999'
      db.get.mockResolvedValueOnce(null)

      await getMemory(req, res)

      expect(res.status).toHaveBeenCalledWith(404)
    })
  })
})
