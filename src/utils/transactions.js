const prisma = require('../config/database');
const supabase = require('../config/supabase');

// Configuration from environment variables
const config = {
  maxRetries: parseInt(process.env.TRANSACTION_MAX_RETRIES) || 3,
  baseDelay: parseInt(process.env.TRANSACTION_BASE_DELAY) || 1000,
  maxDelay: parseInt(process.env.TRANSACTION_MAX_DELAY) || 10000,
  jitter: parseInt(process.env.TRANSACTION_JITTER) || 1000,
  circuitBreakerThreshold: parseInt(process.env.CIRCUIT_BREAKER_THRESHOLD) || 10,
  circuitBreakerTimeout: parseInt(process.env.CIRCUIT_BREAKER_TIMEOUT) || 60000
};

// Circuit breaker state
const circuitBreaker = {
  failures: 0,
  lastFailureTime: null,
  state: 'CLOSED' // CLOSED, OPEN, HALF_OPEN
};

// Structured logger (simple implementation)
const logger = {
  info: (message, meta = {}) => console.log(`[INFO] ${message}`, JSON.stringify(meta)),
  warn: (message, meta = {}) => console.warn(`[WARN] ${message}`, JSON.stringify(meta)),
  error: (message, meta = {}) => console.error(`[ERROR] ${message}`, JSON.stringify(meta))
};

/**
 * Transaction utility functions for database operations
 */

/**
 * Execute a Prisma transaction with retry logic
 * @param {Function} fn - Transaction function
 * @param {Object} options - Transaction options
 * @param {AbortSignal} signal - Abort signal for cancellation
 * @returns {Promise} Transaction result
 */
