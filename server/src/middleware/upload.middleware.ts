import multer from "multer";

const storage =
  multer.memoryStorage();

export const upload = multer({
  storage,

  limits: {
    fileSize:
      10 * 1024 * 1024,

    files: 1,
  },

  fileFilter: (
    _req,
    file,
    callback
  ) => {
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/gif",
      "image/avif",
    ];

    if (
      !allowedTypes.includes(
        file.mimetype
      )
    ) {
      return callback(
        new Error(
          "Invalid image format. Only JPG, PNG, WEBP, GIF and AVIF are supported."
        )
      );
    }

    callback(
      null,
      true
    );
  },
});