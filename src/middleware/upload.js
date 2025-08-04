const { uploadSingle, uploadMultiple } = require("../utils/cloudinary");

exports.uploadSingleImage = (req, res, next) => {
  uploadSingle(req, res, (err) => {
    if (err) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({
          error: "File size too large. Maximum size is 5MB.",
        });
      }
      if (err.message === "Only image files are allowed") {
        return res.status(400).json({
          error: "Only image files (jpg, jpeg, png, gif, webp) are allowed.",
        });
      }
      return res.status(400).json({
        error: "File upload failed. Please try again.",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        error: "Please select an image to upload.",
      });
    }

    req.uploadedFile = {
      url: req.file.path,
      public_id: req.file.filename,
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
    };

    next();
  });
};

exports.uploadMultipleImages = (req, res, next) => {
  uploadMultiple(req, res, (err) => {
    if (err) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({
          error: "File size too large. Maximum size is 5MB per file.",
        });
      }
      if (err.message === "Only image files are allowed") {
        return res.status(400).json({
          error: "Only image files (jpg, jpeg, png, gif, webp) are allowed.",
        });
      }
      return res.status(400).json({
        error: "File upload failed. Please try again.",
      });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        error: "Please select at least one image to upload.",
      });
    }

    req.uploadedFiles = req.files.map((file) => ({
      url: file.path,
      public_id: file.filename,
      originalname: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
    }));

    next();
  });
};

exports.uploadAvatar = (req, res, next) => {
  uploadSingle(req, res, (err) => {
    if (err) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({
          error: "Avatar size too large. Maximum size is 5MB.",
        });
      }
      if (err.message === "Only image files are allowed") {
        return res.status(400).json({
          error: "Only image files (jpg, jpeg, png, gif, webp) are allowed.",
        });
      }
      return res.status(400).json({
        error: "Avatar upload failed. Please try again.",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        error: "Please select an avatar image to upload.",
      });
    }

    req.uploadedAvatar = {
      url: req.file.path,
      public_id: req.file.filename,
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
    };

    next();
  });
};
