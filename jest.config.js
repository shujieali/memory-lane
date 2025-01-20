/** @type {import('jest').Config} */
module.exports = {
  projects: [
    {
      displayName: 'frontend',
      preset: 'ts-jest',
      testEnvironment: 'jsdom',
      setupFilesAfterEnv: [
        '@testing-library/jest-dom',
        '<rootDir>/src/test/setup.ts',
      ],
      moduleNameMapper: {
        '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
        '\\.(jpg|jpeg|png|gif|webp|svg)$':
          '<rootDir>/src/__mocks__/fileMock.ts',
        '^virtual:env$': '<rootDir>/src/__mocks__/virtualEnv.ts',
      },
      transform: {
        '^.+\\.tsx?$': [
          'ts-jest',
          {
            tsconfig: 'tsconfig.json',
            useESM: true,
            diagnostics: {
              ignoreCodes: [1343], // Ignore import.meta errors
            },
          },
        ],
      },
      testMatch: [
        '<rootDir>/src/**/__tests__/**/*.{ts,tsx}',
        '<rootDir>/src/**/*.{spec,test}.{ts,tsx}',
      ],
      moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
      coverageThreshold: {
        global: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80,
        },
      },
      collectCoverageFrom: [
        'src/**/*.{ts,tsx}',
        '!src/**/*.d.ts',
        '!src/main.tsx',
        '!src/vite-env.d.ts',
      ],
      testEnvironmentOptions: {
        url: 'http://localhost:3000',
        customExportConditions: ['node', 'node-addons'],
        env: {
          NODE_ENV: 'test',
          VITE_API_BASE_URL: 'http://localhost:3000',
        },
      },
      setupFiles: ['<rootDir>/src/test/setup.ts'],
    },
    {
      displayName: 'backend',
      testEnvironment: 'node',
      testMatch: [
        '<rootDir>/server/**/__tests__/**/*.js',
        '<rootDir>/server/**/*.{spec,test}.js',
      ],
      transform: {
        '^.+\\.js$': 'babel-jest',
      },
      coverageThreshold: {
        global: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80,
        },
      },
      collectCoverageFrom: [
        'server/**/*.js',
        '!server/**/__tests__/**',
        '!server/api.js',
      ],
      setupFiles: ['dotenv/config'],
      testEnvironmentOptions: {
        env: {
          NODE_ENV: 'test',
          JWT_SECRET: 'test-secret',
          STORAGE_TYPE: 'local',
          LOCAL_STORAGE_PATH: 'uploads',
        },
      },
    },
  ],
  verbose: true,
  clearMocks: true,
  resetMocks: false,
  restoreMocks: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'clover'],
}
