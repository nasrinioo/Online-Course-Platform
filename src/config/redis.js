const redis = require('redis');

/**
 * Redis client instance
 * Configured with connection pooling and error handling
 */
let redisClient = null;
let connectionAttempted = false;

/**
 * Create Redis client with error handling
 * @returns {redis.RedisClient|null} Redis client instance
 */
exports.createRedisClient = () => {
  try {
    const client = redis.createClient({
      url: process.env.REDIS_URL || 'redis://localhost:6379',
      socket: {
        reconnectStrategy: (retries) => {
          // Only try to reconnect once, then give up
          if (retries > 1) {
            console.warn('Redis connection failed. Caching will be disabled.');
            return false; // Stop trying to reconnect
          }
          return Math.min(retries * 50, 500);
        },
        connectTimeout: 5000, // 5 seconds timeout
      },
    });

    // Event handlers
    client.on('error', (err) => {
      if (!connectionAttempted) {
        console.warn('Redis Client Error:', err.message);
        console.warn('Redis is not available. Caching will be disabled.');
        connectionAttempted = true;
      }
    });

    client.on('connect', () => {
      console.log('Redis Client Connected');
      connectionAttempted = true;
    });

    client.on('ready', () => {
      console.log('Redis Client Ready');
    });

    client.on('end', () => {
      console.warn('Redis Client Disconnected');
    });

    return client;
  } catch (error) {
    console.warn('Failed to create Redis client:', error.message);
    return null;
  }
};

/**
 * Connect to Redis (optional)
 */
exports.connectRedis = async () => {
  if (redisClient && !connectionAttempted) {
    try {
      await redisClient.connect();
    } catch (error) {
      console.warn('Failed to connect to Redis:', error.message);
      console.warn('Caching will be disabled. You can start Redis later.');
      redisClient = null;
      connectionAttempted = true;
    }
  }
};

// Initialize Redis client
redisClient = exports.createRedisClient();

// Connect on module load
exports.connectRedis();

exports.redisClient = redisClient; 