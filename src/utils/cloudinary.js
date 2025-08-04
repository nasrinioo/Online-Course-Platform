const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "online-course-platform",
    allowed_formats: ["jpg", "jpeg", "png", "gif", "webp"],
    transformation: [
      { width: 400, height: 400, crop: "fill", gravity: "face" },
      { quality: "auto" },
    ],
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"), false);
    }
  },
});

exports.uploadSingle = upload.single("image");

exports.uploadMultiple = upload.array("images", 5);

exports.uploadImage = async (file, options = {}) => {
  try {
    const uploadOptions = {
      folder: options.folder || "online-course-platform",
      transformation: [
        {
          width: options.width || 400,
          height: options.height || 400,
          crop: "fill",
          gravity: "face",
        },
        { quality: "auto" },
      ],
      ...options,
    };

    const result = await cloudinary.uploader.upload(
      file.path || file,
      uploadOptions
    );

    return {
      url: result.secure_url,
      public_id: result.public_id,
      width: result.width,
      height: result.height,
      format: result.format,
    };
  } catch (error) {
    throw new Error(`Image upload failed: ${error.message}`);
  }
};

exports.deleteImage = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    throw new Error(`Image deletion failed: ${error.message}`);
  }
};

exports.generateImageUrl = (publicId, options = {}) => {
  const transformation = [
    {
      width: options.width || 400,
      height: options.height || 400,
      crop: "fill",
    },
    { quality: "auto" },
  ];

  return cloudinary.url(publicId, {
    transformation,
    secure: true,
  });
};

exports.optimizeImage = {
  avatar: (publicId) =>
    cloudinary.url(publicId, {
      transformation: [
        { width: 150, height: 150, crop: "fill", gravity: "face" },
        { quality: "auto" },
      ],
      secure: true,
    }),

  thumbnail: (publicId) =>
    cloudinary.url(publicId, {
      transformation: [
        { width: 300, height: 200, crop: "fill" },
        { quality: "auto" },
      ],
      secure: true,
    }),

  courseImage: (publicId) =>
    cloudinary.url(publicId, {
      transformation: [
        { width: 600, height: 400, crop: "fill" },
        { quality: "auto" },
      ],
      secure: true,
    }),
};

module.exports = {
  cloudinary,
  upload,
  uploadSingle: exports.uploadSingle,
  uploadMultiple: exports.uploadMultiple,
  uploadImage: exports.uploadImage,
  deleteImage: exports.deleteImage,
  generateImageUrl: exports.generateImageUrl,
  optimizeImage: exports.optimizeImage,
};
