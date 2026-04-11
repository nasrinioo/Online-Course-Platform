const express = require("express");
const { listMine, upsertLessonProgress } = require("./progress.controller");
const { auth } = require("../../middleware/auth");
const { validateProgressUpsert } = require("./progress.validation");
const { handleValidationErrors } = require("../../middleware/validation");

const router = express.Router();

router.use(auth);

router.get("/me", listMine);
router.put(
  "/lessons/:lessonId",
  validateProgressUpsert,
  handleValidationErrors,
  upsertLessonProgress
);

module.exports = router;
