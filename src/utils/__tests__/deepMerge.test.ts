import { deepMerge, DeepPartial } from '../deepMerge'

describe('deepMerge', () => {
  it('should merge two simple objects', () => {
    interface TestObj {
      a: number
      b: number
      c?: number
    }
    const obj1: TestObj = { a: 1, b: 2 }
    const obj2: Partial<TestObj> = { b: 3, c: 4 }
    const result = deepMerge(obj1, obj2)
    expect(result).toEqual({ a: 1, b: 3, c: 4 })
  })

  it('should deeply merge nested objects', () => {
    interface TestObj {
      a: number
      b: {
        c: number
        d: number
        e?: number
      }
    }
    const obj1: TestObj = {
      a: 1,
      b: {
        c: 2,
        d: 3,
      },
    }
    const obj2 = {
      b: {
        c: 4,
        e: 5,
      },
    }
    const result = deepMerge(obj1, obj2)
    expect(result).toEqual({
      a: 1,
      b: {
        c: 4,
        d: 3,
        e: 5,
      },
    })
  })

  it('should handle undefined values', () => {
    interface TestObj {
      a: number
      b?: number
      c?: number
    }
    const obj1: TestObj = { a: 1, b: 2 }
    const obj2: Partial<TestObj> = { b: undefined, c: 3 }
    const result = deepMerge(obj1, obj2)
    expect(result).toEqual({ a: 1, b: 2, c: 3 })
  })

  it('should handle arrays', () => {
    interface TestObj {
      a: number[]
      b: number
    }
    const obj1: TestObj = { a: [1, 2], b: 2 }
    const obj2: Partial<TestObj> = { a: [3, 4] }
    const result = deepMerge(obj1, obj2)
    expect(result).toEqual({ a: [3, 4], b: 2 })
  })

  it('should handle null values', () => {
    interface TestObj {
      a: number
      b: { c: number } | null
    }
    const obj1: TestObj = { a: 1, b: { c: 2 } }
    const obj2: Partial<TestObj> = { b: null }
    const result = deepMerge(obj1, obj2)
    expect(result).toEqual({ a: 1, b: null })
  })

  it('should not modify the original objects', () => {
    interface TestObj {
      a: number
      b: {
        c?: number
        d?: number
      }
    }
    const obj1: TestObj = { a: 1, b: { c: 2 } }
    const obj2: Partial<TestObj> = { b: { d: 3 } }
    const result = deepMerge(obj1, obj2)

    expect(obj1).toEqual({ a: 1, b: { c: 2 } })
    expect(obj2).toEqual({ b: { d: 3 } })
    expect(result).toEqual({ a: 1, b: { c: 2, d: 3 } })
  })

  it('should handle empty objects', () => {
    interface TestObj {
      a: number
      b?: string
    }
    const obj1: TestObj = { a: 1 }
    const obj2: Partial<TestObj> = {}
    const result = deepMerge(obj1, obj2)
    expect(result).toEqual({ a: 1 })
  })

  it('should handle complex nested structures', () => {
    interface Theme {
      mode: string
      colors: {
        primary: string
        secondary: string
        accent?: string
      }
    }
    interface TestObj {
      theme: Theme
      settings?: {
        notifications: boolean
        darkMode?: boolean
      }
    }
    const obj1: TestObj = {
      theme: {
        mode: 'light',
        colors: {
          primary: '#000',
          secondary: '#fff',
        },
      },
      settings: {
        notifications: true,
      },
    }
    const obj2: DeepPartial<TestObj> = {
      theme: {
        colors: {
          primary: '#111',
          accent: '#222',
        },
      },
    }
    const result = deepMerge(obj1, obj2)
    expect(result).toEqual({
      theme: {
        mode: 'light',
        colors: {
          primary: '#111',
          secondary: '#fff',
          accent: '#222',
        },
      },
      settings: {
        notifications: true,
      },
    })
  })

  it('should handle null source object', () => {
    interface TestObj {
      a: number
      b: string
    }
    const obj1: TestObj = { a: 1, b: 'test' }
    const result = deepMerge(obj1, null)
    expect(result).toEqual(obj1)
  })

  it('should handle undefined source object', () => {
    interface TestObj {
      a: number
      b: string
    }
    const obj1: TestObj = { a: 1, b: 'test' }
    const result = deepMerge(obj1, undefined)
    expect(result).toEqual(obj1)
  })
})
