# Transaction Configuration Guide

This document explains how to configure the transaction system for optimal performance and reliability.

## Environment Variables

### Transaction Settings

```bash
# Maximum number of retry attempts (default: 3)
TRANSACTION_MAX_RETRIES=3

# Base delay for exponential backoff in milliseconds (default: 1000)
TRANSACTION_BASE_DELAY=1000

# Maximum delay cap in milliseconds (default: 10000)
TRANSACTION_MAX_DELAY=10000

# Random jitter to avoid thundering herd in milliseconds (default: 1000)
TRANSACTION_JITTER=1000
```

### Circuit Breaker Settings

```bash
# Number of consecutive failures before opening circuit (default: 10)
CIRCUIT_BREAKER_THRESHOLD=10

# Time in milliseconds before attempting to close circuit (default: 60000)
CIRCUIT_BREAKER_TIMEOUT=60000
```

## Configuration Examples

### Development Environment
```bash
TRANSACTION_MAX_RETRIES=2
TRANSACTION_BASE_DELAY=500
TRANSACTION_MAX_DELAY=5000
CIRCUIT_BREAKER_THRESHOLD=5
```

### Production Environment
```bash
TRANSACTION_MAX_RETRIES=5
TRANSACTION_BASE_DELAY=1000
TRANSACTION_MAX_DELAY=30000
TRANSACTION_JITTER=2000
CIRCUIT_BREAKER_THRESHOLD=20
CIRCUIT_BREAKER_TIMEOUT=120000
```

### High-Load Environment
```bash
TRANSACTION_MAX_RETRIES=3
TRANSACTION_BASE_DELAY=2000
TRANSACTION_MAX_DELAY=60000
TRANSACTION_JITTER=5000
CIRCUIT_BREAKER_THRESHOLD=50
CIRCUIT_BREAKER_TIMEOUT=300000
```

## Usage Examples

### Basic Transaction
```javascript
const { executePrismaTransaction } = require('./utils/transactions');

const result = await executePrismaTransaction(async (tx) => {
  const user = await tx.user.create({ data: userData });
  const profile = await tx.profile.create({ data: profileData });
  return { user, profile };
});
```

### Transaction with Cancellation
```javascript
const abortController = new AbortController();

// Cancel after 5 seconds
setTimeout(() => abortController.abort(), 5000);

const result = await executePrismaTransaction(
  async (tx) => {
    return await tx.user.create({ data: userData });
  },
  { retries: 2 },
  abortController.signal
);
```

### Batch Transaction
```javascript
const { executeBatchTransaction } = require('./utils/transactions');

const operations = [
  (tx) => tx.user.create({ data: userData }),
  (tx) => tx.profile.create({ data: profileData }),
  (tx) => tx.preferences.create({ data: prefData })
];

const results = await executeBatchTransaction(operations);
```

### Conditional Transaction
```javascript
const { executeConditionalTransaction } = require('./utils/transactions');

const result = await executeConditionalTransaction(
  async (tx) => {
    return await tx.user.update({ where: { id }, data: updateData });
  },
  (result) => result.role === 'ADMIN' // Rollback if user becomes admin
);
```

## Monitoring and Health Checks

### Health Check Endpoint
```javascript
const { healthCheck } = require('./utils/transactions');

app.get('/health', async (req, res) => {
  const status = await healthCheck();
  res.json(status);
});
```

### Circuit Breaker Status
```javascript
const { getCircuitBreakerStatus, resetCircuitBreaker } = require('./utils/transactions');

// Get current status
const status = getCircuitBreakerStatus();
console.log('Circuit breaker state:', status.state);

// Reset circuit breaker (for testing or manual intervention)
resetCircuitBreaker();
```

### Metrics and Monitoring
```javascript
const { getMetrics } = require('./utils/transactions');

const metrics = getMetrics();
console.log('Transaction metrics:', metrics);
```

## Error Handling

### Retryable Errors
The system automatically retries on these transient errors:
- Connection timeouts (P1008, P1009)
- Connection failures (P1010, P1011, P1012, P1013, P1014)
- Transaction conflicts (P2034, P2035)
- Network issues
- Deadlocks
- Serialization failures

### Non-Retryable Errors
These deterministic errors are not retried:
- Unique constraint violations (P2002)
- Record not found (P2025)
- Foreign key constraints (P2003)
- Validation errors (P2019, P2020)
- Schema errors (P2021, P2022)

## Best Practices

### 1. Use Appropriate Isolation Levels
```javascript
// For read-heavy operations
await executePrismaTransaction(fn, { isolationLevel: 'ReadCommitted' });

// For write-heavy operations
await executePrismaTransaction(fn, { isolationLevel: 'RepeatableRead' });
```

### 2. Set Reasonable Timeouts
```javascript
await executePrismaTransaction(fn, {
  timeout: 30000, // 30 seconds
  maxWait: 10000  // 10 seconds
});
```

### 3. Handle Cancellation Gracefully
```javascript
const abortController = new AbortController();

try {
  const result = await executePrismaTransaction(fn, {}, abortController.signal);
  return result;
} catch (error) {
  if (error.message === 'Transaction cancelled') {
    // Handle cancellation
    return null;
  }
  throw error;
}
```

### 4. Monitor Circuit Breaker
```javascript
setInterval(() => {
  const status = getCircuitBreakerStatus();
  if (status.state === 'OPEN') {
    console.warn('Circuit breaker is OPEN - database issues detected');
  }
}, 30000); // Check every 30 seconds
```

## Testing

### Unit Tests
```javascript
// Mock Prisma client
const mockPrisma = {
  $transaction: jest.fn()
};

// Test retry logic
it('should retry on transient errors', async () => {
  const error = new Error('Connection timeout');
  error.code = 'P1008';
  
  mockPrisma.$transaction
    .mockRejectedValueOnce(error)
    .mockResolvedValue({ id: 1 });
  
  const result = await executePrismaTransaction(fn);
  expect(result).toEqual({ id: 1 });
  expect(mockPrisma.$transaction).toHaveBeenCalledTimes(2);
});
```

### Integration Tests
```javascript
// Test with real database
it('should handle complex transactions', async () => {
  const result = await executePrismaTransaction(async (tx) => {
    const user = await tx.user.create({ data: userData });
    const profile = await tx.profile.create({ data: profileData });
    return { user, profile };
  });
  
  expect(result.user.id).toBeDefined();
  expect(result.profile.userId).toBe(result.user.id);
});
```

## Troubleshooting

### Common Issues

1. **Circuit Breaker Stuck Open**
   - Check database connectivity
   - Reset circuit breaker manually
   - Review error logs

2. **High Retry Rates**
   - Check database performance
   - Review connection pool settings
   - Consider increasing timeouts

3. **Transaction Timeouts**
   - Optimize queries
   - Increase timeout settings
   - Check for long-running operations

### Debug Logging

Enable detailed logging by setting:
```bash
NODE_ENV=development
```

This will provide detailed transaction logs including:
- Attempt numbers
- Delay calculations
- Error codes and messages
- Circuit breaker state changes
