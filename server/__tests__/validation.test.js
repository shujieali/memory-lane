const { validateRequest } = require('../utils/validation')
const { validationResult } = require('express-validator')

// Mock express-validator
jest.mock('express-validator', () => ({
  validationResult: jest.fn(),
}))

describe('Validation Middleware', () => {
  let req
  let res
  let next

  beforeEach(() => {
    req = {
      body: {},
    }
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    }
    next = jest.fn()
    jest.clearAllMocks()
  })

  it('calls next() when validation passes', () => {
    // Mock validation success
    validationResult.mockImplementation(() => ({
      isEmpty: () => true,
      array: () => [],
    }))

    validateRequest(req, res, next)

    expect(next).toHaveBeenCalled()
    expect(res.status).not.toHaveBeenCalled()
    expect(res.json).not.toHaveBeenCalled()
  })

  it('returns 400 with validation errors when validation fails', () => {
    // Mock validation errors
    const mockErrors = [
      {
        param: 'email',
        msg: 'Invalid email format',
      },
      {
        param: 'password',
        msg: 'Password is required',
      },
    ]

    validationResult.mockImplementation(() => ({
      isEmpty: () => false,
      array: () => mockErrors,
    }))

    validateRequest(req, res, next)

    expect(next).not.toHaveBeenCalled()
    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({
      errors: mockErrors,
    })
  })

  it('formats nested error fields correctly', () => {
    // Mock nested validation errors
    const mockErrors = [
      {
        param: 'user.email',
        msg: 'Invalid email',
        location: 'body',
      },
      {
        param: 'user.profile.age',
        msg: 'Must be a number',
        location: 'body',
      },
    ]

    validationResult.mockImplementation(() => ({
      isEmpty: () => false,
      array: () => mockErrors,
    }))

    validateRequest(req, res, next)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({
      errors: expect.arrayContaining([
        expect.objectContaining({
          param: expect.any(String),
          msg: expect.any(String),
        }),
      ]),
    })
  })

  it('handles empty validation errors array', () => {
    validationResult.mockImplementation(() => ({
      isEmpty: () => false,
      array: () => [],
    }))

    validateRequest(req, res, next)

    expect(next).not.toHaveBeenCalled()
    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({
      errors: [],
    })
  })

  it('processes array validation errors', () => {
    const mockErrors = [
      {
        param: 'items[0].name',
        msg: 'Name is required',
        location: 'body',
      },
      {
        param: 'items[1].price',
        msg: 'Price must be a number',
        location: 'body',
      },
    ]

    validationResult.mockImplementation(() => ({
      isEmpty: () => false,
      array: () => mockErrors,
    }))

    validateRequest(req, res, next)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({
      errors: mockErrors,
    })
  })
})
