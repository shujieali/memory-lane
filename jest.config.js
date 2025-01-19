/** @type {import('jest').Config} */
module.exports = {
  projects: [
    {
      displayName: 'frontend',
      preset: 'ts-jest',
      testEnvironment: 'jsdom',
      setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
      moduleNameMapper: {
        '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
        '\\.(jpg|jpeg|png|gif|webp|svg)$':
          '<rootDir>/src/__mocks__/fileMock.ts',
      },
      transform: {
        '^.+\\.tsx?$': [
          'ts-jest',
          {
            tsconfig: 'tsconfig.json',
          },
        ],
      },
      testMatch: [
        '<rootDir>/src/**/__tests__/**/*.{ts,tsx}',
        '<rootDir>/src/**/*.{spec,test}.{ts,tsx}',
      ],
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
  // Global config for both projects
  verbose: true,
  clearMocks: true,
  resetMocks: false,
  restoreMocks: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'clover'],
}
