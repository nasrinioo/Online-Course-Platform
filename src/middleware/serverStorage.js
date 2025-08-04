const { serverStorage } = require("../utils/serverStorage");

const attachServerStorage = (req, res, next) => {
  req.serverStorage = serverStorage;

  req.getCurrentUserId = () => {
    return req.user?.id || req.body?.userId || req.params?.userId;
  };

  req.saveUserStoreIds = (storeIds) => {
    const userId = req.getCurrentUserId();
    if (!userId) {
      throw new Error("User ID not found in request");
    }
    return serverStorage.saveUserStoreIds(userId, storeIds);
  };

  req.getUserStoreIds = () => {
    const userId = req.getCurrentUserId();
    if (!userId) {
      return [];
    }
    return serverStorage.getUserStoreIds(userId);
  };

  req.saveUserCourses = (courses) => {
    const userId = req.getCurrentUserId();
    if (!userId) {
      throw new Error("User ID not found in request");
    }
    return serverStorage.saveUserCourses(userId, courses);
  };

  req.getUserCourses = () => {
    const userId = req.getCurrentUserId();
    if (!userId) {
      return [];
    }
    return serverStorage.getUserCourses(userId);
  };

  req.saveUserEnrollments = (enrollments) => {
    const userId = req.getCurrentUserId();
    if (!userId) {
      throw new Error("User ID not found in request");
    }
    return serverStorage.saveUserEnrollments(userId, enrollments);
  };

  req.getUserEnrollments = () => {
    const userId = req.getCurrentUserId();
    if (!userId) {
      return [];
    }
    return serverStorage.getUserEnrollments(userId);
  };

  req.saveUserProgress = (progress) => {
    const userId = req.getCurrentUserId();
    if (!userId) {
      throw new Error("User ID not found in request");
    }
    return serverStorage.saveUserProgress(userId, progress);
  };

  req.getUserProgress = () => {
    const userId = req.getCurrentUserId();
    if (!userId) {
      return {};
    }
    return serverStorage.getUserProgress(userId);
  };

  req.saveUserSession = (sessionData, options = {}) => {
    const userId = req.getCurrentUserId();
    if (!userId) {
      throw new Error("User ID not found in request");
    }
    return serverStorage.saveUserSession(userId, sessionData, options);
  };

  req.getUserSession = () => {
    const userId = req.getCurrentUserId();
    if (!userId) {
      return { success: false, data: null };
    }
    return serverStorage.getUserSession(userId);
  };

  req.saveUserPreferences = (preferences) => {
    const userId = req.getCurrentUserId();
    if (!userId) {
      throw new Error("User ID not found in request");
    }
    return serverStorage.saveUserPreferences(userId, preferences);
  };

  req.getUserPreferences = () => {
    const userId = req.getCurrentUserId();
    if (!userId) {
      return { success: false, data: null };
    }
    return serverStorage.getUserPreferences(userId);
  };

  req.clearUserData = () => {
    const userId = req.getCurrentUserId();
    if (!userId) {
      throw new Error("User ID not found in request");
    }
    return serverStorage.clearUserData(userId);
  };

  next();
};

const autoSaveUserData = (dataType) => {
  return (req, res, next) => {
    const originalJson = res.json;

    res.json = function (data) {
      if (data && req.getCurrentUserId()) {
        const userId = req.getCurrentUserId();

        switch (dataType) {
          case "stores":
            if (data.user?.Store) {
              const storeIds = data.user.Store.map((store) => store.id);
              serverStorage.saveUserStoreIds(userId, storeIds);
            }
            break;
          case "courses":
            if (data.courses) {
              serverStorage.saveUserCourses(userId, data.courses);
            }
            break;
          case "enrollments":
            if (data.enrollments) {
              serverStorage.saveUserEnrollments(userId, data.enrollments);
            }
            break;
          case "progress":
            if (data.progress) {
              serverStorage.saveUserProgress(userId, data.progress);
            }
            break;
        }
      }

      return originalJson.call(this, data);
    };

    next();
  };
};

const loadUserData = (dataType) => {
  return (req, res, next) => {
    const userId = req.getCurrentUserId();

    if (!userId) {
      return next();
    }

    try {
      let data = null;

      switch (dataType) {
        case "stores":
          data = serverStorage.getUserStoreIds(userId);
          break;
        case "courses":
          data = serverStorage.getUserCourses(userId);
          break;
        case "enrollments":
          data = serverStorage.getUserEnrollments(userId);
          break;
        case "progress":
          data = serverStorage.getUserProgress(userId);
          break;
        case "session":
          const sessionResult = serverStorage.getUserSession(userId);
          data = sessionResult.success ? sessionResult.data : null;
          break;
        case "preferences":
          const prefResult = serverStorage.getUserPreferences(userId);
          data = prefResult.success ? prefResult.data : null;
          break;
      }

      if (data) {
        res.locals[
          `user${dataType.charAt(0).toUpperCase() + dataType.slice(1)}`
        ] = data;
      }

      next();
    } catch (error) {
      console.error(`Error loading user ${dataType} data:`, error);
      next();
    }
  };
};

module.exports = {
  attachServerStorage,
  autoSaveUserData,
  loadUserData,
};
