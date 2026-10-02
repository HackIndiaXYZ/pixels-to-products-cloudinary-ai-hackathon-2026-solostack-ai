import { Request, Response } from "express";

import Media from "../models/Media.js";

import {
  uploadImage,
  getOptimizedUrl,
  getOptimizedBytes,
  deleteImage,
} from "../services/cloudinary.service.js";

import { analyzeImage } from "../services/analysis.service.js";

/**
 * Upload media
 */
export async function uploadMedia(
  req: Request,
  res: Response
) {
  try {
    const userId = res.locals.userId;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No image uploaded",
      });
    }

    // Upload original to Cloudinary
    const result = await uploadImage(
      req.file.buffer,
      userId,
      req.file.originalname
    );

    // Generate optimized delivery URL
    const optimizedUrl =
      getOptimizedUrl(result.publicId);

    // Save media immediately
    const media = await Media.create({
      userId,

      originalName:
        req.file.originalname,

      publicId:
        result.publicId,

      assetId:
        result.assetId,

      secureUrl:
        result.secureUrl,

      optimizedUrl,

      format:
        result.format,

      resourceType:
        result.resourceType,

      bytes:
        result.bytes,

      width:
        result.width,

      height:
        result.height,

      tags: [],

      analysis: {
        status: "pending",
      },
    });

    /**
     * Measure optimized delivery in background.
     *
     * This is intentionally NOT awaited.
     * Upload response stays fast.
     */
    void getOptimizedBytes(
      result.publicId
    )
      .then(async (optimizedBytes) => {
        if (
          !optimizedBytes ||
          !Number.isFinite(optimizedBytes)
        ) {
          return;
        }

        await Media.updateOne(
          {
            _id: media._id,
            userId,
          },
          {
            $set: {
              optimizedBytes,
            },
          }
        );

        console.log(
          `✓ Optimized size: ${optimizedBytes} bytes`
        );
      })
      .catch((error) => {
        console.warn(
          "Background optimized size check failed:",
          error
        );
      });

    return res.status(201).json({
      success: true,

      message:
        "Media uploaded successfully",

      media,
    });
  } catch (error) {
    console.error(
      "Upload error:",
      error
    );

    return res.status(500).json({
      success: false,

      message:
        "Failed to upload media",
    });
  }
}

/**
 * Get user's media
 */
export async function getMedia(
  req: Request,
  res: Response
) {
  try {
    const userId =
      res.locals.userId;

    const page = Math.max(
      Number(req.query.page) || 1,
      1
    );

    const limit = Math.min(
      Math.max(
        Number(req.query.limit) || 20,
        1
      ),
      50
    );

    const skip =
      (page - 1) * limit;

    const [media, total] =
      await Promise.all([
        Media.find({ userId })
          .sort({
            createdAt: -1,
          })
          .skip(skip)
          .limit(limit)
          .lean(),

        Media.countDocuments({
          userId,
        }),
      ]);

    return res.json({
      success: true,

      data: media,

      pagination: {
        page,

        limit,

        total,

        totalPages:
          Math.ceil(
            total / limit
          ),
      },
    });
  } catch (error) {
    console.error(
      "Get media error:",
      error
    );

    return res.status(500).json({
      success: false,

      message:
        "Failed to fetch media",
    });
  }
}

/**
 * Get single media
 */
export async function getSingleMedia(
  req: Request,
  res: Response
) {
  try {
    const userId =
      res.locals.userId;

    const media =
      await Media.findOne({
        _id: req.params.id,
        userId,
      });

    if (!media) {
      return res.status(404).json({
        success: false,

        message:
          "Media not found",
      });
    }

    return res.json({
      success: true,

      data: media,
    });
  } catch (error) {
    console.error(
      "Get media error:",
      error
    );

    return res.status(500).json({
      success: false,

      message:
        "Failed to fetch media",
    });
  }
}

/**
 * AI analyze media
 */
export async function analyzeMedia(
  req: Request,
  res: Response
) {
  try {
    const userId =
      res.locals.userId;

    const media =
      await Media.findOne({
        _id: req.params.id,
        userId,
      });

    if (!media) {
      return res.status(404).json({
        success: false,

        message:
          "Media not found",
      });
    }

    // Mark analysis as pending
    media.analysis = {
      status: "pending",
    };

    await media.save();

    try {
      const result =
        await analyzeImage(
          media.assetId,
          media.secureUrl
        );

      // Save caption
      media.caption =
        result.caption;

      // Save full AI response
      media.analysis = {
        status: "completed",

        provider:
          "cloudinary",

        raw:
          result.raw,
      };

      await media.save();

      return res.json({
        success: true,

        message:
          "AI analysis completed",

        data: {
          id: media._id,

          caption:
            media.caption,

          analysis:
            media.analysis,
        },
      });
    } catch (analysisError) {
      console.error(
        "AI analysis error:",
        analysisError
      );

      media.analysis = {
        status: "failed",

        provider:
          "cloudinary",
      };

      await media.save();

      return res.status(502).json({
        success: false,

        message:
          "Image uploaded, but AI analysis is currently unavailable.",
      });
    }
  } catch (error) {
    console.error(
      "Analyze media error:",
      error
    );

    return res.status(500).json({
      success: false,

      message:
        "Failed to analyze media",
    });
  }
}

