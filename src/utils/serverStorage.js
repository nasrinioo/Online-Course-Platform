const crypto = require("crypto");

class ServerStorage {
  constructor() {
    this.storage = new Map();
    this.userSessions = new Map();
    this.cache = new Map();
    this.maxCacheSize = 1000;
  }

  generateUserKey(userId, dataType = "user") {
    return `user_${userId}_${dataType}`;
  }

  saveUserData(userId, data, options = {}) {
    try {
      const key = this.generateUserKey(userId, options.type || "data");
      const encryptedData = this.encryptData(JSON.stringify(data));

      this.storage.set(key, {
        data: encryptedData,
        timestamp: Date.now(),
        expiresAt: options.expiresAt || null,
        metadata: options.metadata || {},
      });

      this.cache.set(key, data);

      return {
        success: true,
        key,
        timestamp: Date.now(),
      };
    } catch (error) {
      console.error("Error saving user data:", error);
      return { success: false, error: error.message };
    }
  }

  getUserData(userId, options = {}) {
    try {
      const key = this.generateUserKey(userId, options.type || "data");
      const storedData = this.storage.get(key);

      if (!storedData) {
        return { success: false, data: null, error: "Data not found" };
      }

      if (storedData.expiresAt && Date.now() > storedData.expiresAt) {
        this.storage.delete(key);
        this.cache.delete(key);
        return { success: false, data: null, error: "Data expired" };
      }

      if (this.cache.has(key)) {
        return {
          success: true,
          data: this.cache.get(key),
          timestamp: storedData.timestamp,
          metadata: storedData.metadata,
        };
      }

      const decryptedData = this.decryptData(storedData.data);
      const data = JSON.parse(decryptedData);

      this.cache.set(key, data);

      return {
        success: true,
        data,
        timestamp: storedData.timestamp,
        metadata: storedData.metadata,
      };
    } catch (error) {
      console.error("Error getting user data:", error);
      return { success: false, data: null, error: error.message };
    }
  }

  updateUserData(userId, updates, options = {}) {
    try {
      const currentData = this.getUserData(userId, options);

      if (!currentData.success) {
        return currentData;
      }

      const updatedData = { ...currentData.data, ...updates };
      return this.saveUserData(userId, updatedData, options);
    } catch (error) {
      console.error("Error updating user data:", error);
      return { success: false, error: error.message };
    }
  }

  removeUserData(userId, options = {}) {
    try {
      const key = this.generateUserKey(userId, options.type || "data");
      const deleted = this.storage.delete(key);
      this.cache.delete(key);

      return { success: deleted };
    } catch (error) {
      console.error("Error removing user data:", error);
      return { success: false, error: error.message };
    }
  }

  saveUserSession(userId, sessionData, options = {}) {
    const sessionOptions = {
      type: "session",
      expiresAt: Date.now() + (options.duration || 24 * 60 * 60 * 1000), // Default 24 hours
      ...options,
    };

    return this.saveUserData(userId, sessionData, sessionOptions);
  }

  getUserSession(userId) {
    return this.getUserData(userId, { type: "session" });
  }

  saveUserPreferences(userId, preferences) {
    return this.saveUserData(userId, preferences, { type: "preferences" });
  }

  getUserPreferences(userId) {
    return this.getUserData(userId, { type: "preferences" });
  }

  saveUserStoreIds(userId, storeIds) {
    return this.saveUserData(userId, { storeIds }, { type: "stores" });
  }

  getUserStoreIds(userId) {
    const result = this.getUserData(userId, { type: "stores" });
    return result.success ? result.data.storeIds : [];
  }

  saveUserCourses(userId, courses) {
    return this.saveUserData(userId, { courses }, { type: "courses" });
  }

  getUserCourses(userId) {
    const result = this.getUserData(userId, { type: "courses" });
    return result.success ? result.data.courses : [];
  }

  saveUserEnrollments(userId, enrollments) {
    return this.saveUserData(userId, { enrollments }, { type: "enrollments" });
  }

  getUserEnrollments(userId) {
    const result = this.getUserData(userId, { type: "enrollments" });
    return result.success ? result.data.enrollments : [];
  }

