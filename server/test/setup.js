const { seedTestData, clearTestData } = require('./seed')

// Before all tests
beforeAll(async () => {
  // First clear any existing data
  await clearTestData()
  // Then seed fresh test data
  await seedTestData()
})

// After all tests
afterAll(async () => {
  // Clean up test data
  await clearTestData()
})

// Reset data between tests
beforeEach(async () => {
  // Clear and reseed data before each test
  await clearTestData()
  await seedTestData()
})
