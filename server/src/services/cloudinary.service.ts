import { Readable } from "stream";

import cloudinary from "../config/cloudinary.js";

interface UploadResult {
  publicId: string;
  assetId: string;
  secureUrl: string;
  format: string;
  resourceType: string;
  bytes: number;
  width?: number;
  height?: number;
}

/**
 * Upload original image to Cloudinary.
 *
 * The original is preserved.
 * Optimization is handled through Cloudinary delivery transformations.
 */
export function uploadImage(
  buffer: Buffer,
  userId: string,
  originalName: string
): Promise<UploadResult> {
  return new Promise((resolve, reject) => {
    const safeName = originalName
      .replace(/\.[^/.]+$/, "")
      .replace(/[^a-zA-Z0-9-_]/g, "-")
      .toLowerCase();

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: `mediaguard/users/${userId}`,

        public_id: `${Date.now()}-${safeName}`,

        resource_type: "image",

        use_filename: false,

        unique_filename: true,

        overwrite: false,
      },

      (error, result) => {
        if (error || !result) {
          return reject(
            error ?? new Error("Cloudinary upload failed")
          );
        }

        resolve({
          publicId: result.public_id,
          assetId: result.asset_id,
          secureUrl: result.secure_url,
          format: result.format,
          resourceType: result.resource_type,
          bytes: result.bytes,
          width: result.width,
          height: result.height,
        });
      }
    );

    Readable.from(buffer).pipe(uploadStream);
  });
}

/**
 * Cloudinary optimized delivery URL.
 *
 * q_auto = automatic quality optimization
 * f_auto = automatic browser-compatible format selection
 *
 * The original Cloudinary asset is NOT modified.
 */
export function getOptimizedUrl(publicId: string): string {
  return cloudinary.url(publicId, {
    secure: true,

    resource_type: "image",

    transformation: [
      {
        quality: "auto",
      },
      {
        fetch_format: "auto",
      },
    ],
  });
}

/**
 * Try to determine the actual delivered size
 * of the optimized Cloudinary asset.
 *
 * HEAD is attempted first.
 *
 * If Content-Length is unavailable, a tiny range request
 * is attempted and Content-Range is inspected.
 */
export async function getOptimizedBytes(
  publicId: string
): Promise<number | undefined> {
  const optimizedUrl = getOptimizedUrl(publicId);

  try {
    // First attempt: HEAD
    const headResponse = await fetch(optimizedUrl, {
      method: "HEAD",
      headers: {
        Accept:
          "image/avif,image/webp,image/jpeg,image/png,image/*,*/*;q=0.8",
      },
    });

    if (headResponse.ok) {
      const contentLength =
        headResponse.headers.get("content-length");

      if (contentLength) {
        const bytes = Number(contentLength);

        if (Number.isFinite(bytes) && bytes > 0) {
          return bytes;
        }
      }
    }

    // Second attempt: request only the first byte.
    const rangeResponse = await fetch(optimizedUrl, {
      method: "GET",

      headers: {
        Range: "bytes=0-0",

        Accept:
          "image/avif,image/webp,image/jpeg,image/png,image/*,*/*;q=0.8",
      },
    });

    if (!rangeResponse.ok && rangeResponse.status !== 206) {
      return undefined;
    }

    const contentRange =
      rangeResponse.headers.get("content-range");

    if (contentRange) {
      const match = contentRange.match(/\/(\d+)$/);

      if (match) {
        const bytes = Number(match[1]);

        if (Number.isFinite(bytes) && bytes > 0) {
          return bytes;
        }
      }
    }

    const contentLength =
      rangeResponse.headers.get("content-length");

    if (contentLength) {
      const bytes = Number(contentLength);

      if (Number.isFinite(bytes) && bytes > 0) {
        return bytes;
      }
    }

    return undefined;
  } catch (error) {
    console.warn(
      "Optimized size check failed:",
      error
    );

    return undefined;
  }
}

/**
 * Delete original Cloudinary asset.
 *
 * Cloudinary derived assets associated with the asset
 * are also handled by Cloudinary according to its
 * invalidation/deletion behavior.
 */
export async function deleteImage(publicId: string) {
  return cloudinary.uploader.destroy(publicId, {
    resource_type: "image",
    invalidate: true,
  });
}