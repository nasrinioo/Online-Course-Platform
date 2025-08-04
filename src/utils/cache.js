const redisClient = require('../config/redis');

const CACHE_TTL = 3600; // 1 hour in seconds

exports.setCache = async (key, data, ttl = CACHE_TTL) => {
  if (!redisClient) {
    console.warn('Redis not available. Cache set skipped.');
    return;
  }
  
  try {
    await redisClient.setEx(key, ttl, JSON.stringify(data));
  } catch (error) {
    console.error('Cache set error:', error);
  }
};

exports.getCache = async (key) => {
  if (!redisClient) {
    console.warn('Redis not available. Cache get skipped.');
    return null;
  }
  
  try {
    const data = await redisClient.get(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Cache get error:', error);
    return null;
  }
};

exports.deleteCache = async (key) => {
  if (!redisClient) {
    console.warn('Redis not available. Cache delete skipped.');
    return;
  }
  
  try {
    await redisClient.del(key);
  } catch (error) {
    console.error('Cache delete error:', error);
  }
};

exports.clearCache = async () => {
  if (!redisClient) {
    console.warn('Redis not available. Cache clear skipped.');
    return;
  }
  
  try {
    await redisClient.flushAll();
  } catch (error) {
    console.error('Cache clear error:', error);
  }
};

// Trending courses cache keys
exports.TRENDING_COURSES_KEY = 'trending_courses';
exports.COURSE_DETAILS_KEY = (courseId) => `course:${courseId}`; 