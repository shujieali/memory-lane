// Mock window.matchMedia
window.matchMedia =
  window.matchMedia ||
  function (query: string) {
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

// Make this a module to allow global augmentation
export {}

// Define test environment type
interface TestGlobal {
  importMeta: {
    env: {
      VITE_API_BASE_URL: string
      MODE: string
      BASE_URL: string
      DEV: boolean
      PROD: boolean
      SSR: boolean
    }
  }
}

// Mock Vite's import.meta.env for tests
const globalWithImportMeta = global as unknown as TestGlobal
globalWithImportMeta.importMeta = {
  env: {
    VITE_API_BASE_URL: 'http://localhost:3000',
    MODE: 'test',
    BASE_URL: '/',
    DEV: false,
    PROD: false,
    SSR: false,
  },
}