exports.executePrismaTransaction = async (fn, options = {}, signal = null) => {
  const defaultOptions = {
    isolationLevel: 'RepeatableRead',
    maxWait: 20000,
    timeout: 180000,
    retries: config.maxRetries
  };

  const transactionConfig = { ...defaultOptions, ...options };
  let lastError;
  const requestId = generateRequestId();

  // Check circuit breaker
  if (circuitBreaker.state === 'OPEN') {
    if (Date.now() - circuitBreaker.lastFailureTime > config.circuitBreakerTimeout) {
      circuitBreaker.state = 'HALF_OPEN';
    } else {
      throw new Error('Circuit breaker is OPEN - too many consecutive failures');
    }
  }

  for (let attempt = 0; attempt <= transactionConfig.retries; attempt++) {
    try {
      // Check for cancellation
      if (signal?.aborted) {
        throw new Error('Transaction cancelled');
      }

      const startTime = Date.now();
      const result = await prisma.$transaction(fn, {
        isolationLevel: transactionConfig.isolationLevel,
        maxWait: transactionConfig.maxWait,
        timeout: transactionConfig.timeout
      });
      
      const duration = Date.now() - startTime;
      
      // Reset circuit breaker on success
      if (circuitBreaker.state === 'HALF_OPEN') {
        circuitBreaker.state = 'CLOSED';
        circuitBreaker.failures = 0;
      }
      
      logger.info('Transaction completed successfully', {
        requestId,
        attempt: attempt + 1,
        duration,
        isolationLevel: transactionConfig.isolationLevel
      });
      
      return result;
    } catch (error) {
      lastError = error;
      
      // Check for cancellation
      if (signal?.aborted) {
        throw new Error('Transaction cancelled');
      }
      
      // Check if error is retryable
      if (isRetryableError(error) && attempt < transactionConfig.retries) {
        const delay = calculateBackoffDelay(attempt);
        
        logger.warn('Transaction attempt failed, retrying', {
          requestId,
          attempt: attempt + 1,
          maxAttempts: transactionConfig.retries + 1,
          delay,
          errorCode: error.code,
          errorMessage: error.message,
          stack: error.stack
        });
        
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
      
      // Update circuit breaker
      circuitBreaker.failures++;
      circuitBreaker.lastFailureTime = Date.now();
      
      if (circuitBreaker.failures >= config.circuitBreakerThreshold) {
        circuitBreaker.state = 'OPEN';
        logger.error('Circuit breaker opened due to consecutive failures', {
          requestId,
          failures: circuitBreaker.failures,
          threshold: config.circuitBreakerThreshold
        });
      }
      
      logger.error('Transaction failed permanently', {
        requestId,
        attempt: attempt + 1,
        errorCode: error.code,
        errorMessage: error.message,
        stack: error.stack
      });
      
      throw error;
    }
  }
  
  throw lastError;
};

/**
 * Execute a Supabase operation with retry logic
 * Note: Supabase doesn't support true transactions like Prisma
 * @param {Function} fn - Operation function
 * @param {Object} options - Operation options
 * @param {AbortSignal} signal - Abort signal for cancellation
 * @returns {Promise} Operation result
 */
exports.executeSupabaseOperation = async (fn, options = {}, signal = null) => {
  const defaultOptions = {
    isolationLevel: 'read committed',
    timeout: 30000,
    retries: config.maxRetries
  };

  const transactionConfig = { ...defaultOptions, ...options };
  let lastError;
  const requestId = generateRequestId();

  for (let attempt = 0; attempt <= transactionConfig.retries; attempt++) {
    try {
      // Check for cancellation
      if (signal?.aborted) {
        throw new Error('Transaction cancelled');
      }

      const startTime = Date.now();
      const result = await fn(supabase);
      const duration = Date.now() - startTime;
      
      logger.info('Supabase operation completed successfully', {
        requestId,
        attempt: attempt + 1,
        duration
      });
      
      return result;
    } catch (error) {
      lastError = error;
      
      // Check for cancellation
      if (signal?.aborted) {
        throw new Error('Transaction cancelled');
      }
      
      if (isRetryableError(error) && attempt < transactionConfig.retries) {
        const delay = calculateBackoffDelay(attempt);
        
        logger.warn('Supabase operation attempt failed, retrying', {
          requestId,
          attempt: attempt + 1,
          maxAttempts: transactionConfig.retries + 1,
          delay,
          errorCode: error.code,
          errorMessage: error.message,
          stack: error.stack
        });
        
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
      
      logger.error('Supabase operation failed permanently', {
        requestId,
        attempt: attempt + 1,
        errorCode: error.code,
        errorMessage: error.message,
        stack: error.stack
      });
      
      throw error;
    }
  }
  
  throw lastError;
};

/**
 * Execute multiple operations in a single transaction
 * @param {Array} operations - Array of operation functions
 * @param {Object} options - Transaction options
 * @param {AbortSignal} signal - Abort signal for cancellation
 * @returns {Promise} Array of results
 */
exports.executeBatchTransaction = async (operations, options = {}, signal = null) => {
  return await exports.executePrismaTransaction(async (tx) => {
    const results = [];
    
    for (const operation of operations) {
      // Check for cancellation between operations
      if (signal?.aborted) {
        throw new Error('Batch transaction cancelled');
      }
      
      const result = await operation(tx);
      results.push(result);
    }
    
    return results;
  }, options, signal);
};

/**
 * Execute a transaction with rollback on specific conditions
 * @param {Function} fn - Transaction function
 * @param {Function} shouldRollback - Function to determine if rollback is needed
 * @param {Object} options - Transaction options
 * @param {AbortSignal} signal - Abort signal for cancellation
 * @returns {Promise} Transaction result
 */
exports.executeConditionalTransaction = async (fn, shouldRollback, options = {}, signal = null) => {
  return await exports.executePrismaTransaction(async (tx) => {
    // Check for cancellation
    if (signal?.aborted) {
      throw new Error('Transaction cancelled');
    }
    
    const result = await fn(tx);
    
    if (shouldRollback(result)) {
      throw new Error('Transaction rolled back due to condition');
    }
    
    return result;
  }, options, signal);
};

/**
 * Check if an error is retryable
 * @param {Error} error - Error to check
 * @returns {boolean} True if error is retryable
 */
function isRetryableError(error) {
  // Only retry on transient infrastructure errors
  const retryableCodes = [
    'P1008', // Operation timed out
    'P1009', // Connection timeout
    'P1010', // Connection refused
    'P1011', // Connection error
    'P1012', // Connection closed
    'P1013', // Connection lost
    'P1014', // Connection failed
    'P1015', // Connection timeout
    'P1016', // Connection refused
    'P1017', // Connection error
    'P1018', // Connection closed
    'P1019', // Connection lost
    'P1020', // Connection failed
    'P2034', // Transaction conflict (serialization failure)
    'P2035', // Transaction conflict (deadlock)
  ];
  
  // Check for deterministic errors that should NOT be retried
  const nonRetryableCodes = [
    'P2002', // Unique constraint violation
    'P2025', // Record not found
    'P2003', // Foreign key constraint
    'P2014', // Required relation missing
    'P2016', // Query interpretation error
    'P2017', // Records for relation not connected
    'P2018', // Required connected records not found
    'P2019', // Input error
    'P2020', // Value out of range
    'P2021', // Table does not exist
    'P2022', // Column does not exist
    'P2023', // Inconsistent column data
    'P2024', // Timed out fetching a new connection
    'P2026', // Unsupported feature
    'P2027', // Multiple errors
  ];
  
  // Don't retry deterministic application errors
  if (nonRetryableCodes.includes(error.code)) {
    return false;
  }
  
  // Retry on transient infrastructure errors
  if (retryableCodes.includes(error.code)) {
    return true;
  }
  
  // Check error message for transient issues
  const retryableMessages = [
    'timeout',
    'connection',
    'deadlock',
    'could not serialize',
    'serialization failure',
    'connection pool',
    'network',
    'temporary',
    'retry',
    'busy',
    'locked'
  ];
  
  const errorMessage = error.message.toLowerCase();
  return retryableMessages.some(msg => errorMessage.includes(msg));
}

/**
 * Calculate exponential backoff delay with jitter
 * @param {number} attempt - Current attempt number (0-based)
 * @returns {number} Delay in milliseconds
 */
function calculateBackoffDelay(attempt) {
  const baseDelay = config.baseDelay;
  const maxDelay = config.maxDelay;
  const jitter = config.jitter;
  
  // Exponential backoff: base * 2^attempt
  const exponentialDelay = baseDelay * Math.pow(2, attempt);
  
  // Add random jitter to avoid thundering herd
  const jitterAmount = Math.random() * jitter;
  
  // Cap at maxDelay
  const delay = Math.min(exponentialDelay + jitterAmount, maxDelay);
  
  return Math.floor(delay);
}

/**
 * Generate a unique request ID for tracking
 * @returns {string} Request ID
 */
function generateRequestId() {
  return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Transaction decorator for class methods (improved version)
 * @param {Object} options - Transaction options
 * @returns {Function} Decorator function
 */
exports.transactional = (options = {}) => {
  return function (target, propertyKey, descriptor) {
    const originalMethod = descriptor.value;
    
    descriptor.value = async function (...args) {
      // Create a context object instead of mutating this
      const context = { tx: null };
      
      return await exports.executePrismaTransaction(async (tx) => {
        // Pass transaction context as first argument
        context.tx = tx;
        return await originalMethod.call(this, context, ...args);
      }, options);
    };
    
    return descriptor;
  };
};

/**
 * Alternative decorator that passes tx as first argument
 * @param {Object} options - Transaction options
 * @returns {Function} Decorator function
 */
exports.withTransaction = (options = {}) => {
  return function (target, propertyKey, descriptor) {
    const originalMethod = descriptor.value;
    
    descriptor.value = async function (tx, ...args) {
      if (!tx) {
        throw new Error('Transaction context required');
      }
      return await originalMethod.call(this, tx, ...args);
    };
    
    return descriptor;
  };
};

/**
 * Health check for database connections
 * @returns {Promise<Object>} Health status
 */
exports.healthCheck = async () => {
  const status = {
    prisma: { connected: false, latency: null, error: null },
    supabase: { connected: false, latency: null, error: null },
    circuitBreaker: circuitBreaker,
    timestamp: new Date().toISOString()
  };
  
  // Prisma health check
  try {
    const startTime = Date.now();
    await prisma.$queryRaw`SELECT 1`;
    const latency = Date.now() - startTime;
    
    status.prisma = {
      connected: true,
      latency: latency,
      error: null
    };
  } catch (error) {
    status.prisma = {
      connected: false,
      latency: null,
      error: error.message
    };
    logger.error('Prisma health check failed', { error: error.message, stack: error.stack });
  }
  
  // Supabase health check
  try {
    const startTime = Date.now();
    const { error } = await supabase.rpc('pg_isready');
    const latency = Date.now() - startTime;
    
    if (!error) {
      status.supabase = {
        connected: true,
        latency: latency,
        error: null
      };
    } else {
      status.supabase = {
        connected: false,
        latency: latency,
        error: error.message
      };
    }
  } catch (error) {
    status.supabase = {
      connected: false,
      latency: null,
      error: error.message
    };
    logger.error('Supabase health check failed', { error: error.message, stack: error.stack });
  }
  
  return status;
};

/**
 * Get circuit breaker status
 * @returns {Object} Circuit breaker state
 */
exports.getCircuitBreakerStatus = () => {
  return {
    state: circuitBreaker.state,
    failures: circuitBreaker.failures,
    lastFailureTime: circuitBreaker.lastFailureTime,
    threshold: config.circuitBreakerThreshold,
    timeout: config.circuitBreakerTimeout
  };
};

/**
 * Reset circuit breaker (for testing or manual intervention)
 */
exports.resetCircuitBreaker = () => {
  circuitBreaker.state = 'CLOSED';
  circuitBreaker.failures = 0;
  circuitBreaker.lastFailureTime = null;
  logger.info('Circuit breaker manually reset');
};

/**
 * Get transaction metrics
 * @returns {Object} Transaction metrics
 */
exports.getMetrics = () => {
  return {
    config: {
      maxRetries: config.maxRetries,
      baseDelay: config.baseDelay,
      maxDelay: config.maxDelay,
      jitter: config.jitter,
      circuitBreakerThreshold: config.circuitBreakerThreshold,
      circuitBreakerTimeout: config.circuitBreakerTimeout
    },
    circuitBreaker: circuitBreaker
  };
};

module.exports = exports;
