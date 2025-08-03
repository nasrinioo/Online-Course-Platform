const express = require("express");
const cors = require("cors");

const authRoutes = require("../modules/Auth/AuthRoutes");
const userRoutes = require("../modules/User/UserRoutes");
const courseRoutes = require("../modules/Course/CourseRoutes");

// TODO: Uncomment when modules are created
// const lessonRoutes = require("../modules/Lesson/LessonRoutes");
// const enrollmentRoutes = require("../modules/Enrollment/EnrollmentRoutes");
// const progressRoutes = require("../modules/Progress/ProgressRoutes");

const router = express.Router();

router.use("/healthz", cors(), (req, res) => {
  res.sendStatus(200);
});

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

// TODO: Uncomment when modules are created
// router.use("/lessons", lessonRoutes);
// router.use("/enrollments", enrollmentRoutes);
// router.use("/progress", progressRoutes);

module.exports = router;
