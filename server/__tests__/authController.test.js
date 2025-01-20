const { login } = require('../controllers/authController')
const db = require('../utils/db')

jest.mock('../utils/db')

describe('Auth Controller', () => {
  let req
  let res

  beforeEach(() => {
    req = {
      body: {
        email: 'test@example.com',
        password: 'Password123!',
      },
    }
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    }
    jest.clearAllMocks()
  })

  describe('login', () => {
    it('handles invalid credentials', async () => {
      // Mock db.get to simulate no user found
      db.get.mockImplementation((query, params, callback) => {
        callback(null, null)
      })

      await login(req, res)

      expect(res.status).toHaveBeenCalledWith(401)
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: expect.any(String),
        }),
      )
    })
  })
})