/**
 * Delete media
 */
export async function removeMedia(
  req: Request,
  res: Response
) {
  try {
    const userId =
      res.locals.userId;

    const media =
      await Media.findOne({
        _id: req.params.id,
        userId,
      });

    if (!media) {
      return res.status(404).json({
        success: false,

        message:
          "Media not found",
      });
    }

    // Delete Cloudinary original
    await deleteImage(
      media.publicId
    );

    // Delete MongoDB record
    await Media.deleteOne({
      _id: media._id,
    });

    return res.json({
      success: true,

      message:
        "Media deleted successfully",
    });
  } catch (error) {
    console.error(
      "Delete media error:",
      error
    );

    return res.status(500).json({
      success: false,

      message:
        "Failed to delete media",
    });
  }
}
export async function getMediaStats(
  req: Request,
  res: Response
) {
  try {
    const userId = res.locals.userId;

    const [summary] = await Media.aggregate([
      {
        $match: {
          userId,
        },
      },

      {
        $group: {
          _id: null,

          total: {
            $sum: 1,
          },

          optimized: {
            $sum: {
              $cond: [
                {
                  $and: [
                    {
                      $ne: [
                        "$optimizedUrl",
                        null,
                      ],
                    },
                    {
                      $ne: [
                        "$optimizedUrl",
                        "",
                      ],
                    },
                  ],
                },
                1,
                0,
              ],
            },
          },

          analyzed: {
            $sum: {
              $cond: [
                {
                  $eq: [
                    "$analysis.status",
                    "completed",
                  ],
                },
                1,
                0,
              ],
            },
          },

          pending: {
            $sum: {
              $cond: [
                {
                  $eq: [
                    "$analysis.status",
                    "pending",
                  ],
                },
                1,
                0,
              ],
            },
          },

          failed: {
            $sum: {
              $cond: [
                {
                  $eq: [
                    "$analysis.status",
                    "failed",
                  ],
                },
                1,
                0,
              ],
            },
          },

          originalBytes: {
            $sum: "$bytes",
          },

          measuredOriginalBytes: {
            $sum: {
              $cond: [
                {
                  $and: [
                    {
                      $gt: [
                        "$bytes",
                        0,
                      ],
                    },
                    {
                      $gt: [
                        {
                          $ifNull: [
                            "$optimizedBytes",
                            0,
                          ],
                        },
                        0,
                      ],
                    },
                  ],
                },
                "$bytes",
                0,
              ],
            },
          },

          optimizedBytes: {
            $sum: {
              $ifNull: [
                "$optimizedBytes",
                0,
              ],
            },
          },

          averageReduction: {
            $avg: {
              $cond: [
                {
                  $and: [
                    {
                      $gt: [
                        "$bytes",
                        0,
                      ],
                    },
                    {
                      $gt: [
                        {
                          $ifNull: [
                            "$optimizedBytes",
                            0,
                          ],
                        },
                        0,
                      ],
                    },
                  ],
                },

                {
                  $multiply: [
                    {
                      $divide: [
                        {
                          $subtract: [
                            "$bytes",
                            "$optimizedBytes",
                          ],
                        },
                        "$bytes",
                      ],
                    },
                    100,
                  ],
                },

                null,
              ],
            },
          },
        },
      },
    ]);

    const total =
      summary?.total || 0;

    const optimized =
      summary?.optimized || 0;

    const analyzed =
      summary?.analyzed || 0;

    const originalBytes =
      summary?.originalBytes || 0;

    const measuredOriginalBytes =
      summary?.measuredOriginalBytes || 0;

    const optimizedBytes =
      summary?.optimizedBytes || 0;

    const savedBytes = Math.max(
      measuredOriginalBytes -
        optimizedBytes,
      0
    );

    const savingsPercent =
      measuredOriginalBytes > 0
        ? (savedBytes /
            measuredOriginalBytes) *
          100
        : 0;

    return res.json({
      success: true,

      data: {
        total,
        optimized,
        analyzed,

        pending:
          summary?.pending || 0,

        failed:
          summary?.failed || 0,

        originalBytes,

        measuredOriginalBytes,

        optimizedBytes,

        savedBytes,

        savingsPercent,

        averageReduction:
          summary?.averageReduction || 0,
      },
    });
  } catch (error) {
    console.error(
      "Get media stats error:",
      error
    );

    return res.status(500).json({
      success: false,

      message:
        "Failed to calculate media statistics",
    });
  }
}