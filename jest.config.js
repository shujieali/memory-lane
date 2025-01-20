module.exports = {
  projects: [
    {
      displayName: 'backend',
      testEnvironment: 'node',
      testMatch: ['<rootDir>/server/__tests__/**/*.test.js'],
      setupFilesAfterEnv: ['<rootDir>/server/test/setup.js'],
      testTimeout: 10000,
      // Set test DB config through environment variable
      setupFiles: ['<rootDir>/server/test/setTestEnv.js'],
    },
  ],
  // Global settings
  verbose: true,
  collectCoverage: false,
}
