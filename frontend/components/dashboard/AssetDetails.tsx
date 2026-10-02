/* eslint-disable @next/next/no-img-element */
"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import Link from "next/link";

import {
  useParams,
  useRouter,
} from "next/navigation";

import {
  useMediaApi,
} from "@/lib/api";

import type {
  MediaItem,
} from "@/lib/api";

function formatBytes(
  bytes?: number
) {
  if (!bytes) return "—";

  const units = [
    "B",
    "KB",
    "MB",
    "GB",
  ];

  const index = Math.min(
    Math.floor(
      Math.log(bytes) /
        Math.log(1024)
    ),
    units.length - 1
  );

  return `${(
    bytes /
    Math.pow(1024, index)
  ).toFixed(index ? 1 : 0)} ${units[index]}`;
}

function getSavings(
  media: MediaItem
) {
  if (
    !media.optimizedBytes ||
    !media.bytes ||
    media.optimizedBytes >=
      media.bytes
  ) {
    return null;
  }

  return (
    ((media.bytes -
      media.optimizedBytes) /
      media.bytes) *
    100
  );
}

function getModelVersion(
  media: MediaItem
) {
  const raw =
    media.analysis?.raw as any;

  return (
    raw?.data?.analysis
      ?.model_version ??
    raw?.data?.analysis
      ?.data?.model_version ??
    raw?.analysis?.model_version ??
    null
  );
}

function getCaption(
  media: MediaItem
) {
  return (
    media.caption ||
    "No AI caption has been generated yet."
  );
}

