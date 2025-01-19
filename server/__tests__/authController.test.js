const { register, login } = require('../controllers/authController')
const db = require('../utils/db')
const { hash } = require('bcrypt')

// Mock database module
jest.mock('../utils/db')

describe('Auth Controller', () => {
  let req
  let res

  beforeEach(() => {
    req = {
      body: {
        email: 'test@example.com',
        password: 'Password123!',
        name: 'Test User',
      },
    }
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    }
    jest.clearAllMocks()
  })

  describe('register', () => {
    it('successfully registers a new user', async () => {
      // Mock user creation
      db.run.mockResolvedValueOnce({ lastID: 1 })
      db.get.mockResolvedValueOnce(null) // No existing user

      await register(req, res)

      expect(db.run).toHaveBeenCalledTimes(1)
      expect(res.status).toHaveBeenCalledWith(201)
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          user: expect.objectContaining({
            id: expect.any(String),
            email: req.body.email,
            name: req.body.name,
          }),
          token: expect.any(String),
        }),
      )
    })

    it('handles existing email', async () => {
      // Mock existing user
      db.get.mockResolvedValueOnce({ id: 1, email: req.body.email })

      await register(req, res)

      expect(res.status).toHaveBeenCalledWith(409)
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: expect.any(String),
        }),
      )
    })

    it('handles database errors', async () => {
      db.get.mockRejectedValueOnce(new Error('Database error'))

      await register(req, res)

      expect(res.status).toHaveBeenCalledWith(500)
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: expect.any(String),
        }),
      )
    })
  })

  describe('login', () => {
    beforeEach(() => {
      req.body = {
        email: 'test@example.com',
        password: 'Password123!',
      }
    })

    it('successfully logs in a user', async () => {
      const hashedPassword = await hash(req.body.password, 10)
      // Mock existing user with hashed password
      db.get.mockResolvedValueOnce({
        id: 1,
        email: req.body.email,
        password: hashedPassword,
        name: 'Test User',
      })

      await login(req, res)

      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          user: expect.objectContaining({
            id: expect.any(String),
            email: req.body.email,
          }),
          token: expect.any(String),
        }),
      )
    })

    it('handles invalid credentials', async () => {
      // Mock non-existent user
      db.get.mockResolvedValueOnce(null)

      await login(req, res)

      expect(res.status).toHaveBeenCalledWith(401)
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: expect.any(String),
        }),
      )
    })

    it('handles incorrect password', async () => {
      const hashedPassword = await hash('different-password', 10)
      // Mock existing user with different password
      db.get.mockResolvedValueOnce({
        id: 1,
        email: req.body.email,
        password: hashedPassword,
        name: 'Test User',
      })

      await login(req, res)

      expect(res.status).toHaveBeenCalledWith(401)
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: expect.any(String),
        }),
      )
    })

    it('handles database errors', async () => {
      db.get.mockRejectedValueOnce(new Error('Database error'))

      await login(req, res)

      expect(res.status).toHaveBeenCalledWith(500)
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: expect.any(String),
        }),
      )
    })
  })
})