  saveUserProgress(userId, progress) {
    return this.saveUserData(userId, { progress }, { type: "progress" });
  }

  getUserProgress(userId) {
    const result = this.getUserData(userId, { type: "progress" });
    return result.success ? result.data.progress : {};
  }

  hasUserData(userId, options = {}) {
    const key = this.generateUserKey(userId, options.type || "data");
    return this.storage.has(key);
  }

  getUserDataKeys(userId) {
    const keys = [];
    const prefix = `user_${userId}_`;

    for (const key of this.storage.keys()) {
      if (key.startsWith(prefix)) {
        keys.push(key);
      }
    }

    return keys;
  }

  clearUserData(userId) {
    try {
      const keys = this.getUserDataKeys(userId);
      let clearedCount = 0;

      for (const key of keys) {
        if (this.storage.delete(key)) {
          this.cache.delete(key);
          clearedCount++;
        }
      }

      return { success: true, clearedCount };
    } catch (error) {
      console.error("Error clearing user data:", error);
      return { success: false, error: error.message };
    }
  }

  getStorageStats() {
    return {
      totalItems: this.storage.size,
      cacheSize: this.cache.size,
      maxCacheSize: this.maxCacheSize,
      memoryUsage: process.memoryUsage(),
    };
  }

  cleanupExpiredData() {
    let cleanedCount = 0;
    const now = Date.now();

    for (const [key, value] of this.storage.entries()) {
      if (value.expiresAt && now > value.expiresAt) {
        this.storage.delete(key);
        this.cache.delete(key);
        cleanedCount++;
      }
    }

    return cleanedCount;
  }

  encryptData(data) {
    const algorithm = "aes-256-cbc";
    const key = crypto.scryptSync(
      process.env.ENCRYPTION_SECRET || "default-secret",
      "salt",
      32
    );
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(algorithm, key, iv);

    let encrypted = cipher.update(data, "utf8", "hex");
    encrypted += cipher.final("hex");

    return iv.toString("hex") + ":" + encrypted;
  }

  decryptData(encryptedData) {
    const algorithm = "aes-256-cbc";
    const key = crypto.scryptSync(
      process.env.ENCRYPTION_SECRET || "default-secret",
      "salt",
      32
    );
    const parts = encryptedData.split(":");
    const iv = Buffer.from(parts[0], "hex");
    const encrypted = parts[1];
    const decipher = crypto.createDecipheriv(algorithm, key, iv);

    let decrypted = decipher.update(encrypted, "hex", "utf8");
    decrypted += decipher.final("utf8");

    return decrypted;
  }
}

const serverStorage = new ServerStorage();

module.exports = {
  serverStorage,

  saveUserStoreIds: (userId, storeIds) =>
    serverStorage.saveUserStoreIds(userId, storeIds),
  getUserStoreIds: (userId) => serverStorage.getUserStoreIds(userId),

  saveUserCourses: (userId, courses) =>
    serverStorage.saveUserCourses(userId, courses),
  getUserCourses: (userId) => serverStorage.getUserCourses(userId),

  saveUserEnrollments: (userId, enrollments) =>
    serverStorage.saveUserEnrollments(userId, enrollments),
  getUserEnrollments: (userId) => serverStorage.getUserEnrollments(userId),

  saveUserProgress: (userId, progress) =>
    serverStorage.saveUserProgress(userId, progress),
  getUserProgress: (userId) => serverStorage.getUserProgress(userId),

  saveUserSession: (userId, sessionData, options) =>
    serverStorage.saveUserSession(userId, sessionData, options),
  getUserSession: (userId) => serverStorage.getUserSession(userId),

  saveUserPreferences: (userId, preferences) =>
    serverStorage.saveUserPreferences(userId, preferences),
  getUserPreferences: (userId) => serverStorage.getUserPreferences(userId),

  hasUserData: (userId, options) => serverStorage.hasUserData(userId, options),
  clearUserData: (userId) => serverStorage.clearUserData(userId),
  getStorageStats: () => serverStorage.getStorageStats(),
  cleanupExpiredData: () => serverStorage.cleanupExpiredData(),
};
