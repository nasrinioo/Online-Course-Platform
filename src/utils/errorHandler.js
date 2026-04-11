/**
 * Centralized error handling utility for the Online Course Platform
 * Provides consistent error responses across all modules
 */

class ErrorHandler {
  /**
   * Handle common database and business logic errors
   * @param {Error} error - The error object
   * @param {Object} res - Express response object
   * @param {string} operation - Operation name for logging
   * @returns {Object} JSON response
   */
  static handle(error, res, operation = "operation") {
    console.error(`${operation} error:`, error);

    // Database constraint errors
    if (error.code === "P2002") {
      return res.status(409).json({
        error: "Resource already exists",
        message: this.getConstraintMessage(error.meta),
      });
    }

    if (error.code === "P2003") {
      return res.status(400).json({
        error: "Invalid reference",
        message: "Referenced resource does not exist",
      });
    }

    if (error.code === "P2025") {
      return res.status(404).json({
        error: "Record not found",
        message: "The requested resource was not found",
      });
    }

    // Business logic errors
    if (error.message === "Course not found") {
      return res.status(404).json({ error: "Course not found" });
    }

    if (error.message === "Instructor not found") {
      return res.status(400).json({ error: "Invalid instructor ID" });
    }

    if (error.message === "User is not an instructor") {
      return res.status(400).json({ error: "User is not an instructor" });
    }

    if (error.message === "Not authorized to update this course") {
      return res
        .status(403)
        .json({ error: "Not authorized to update this course" });
    }

    if (error.message === "Not authorized to delete this course") {
      return res
        .status(403)
        .json({ error: "Not authorized to delete this course" });
    }

    if (error.message === "Category not found") {
      return res.status(404).json({ error: "Category not found" });
    }

    if (error.message === "Category with this name already exists") {
      return res
        .status(409)
        .json({ error: "Category with this name already exists" });
    }

    if (error.message === "Cannot delete category with existing courses") {
      return res
        .status(400)
        .json({ error: "Cannot delete category with existing courses" });
    }

    if (error.message === "User not found") {
      return res.status(404).json({ error: "User not found" });
    }

    if (error.message === "User already exists") {
      return res.status(409).json({ error: "User already exists" });
    }

    if (error.message === "Invalid credentials") {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    if (error.message === "Account is deactivated") {
      return res.status(403).json({ error: "Account is deactivated" });
    }

    const notFoundMessages = new Set([
      "Lesson not found",
      "Enrollment not found",
      "Review not found",
      "Payment not found",
      "Notification not found",
    ]);
    if (notFoundMessages.has(error.message)) {
      return res.status(404).json({ error: error.message });
    }

    const forbiddenMessages = new Set([
      "Not authorized to manage lessons for this course",
      "Not authorized to update this lesson",
      "Not authorized to delete this lesson",
      "Not authorized to view this enrollment",
      "Not authorized to view enrollments for this course",
      "Not authorized to update this enrollment",
      "Must be enrolled to update lesson progress",
      "Must be enrolled to review this course",
      "Not authorized to update this review",
      "Not authorized to delete this review",
      "Not authorized to view this payment",
      "Not authorized to update payment status",
      "Not authorized to create notifications",
    ]);
    if (forbiddenMessages.has(error.message)) {
      return res.status(403).json({ error: error.message });
    }

    if (error.message === "Already enrolled in this course") {
      return res.status(409).json({ error: error.message });
    }

    if (error.message === "You have already reviewed this course") {
      return res.status(409).json({ error: error.message });
    }

    if (error.message === "Course is not available for enrollment") {
      return res.status(400).json({ error: error.message });
    }

    if (error.message === "Payment required before enrollment") {
      return res.status(400).json({ error: error.message });
    }

    if (error.message === "Invalid payment amount") {
      return res.status(400).json({ error: error.message });
    }

    if (error.message === "Current password is incorrect") {
      return res.status(400).json({ error: "Current password is incorrect" });
    }

    // Validation errors
    if (error.name === "ValidationError") {
      return res.status(400).json({
        error: "Validation failed",
        details: error.details || error.message,
      });
    }

    // JWT errors
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ error: "Invalid token" });
    }

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Token expired" });
    }

    // Default error
    return res.status(500).json({ error: "Internal server error" });
  }

  /**
   * Get user-friendly constraint violation message
   * @param {Object} meta - Prisma error metadata
   * @returns {string} User-friendly message
   */
  static getConstraintMessage(meta) {
    if (!meta || !meta.target) return "Resource already exists";

    const fields = Array.isArray(meta.target) ? meta.target : [meta.target];

    if (fields.includes("email")) {
      return "User with this email already exists";
    }
    if (fields.includes("title")) {
      return "Course with this title already exists";
    }
    if (fields.includes("name")) {
      return "Category with this name already exists";
    }

    return "Resource with these values already exists";
  }

  /**
   * Handle async controller methods with automatic error handling
   * @param {Function} fn - Async controller function
   * @param {string} operation - Operation name for logging
   * @returns {Function} Express middleware function
   */
  static asyncHandler(fn, operation) {
    return async (req, res, next) => {
      try {
        await fn(req, res, next);
      } catch (error) {
        this.handle(error, res, operation);
      }
    };
  }

  /**
   * Create a standardized success response
   * @param {Object} res - Express response object
   * @param {number} statusCode - HTTP status code
   * @param {string} message - Success message
   * @param {Object} data - Response data
   * @returns {Object} JSON response
   */
  static success(res, statusCode = 200, message, data = null) {
    const response = { message };
    if (data) {
      response.data = data;
    }
    return res.status(statusCode).json(response);
  }

  /**
   * Create a standardized error response
   * @param {Object} res - Express response object
   * @param {number} statusCode - HTTP status code
   * @param {string} error - Error message
   * @param {Object} details - Additional error details
   * @returns {Object} JSON response
   */
  static error(res, statusCode, error, details = null) {
    const response = { error };
    if (details) {
      response.details = details;
    }
    return res.status(statusCode).json(response);
  }
}

module.exports = ErrorHandler;
