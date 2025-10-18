const express = require("express");
const cors = require("cors");

const authRoutes = require("../modules/Auth/auth.routes");
const userRoutes = require("../modules/User/user.routes");
const courseRoutes = require("../modules/Course/course.routes");
const categoryRoutes = require("../modules/Category/category.routes");

// TODO: Uncomment when modules are created
// const lessonRoutes = require("../modules/Lesson/lesson.routes");
// const enrollmentRoutes = require("../modules/Enrollment/enrollment.routes");
// const progressRoutes = require("../modules/Progress/progress.routes");
// const reviewRoutes = require("../modules/Review/review.routes");
// const paymentRoutes = require("../modules/Payment/payment.routes");
// const notificationRoutes = require("../modules/Notification/notification.routes");

const router = express.Router();

router.use("/healthz", cors(), (req, res) => {
  res.sendStatus(200);
});

router.use("/docs", cors(), (req, res) => {
  res.json({
    message: "Online Course Platform API",
    version: "1.0.0",
    endpoints: {
      auth: "/api/auth",
      users: "/api/users",
      courses: "/api/courses",
      categories: "/api/categories",
      // lessons: "/api/lessons",
      // enrollments: "/api/enrollments",
      // progress: "/api/progress",
      // reviews: "/api/reviews",
      // payments: "/api/payments",
      // notifications: "/api/notifications"
    },
    documentation: "https://your-api-docs.com",
  });
});

// CORS configuration for API routes
router.use(
  cors({
    credentials: true,
    origin: process.env.CORS_ORIGIN || "*",
    optionsSuccessStatus: 200,
    allowedHeaders: ["Content-Type", "Authorization"],
    exposedHeaders: ["Authorization", "Content-Type"],
    preflightContinue: false,
  })
);

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/courses", courseRoutes);
router.use("/categories", categoryRoutes);

// TODO: Uncomment when modules are created
// router.use("/lessons", lessonRoutes);
// router.use("/enrollments", enrollmentRoutes);
// router.use("/progress", progressRoutes);
// router.use("/reviews", reviewRoutes);
// router.use("/payments", paymentRoutes);
// router.use("/notifications", notificationRoutes);

// 404 handler for API routes
router.use("*", (req, res) => {
  res.status(404).json({
    error: "API endpoint not found",
    message: `The requested endpoint ${req.originalUrl} does not exist`,
    availableEndpoints: [
      "/api/auth",
      "/api/users",
      "/api/courses",
      "/api/categories",
      // "/api/lessons",
      // "/api/enrollments",
      // "/api/progress",
      // "/api/reviews",
      // "/api/payments",
      // "/api/notifications"
    ],
  });
});

module.exports = router;
