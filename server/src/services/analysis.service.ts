interface AnalysisResult {
  qualityScore?: number;

  qualityLevel?: "low" | "medium" | "high";

  caption?: string;

  raw?: unknown;
}

/**
 * Analyze an image using Cloudinary AI Content Analysis.
 */
export async function analyzeImage(
  _assetId: string,
  imageUrl: string
): Promise<AnalysisResult> {
  const cloudName =
    process.env.CLOUDINARY_CLOUD_NAME;

  const apiKey =
    process.env.CLOUDINARY_API_KEY;

  const apiSecret =
    process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error(
      "Cloudinary credentials are missing"
    );
  }

  const auth = Buffer.from(
    `${apiKey}:${apiSecret}`
  ).toString("base64");

  const response = await fetch(
    `https://api.cloudinary.com/v2/analysis/${cloudName}/analyze/captioning`,
    {
      method: "POST",

      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        source: {
          uri: imageUrl,
        },
      }),
    }
  );

  if (!response.ok) {
    const errorText =
      await response.text();

    throw new Error(
      `Cloudinary analysis failed: ${response.status} ${errorText}`
    );
  }

  const data = await response.json();

  console.log(
    "Cloudinary AI analysis response:",
    JSON.stringify(data, null, 2)
  );

  const caption = extractCaption(data);

  console.log(
    "Extracted AI caption:",
    caption ?? "NO CAPTION FOUND"
  );

  return {
    raw: data,
    caption,
  };
}

/**
 * Extract caption from Cloudinary Analyze API response.
 *
 * Current expected response:
 *
 * {
 *   data: {
 *     analysis: {
 *       data: {
 *         caption: "..."
 *       }
 *     }
 *   }
 * }
 */
function extractCaption(
  data: any
): string | undefined {
  if (!data) {
    return undefined;
  }

  // Current Cloudinary Analyze API response
  if (
    typeof data?.data?.analysis?.data
      ?.caption === "string"
  ) {
    return data.data.analysis.data.caption.trim();
  }

  // Fallback
  if (
    typeof data?.data?.analysis?.caption ===
    "string"
  ) {
    return data.data.analysis.caption.trim();
  }

  // Fallback
  if (
    typeof data?.data?.caption === "string"
  ) {
    return data.data.caption.trim();
  }

  // Fallback
  if (
    typeof data?.analysis?.data?.caption ===
    "string"
  ) {
    return data.analysis.data.caption.trim();
  }

  // Fallback
  if (
    typeof data?.analysis?.caption ===
    "string"
  ) {
    return data.analysis.caption.trim();
  }

  // Fallback
  if (
    typeof data?.caption === "string"
  ) {
    return data.caption.trim();
  }

  // Fallback
  if (
    typeof data?.result?.caption ===
    "string"
  ) {
    return data.result.caption.trim();
  }

  return undefined;
}