export default function AssetDetails() {
  const params =
    useParams<{
      id: string;
    }>();

  const router =
    useRouter();

  const {
    getSingleMedia,
    analyzeMedia,
    deleteMedia,
  } = useMediaApi();

  const [media, setMedia] =
    useState<MediaItem | null>(
      null
    );

  const [loading, setLoading] =
    useState(true);

  const [analyzing, setAnalyzing] =
    useState(false);

  const [error, setError] =
    useState("");

  const [checkingOptimization, setCheckingOptimization] =
    useState(false);

  const load = useCallback(
    async () => {
      if (!params?.id) return;

      setError("");

      try {
        const result =
          await getSingleMedia(
            params.id
          );

        setMedia(
          result.data
        );
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Could not load this asset."
        );
      } finally {
        setLoading(false);
      }
    },
    [
      getSingleMedia,
      params?.id,
    ]
  );

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    if (
      !media ||
      media.optimizedBytes
    ) {
      return;
    }

    let active = true;

    async function poll() {
      setCheckingOptimization(
        true
      );

      try {
        for (
          let attempt = 0;
          attempt < 8;
          attempt++
        ) {
          await new Promise(
            (resolve) =>
              setTimeout(
                resolve,
                1000
              )
          );

          if (!active) return;

          try {
            const result =
              await getSingleMedia(
                media._id
              );

            if (!active) return;

            setMedia(
              result.data
            );

            if (
              result.data
                .optimizedBytes
            ) {
              break;
            }
          } catch {
            // Continue polling.
          }
        }
      } finally {
        if (active) {
          setCheckingOptimization(
            false
          );
        }
      }
    }

    void poll();

    return () => {
      active = false;
    };
  }, [
    media?._id,
    media?.optimizedBytes,
    getSingleMedia,
  ]);

  async function analyze() {
    if (
      !media ||
      analyzing
    ) {
      return;
    }

    setAnalyzing(true);

    setError("");

    try {
      const result =
        await analyzeMedia(
          media._id
        );

      setMedia(
        (current) =>
          current
            ? {
                ...current,

                caption:
                  result.data
                    ?.caption,

                analysis:
                  result.data
                    ?.analysis,
              }
            : current
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "AI analysis failed."
      );
    } finally {
      setAnalyzing(false);
    }
  }

  async function remove() {
    if (!media) return;

    const confirmed =
      window.confirm(
        `Delete "${media.originalName}"? This also removes the asset from Cloudinary.`
      );

    if (!confirmed) {
      return;
    }

    try {
      await deleteMedia(
        media._id
      );

      router.push(
        "/dashboard/media"
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Delete failed."
      );
    }
  }

  const savings =
    media
      ? getSavings(media)
      : null;

  const modelVersion =
    media
      ? getModelVersion(media)
      : null;

  const analysisComplete =
    media?.analysis
      ?.status ===
    "completed";

  const dimensions =
    media?.width &&
    media?.height
      ? `${media.width} × ${media.height}`
      : "—";

  const caption =
    media
      ? getCaption(media)
      : "";

  const pipeline = useMemo(
    () => [
      {
        label: "Uploaded",
        complete: Boolean(
          media
        ),
        description:
          "Original asset stored securely in Cloudinary.",
      },

      {
        label: "Optimized",
        complete:
          Boolean(
            media?.optimizedUrl
          ),
        description:
          "Cloudinary q_auto + f_auto delivery transformation.",
      },

      {
        label: "AI analyzed",
        complete:
          analysisComplete,
        description:
          "Cloudinary AI Content Analysis captioning.",
      },
    ],
    [
      media,
      analysisComplete,
    ]
  );

  if (loading) {
    return (
      <div className="mg-page">
        <div className="mg-detail-loading">
          Loading asset…
        </div>
      </div>
    );
  }

  if (!media) {
    return (
      <div className="mg-page">
        <Link
          href="/dashboard/media"
          className="mg-back-link"
        >
          ← Back to media library
        </Link>

        <div className="mg-detail-error">
          <h1>
            Asset not found
          </h1>

          <p>
            {error ||
              "This asset may have been deleted or is no longer available."}
          </p>

          <Link
            href="/dashboard/media"
            className="mg-primary-button"
          >
            Open media library
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mg-page">
      <div className="mg-detail-topbar">
        <Link
          href="/dashboard/media"
          className="mg-back-link"
        >
          ← Media library
        </Link>

        <div className="mg-detail-actions">
          <a
            href={
              media.optimizedUrl ||
              media.secureUrl
            }
            target="_blank"
            rel="noreferrer"
            className="mg-secondary-button"
          >
            Open optimized
          </a>

          <button
            type="button"
            className="mg-danger-button"
            onClick={remove}
          >
            Delete
          </button>
        </div>
      </div>

      <section className="mg-asset-header">
        <div>
          <span className="mg-eyebrow">
            Asset intelligence
          </span>

          <h1
            title={
              media.originalName
            }
          >
            {media.originalName}
          </h1>

          <p>
            {media.format.toUpperCase()} ·{" "}
            {dimensions}
          </p>
        </div>

        <div className="mg-asset-statuses">
          {media.optimizedUrl && (
            <span className="mg-detail-status">
              <i />
              Optimized
            </span>
          )}

          {analysisComplete && (
            <span className="mg-detail-status">
              <i />
              AI analyzed
            </span>
          )}
        </div>
      </section>

      {error && (
        <div
          className="mg-error"
          role="alert"
        >
          {error}
        </div>
      )}

      <section className="mg-asset-preview-grid">
        <div className="mg-asset-preview-panel">
          <div className="mg-panel-title">
            <span>
              Optimized delivery
            </span>

            {savings !==
              null && (
              <strong className="mg-savings-value">
                −
                {savings.toFixed(
                  1
                )}
                %
              </strong>
            )}
          </div>

          <div className="mg-asset-image-frame">
            <img
              src={
                media.optimizedUrl ||
                media.secureUrl
              }
              alt={
                media.originalName
              }
            />
          </div>

          <div className="mg-preview-footer">
            <span>
              Browser delivery
            </span>

            <strong>
              {media.optimizedBytes
                ? formatBytes(
                    media.optimizedBytes
                  )
                : checkingOptimization
                  ? "Measuring…"
                  : "Measured after delivery"}
            </strong>
          </div>
        </div>

        <div className="mg-asset-preview-panel">
          <div className="mg-panel-title">
            <span>
              Original asset
            </span>

            <span className="mg-muted-label">
              Source
            </span>
          </div>

          <div className="mg-asset-image-frame original">
            <img
              src={
                media.secureUrl
              }
              alt={`${media.originalName} original`}
            />
          </div>

          <div className="mg-preview-footer">
            <span>
              Stored original
            </span>

            <strong>
              {formatBytes(
                media.bytes
              )}
            </strong>
          </div>
        </div>
      </section>

      <section className="mg-detail-grid">
        <div className="mg-detail-main">
          <article className="mg-detail-panel">
            <div className="mg-panel-heading">
              <div>
                <span className="mg-eyebrow">
                  AI intelligence
                </span>

                <h2>
                  Image understanding
                </h2>
              </div>

              <button
                type="button"
                className="mg-secondary-button"
                onClick={
                  analyze
                }
                disabled={
                  analyzing
                }
              >
                {analyzing
                  ? "Analyzing…"
                  : analysisComplete
                    ? "Re-analyze"
                    : "Analyze with AI"}
              </button>
            </div>

            <div className="mg-ai-result">
              <span>
                Generated caption
              </span>

              <p>
                {caption}
              </p>
            </div>

            <div className="mg-ai-meta">
              <div>
                <span>
                  Provider
                </span>

                <strong>
                  {media.analysis
                    ?.provider ||
                    "—"}
                </strong>
              </div>

              <div>
                <span>
                  Model
                </span>

                <strong>
                  {modelVersion
                    ? `v${modelVersion}`
                    : "—"}
                </strong>
              </div>

              <div>
                <span>
                  Status
                </span>

                <strong>
                  {media.analysis
                    ?.status ||
                    "pending"}
                </strong>
              </div>
            </div>
          </article>

          <article className="mg-detail-panel">
            <div className="mg-panel-heading">
              <div>
                <span className="mg-eyebrow">
                  Optimization
                </span>

                <h2>
                  Delivery impact
                </h2>
              </div>
            </div>

            <div className="mg-metric-grid">
              <div>
                <span>
                  Original
                </span>

                <strong>
                  {formatBytes(
                    media.bytes
                  )}
                </strong>
              </div>

              <div>
                <span>
                  Optimized
                </span>

                <strong>
                  {media.optimizedBytes
                    ? formatBytes(
                        media.optimizedBytes
                      )
                    : checkingOptimization
                      ? "Measuring…"
                      : "—"}
                </strong>
              </div>

              <div>
                <span>
                  Saved
                </span>

                <strong>
                  {media.optimizedBytes
                    ? formatBytes(
                        Math.max(
                          media.bytes -
                            media.optimizedBytes,
                          0
                        )
                      )
                    : "—"}
                </strong>
              </div>

              <div>
                <span>
                  Reduction
                </span>

                <strong>
                  {savings !==
                  null
                    ? `${savings.toFixed(
                        1
                      )}%`
                    : "—"}
                </strong>
              </div>
            </div>

            <div className="mg-optimization-note">
              Cloudinary automatically selects
              quality and delivery format for
              optimized browser delivery.
            </div>
          </article>
        </div>

        <aside className="mg-detail-side">
          <article className="mg-detail-panel">
            <div className="mg-panel-heading">
              <div>
                <span className="mg-eyebrow">
                  Pipeline
                </span>

                <h2>
                  Processing status
                </h2>
              </div>
            </div>

            <div className="mg-pipeline">
              {pipeline.map(
                (
                  step,
                  index
                ) => (
                  <div
                    className={`mg-pipeline-row ${
                      step.complete
                        ? "is-complete"
                        : ""
                    }`}
                    key={
                      step.label
                    }
                  >
                    <div className="mg-pipeline-marker">
                      {step.complete
                        ? "✓"
                        : index + 1}
                    </div>

                    <div>
                      <strong>
                        {step.label}
                      </strong>

                      <p>
                        {
                          step.description
                        }
                      </p>
                    </div>
                  </div>
                )
              )}
            </div>
          </article>

          <article className="mg-detail-panel">
            <div className="mg-panel-heading">
              <div>
                <span className="mg-eyebrow">
                  Metadata
                </span>

                <h2>
                  Technical details
                </h2>
              </div>
            </div>

            <div className="mg-metadata-list">
              <div>
                <span>
                  Format
                </span>

                <strong>
                  {media.format.toUpperCase()}
                </strong>
              </div>

              <div>
                <span>
                  Dimensions
                </span>

                <strong>
                  {dimensions}
                </strong>
              </div>

              <div>
                <span>
                  Resource type
                </span>

                <strong>
                  {media.resourceType}
                </strong>
              </div>

              <div>
                <span>
                  Asset ID
                </span>

                <strong
                  title={
                    media.assetId
                  }
                >
                  {media.assetId.slice(
                    0,
                    16
                  )}
                  …
                </strong>
              </div>
            </div>
          </article>
        </aside>
      </section>
    </div>
  );
}