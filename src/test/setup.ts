// Mock Vite's import.meta.env
process.env.VITE_API_BASE_URL = 'http://localhost:3000'

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  clear: jest.fn(),
  removeItem: jest.fn(),
  key: jest.fn(),
  length: 0,
}

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
})

// Add global fetch polyfill for tests
global.fetch = jest.fn()

// Mock window.matchMedia
window.matchMedia =
  window.matchMedia ||
  function (query) {
    return {
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }
  }

// Mock TextEncoder/TextDecoder
class TextEncoderMock {
  encode(str: string): Uint8Array {
    const arr = new Uint8Array(str.length)
    for (let i = 0; i < str.length; i++) {
      arr[i] = str.charCodeAt(i)
    }
    return arr
  }
}

class TextDecoderMock {
  decode(arr: Uint8Array): string {
    return String.fromCharCode.apply(null, Array.from(arr))
  }
}

global.TextEncoder = TextEncoderMock as typeof global.TextEncoder
global.TextDecoder = TextDecoderMock as typeof global.TextDecoder

// Mock for import.meta.env
jest.mock('../services/config', () => ({
  getApiBaseUrl: jest.fn(() => 'http://localhost:3000'),
}))

// Suppress console.error in tests
console.error = jest.fn()
