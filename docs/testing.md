# Testing Guide

This document outlines the testing infrastructure and practices for the Memory Lane application.

## Test Structure

The project uses a comprehensive testing approach with three levels:

1. **Unit Tests** (Jest)

   - Frontend tests in `src/**/__tests__`
   - Backend tests in `server/__tests__`
   - Coverage requirement: 80% for lines, functions, branches, and statements

2. **E2E Tests** (Playwright)

   - Located in `e2e/` directory
   - Tests full user flows and integration points
   - Runs in multiple browsers (Chrome, Firefox, Safari)

3. **API Tests**
   - Included in backend unit tests
   - Swagger UI available at `/api-docs` for manual testing

## Running Tests

```bash
# Run all tests
npm test

# Run frontend tests only
npm run test:frontend

# Run backend tests only
npm run test:backend

# Run tests with coverage
npm run test:coverage

# Run frontend tests with coverage
npm run test:frontend:coverage

# Run backend tests with coverage
npm run test:backend:coverage

# Run E2E tests
npm run test:e2e

# Run E2E tests with UI
npm run test:e2e:ui

# Run E2E tests in debug mode
npm run test:e2e:debug
```

## CI Pipeline

Tests are automatically run in the CI pipeline on every pull request and push to main. The pipeline:

1. Runs linting
2. Runs unit tests (frontend and backend)
3. Builds the application
4. Runs E2E tests
5. Uploads test reports and coverage

## Test Examples

### Frontend Unit Test

```typescript
// Example component test
describe('MemoryCard', () => {
  it('renders memory details correctly', () => {
    render(<MemoryCard {...mockProps} />);
    expect(screen.getByText(mockProps.title)).toBeInTheDocument();
  });
});
```

### Backend Unit Test

```javascript
// Example controller test
describe('Auth Controller', () => {
  it('successfully registers a new user', async () => {
    const response = await request().post('/auth/register').send(mockUser)
    expect(response.status).toBe(201)
  })
})
```

### E2E Test

```typescript
// Example E2E test
test('user can create and view a memory', async ({ page }) => {
  await page.goto('/memories')
  await page.getByRole('button', { name: /add memory/i }).click()
  // ... rest of the test
})
```

## Writing Tests

### Frontend Components

1. Use React Testing Library
2. Test component rendering and interactions
3. Mock external dependencies
4. Test error states and loading states

### Backend Controllers

1. Test success and error cases
2. Mock database calls
3. Validate response structure
4. Test input validation

### E2E Tests

1. Test complete user flows
2. Handle authentication where needed
3. Test offline functionality
4. Test file uploads and dynamic content

## Best Practices

1. **Arrange-Act-Assert** pattern for test structure
2. Mock external dependencies
3. Use meaningful test descriptions
4. Test edge cases and error conditions
5. Keep tests focused and independent
6. Use proper cleanup in `afterEach` blocks
7. Follow the Testing Trophy principle:
   - Static Analysis
   - Unit Tests
   - Integration Tests
   - E2E Tests

## API Documentation

API documentation is available through Swagger UI at `/api-docs`. This provides:

1. Interactive documentation for all endpoints
2. Request/response examples
3. Authentication details
4. Schema definitions

The API is organized into the following sections:

- Authentication
- Memories
- Storage
- Email
- Social Sharing

Each endpoint includes:

- HTTP method and URL
- Request parameters
- Request body schema
- Response format
- Authentication requirements
- Example requests and responses

## Maintenance

- Keep test files close to implementation files
- Update tests when changing functionality
- Run the full test suite before committing
- Monitor test coverage in CI pipeline
- Review test reports for failures and slow tests
