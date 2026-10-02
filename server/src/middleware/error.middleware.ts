import {
  Request,
  Response,
  NextFunction,
} from "express";

export function errorHandler(
  error: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  console.error(
    "Global error:",
    error
  );

  // Multer file too large
  if (
    error?.code ===
    "LIMIT_FILE_SIZE"
  ) {
    return res.status(413).json({
      success: false,

      message:
        "File is too large. Maximum size is 10 MB.",
    });
  }

  // Multer/file validation error
  if (
    error?.message?.startsWith(
      "Invalid image format"
    )
  ) {
    return res.status(400).json({
      success: false,

      message:
        error.message,
    });
  }

  return res.status(500).json({
    success: false,

    message:
      error?.message ||
      "Internal server error",
  });
}