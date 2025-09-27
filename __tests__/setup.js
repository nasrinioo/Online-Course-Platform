const { resetCircuitBreaker } = require("../src/utils/transactions");

// Global test setup
beforeAll(async () => {
  resetCircuitBreaker();

  process.env.NODE_ENV = "test";
  process.env.JWT_SECRET = "test-jwt-secret";
  process.env.DATABASE_URL = "postgresql://test:test@localhost:5432/test_db";
  process.env.REDIS_URL = "redis://localhost:6379";

  global.console = {
    ...console,
    log: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  };
});

// Clean up after each test
afterEach(() => {
  // Clear all mocks
  jest.clearAllMocks();

  // Reset circuit breaker
  resetCircuitBreaker();
});

// Global test utilities
global.testUtils = {
  // Create mock user data
  createMockUser: (overrides = {}) => ({
    id: "test-user-id",
    email: "test@example.com",
    firstName: "Test",
    lastName: "User",
    role: "STUDENT",
    avatar: null,
    bio: null,
    isActive: true,
    emailVerified: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  }),

  // Create mock JWT payload
  createMockJWT: (overrides = {}) => ({
    id: "test-user-id",
    role: "STUDENT",
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 3600,
    ...overrides,
  }),

  // Create mock request headers
  createAuthHeaders: (token = "mock-jwt-token") => ({
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  }),

  // Wait for async operations
  waitFor: (ms) => new Promise((resolve) => setTimeout(resolve, ms)),

  // Create mock file buffer
  createMockFileBuffer: (content = "fake-file-content") =>
    Buffer.from(content, "utf8"),
};
