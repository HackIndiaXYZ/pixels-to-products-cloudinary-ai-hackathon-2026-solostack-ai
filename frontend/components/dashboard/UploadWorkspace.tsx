/* eslint-disable @next/next/no-img-element */
"use client";

import {
  DragEvent,
  useEffect,
  useRef,
  useState,
} from "react";

import Link from "next/link";

import { useAuth } from "@clerk/nextjs";

import {
  API_URL,
  apiFetch,
  type MediaItem,
} from "@/lib/api";

const MAX_SIZE =
  10 * 1024 * 1024;

const ACCEPTED = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
];

function formatBytes(
  bytes: number
) {
  if (!bytes) return "0 B";

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

export default function UploadWorkspace() {
  const { getToken } =
    useAuth();

  const inputRef =
    useRef<HTMLInputElement>(
      null
    );

  const [file, setFile] =
    useState<File | null>(null);

  const [preview, setPreview] =
    useState("");

  const [dragging, setDragging] =
    useState(false);

  const [progress, setProgress] =
    useState(0);

  const [uploading, setUploading] =
    useState(false);

  const [uploaded, setUploaded] =
    useState<MediaItem | null>(
      null
    );

  const [analyzing, setAnalyzing] =
    useState(false);

  const [error, setError] =
    useState("");

  const [optimizationChecking, setOptimizationChecking] =
    useState(false);

  useEffect(() => {
    if (!file) {
      setPreview("");
      return;
    }

    const url =
      URL.createObjectURL(file);

    setPreview(url);

    return () =>
      URL.revokeObjectURL(url);
  }, [file]);

  function chooseFile(
    next: File | undefined
  ) {
    setError("");
    setUploaded(null);
    setProgress(0);

    if (!next) return;

    if (
      !ACCEPTED.includes(
        next.type
      )
    ) {
      setError(
        "Use JPG, PNG, WEBP, GIF or AVIF images."
      );

      return;
    }

    if (next.size > MAX_SIZE) {
      setError(
        "The maximum image size is 10 MB."
      );

      return;
    }

    setFile(next);
  }

  function onDrop(
    event: DragEvent<HTMLDivElement>
  ) {
    event.preventDefault();

    setDragging(false);

    chooseFile(
      event.dataTransfer.files?.[0]
    );
  }

  async function waitForOptimization(
    id: string
  ) {
    setOptimizationChecking(
      true
    );

    try {
      for (
        let attempt = 0;
        attempt < 10;
        attempt++
      ) {
        await new Promise(
          (resolve) =>
            setTimeout(
              resolve,
              1000
            )
        );

        try {
          const result =
            await apiFetch<{
              success: boolean;
              data: MediaItem;
            }>(
              `/api/media/${id}`,
              getToken
            );

          const latest =
            result.data;

          setUploaded(
            (current) =>
              current
                ? {
                    ...current,
                    ...latest,
                  }
                : latest
          );

          if (
            latest.optimizedBytes
          ) {
            break;
          }
        } catch {
          // Keep polling.
        }
      }
    } finally {
      setOptimizationChecking(
        false
      );
    }
  }

  async function runAnalysis(
    media: MediaItem
  ) {
    setAnalyzing(true);
    setError("");

    setUploaded(
      (current) =>
        current
          ? {
              ...current,

              analysis: {
                ...(current.analysis ||
                  {}),

                status:
                  "pending",
              },
            }
          : current
    );

    try {
      const result =
        await apiFetch<{
          success: boolean;

          message: string;

          data?: {
            caption?: string;

            analysis?: MediaItem["analysis"];
          };
        }>(
          `/api/media/${media._id}/analyze`,
          getToken,
          {
            method: "POST",
          }
        );

      setUploaded(
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
      console.error(
        "Automatic AI analysis failed:",
        err
      );

      setUploaded(
        (current) =>
          current
            ? {
                ...current,

                analysis: {
                  ...(current.analysis ||
                    {}),

                  status:
                    "failed",
                },
              }
            : current
      );

      setError(
        "Image uploaded successfully, but AI analysis could not be completed. You can retry it from the asset details page."
      );
    } finally {
      setAnalyzing(false);
    }
  }

  async function upload() {
    if (
      !file ||
      uploading
    ) {
      return;
    }

    setError("");

    setUploaded(null);

    setUploading(true);

    setProgress(0);

    try {
      const token =
        await getToken();

      if (!token) {
        throw new Error(
          "Your session has expired. Please sign in again."
        );
      }

      const formData =
        new FormData();

      formData.append(
        "file",
        file
      );

      const result =
        await new Promise<{
          media: MediaItem;
        }>(
          (
            resolve,
            reject
          ) => {
            const xhr =
              new XMLHttpRequest();

            xhr.open(
              "POST",
              `${API_URL}/api/media/upload`
            );

            xhr.setRequestHeader(
              "Authorization",
              `Bearer ${token}`
            );

            xhr.upload.onprogress =
              (event) => {
                if (
                  event.lengthComputable
                ) {
                  setProgress(
                    Math.round(
                      (event.loaded /
                        event.total) *
                        100
                    )
                  );
                }
              };

            xhr.onload = () => {
              try {
                const body =
                  JSON.parse(
                    xhr.responseText
                  );

                if (
                  xhr.status >=
                    200 &&
                  xhr.status < 300
                ) {
                  resolve(body);
                } else {
                  reject(
                    new Error(
                      body?.message ||
                        `Upload failed (${xhr.status})`
                    )
                  );
                }
              } catch {
                reject(
                  new Error(
                    "The server returned an invalid response."
                  )
                );
              }
            };

            xhr.onerror = () =>
              reject(
                new Error(
                  "Network error. Check that the MediaGuard API is running."
                )
              );

            xhr.onabort = () =>
              reject(
                new Error(
                  "Upload cancelled."
                )
              );

            xhr.send(
              formData
            );
          }
        );

      setUploaded(
        result.media
      );

      setProgress(100);

      // Start optimization metric polling.
      void waitForOptimization(
        result.media._id
      );

      // Start AI analysis automatically.
      void runAnalysis(
        result.media
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Upload failed."
      );
    } finally {
      setUploading(false);
    }
  }

  function reset() {
    if (uploading) return;

    setFile(null);

    setUploaded(null);

    setProgress(0);

    setError("");

    setOptimizationChecking(
      false
    );

    setAnalyzing(false);

    if (inputRef.current) {
      inputRef.current.value =
        "";
    }
  }

  const savings =
    uploaded
      ? getSavings(
          uploaded
        )
      : null;

  return (
    <div className="mg-page">
      <section className="mg-page-head">
        <div>
          <span className="mg-eyebrow">
            Media pipeline
          </span>

          <h1>
            Upload & optimize
          </h1>

          <p>
            Upload once. MediaGuard
            automatically optimizes delivery
            and generates AI media intelligence.
          </p>
        </div>

        <Link
          href="/dashboard/media"
          className="mg-ghost-button"
        >
          Open library
        </Link>
      </section>

      <div className="mg-upload-layout">
        <section className="mg-panel">
          <div
            className={`mg-dropzone ${
              dragging
                ? "is-dragging"
                : ""
            } ${
              file
                ? "has-file"
                : ""
            }`}
            onDragOver={(event) => {
              event.preventDefault();

              setDragging(true);
            }}
            onDragLeave={() =>
              setDragging(false)
            }
            onDrop={onDrop}
            onClick={() =>
              !file &&
              inputRef.current?.click()
            }
          >
            <input
              ref={inputRef}
              type="file"
              hidden
              accept={ACCEPTED.join(
                ","
              )}
              onChange={(event) =>
                chooseFile(
                  event.target
                    .files?.[0]
                )
              }
            />

            {!file ? (
              <>
                <div className="mg-drop-icon">
                  <svg
                    width="26"
                    height="26"
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M12 16V4M7 9l5-5 5 5"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />

                    <path
                      d="M5 16v3a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-3"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>

                <h2>
                  Drop your product image here
                </h2>

                <p>
                  or click to browse from
                  your device
                </p>

                <span>
                  JPG · PNG · WEBP · GIF · AVIF ·
                  up to 10 MB
                </span>
              </>
            ) : (
              <div className="mg-preview-wrap">
                <img
                  src={preview}
                  alt="Selected product preview"
                  className="mg-preview"
                />

                <div className="mg-file-meta">
                  <strong>
                    {file.name}
                  </strong>

                  <span>
                    {formatBytes(
                      file.size
                    )}{" "}
                    ·{" "}
                    {file.type
                      .split(
                        "/"
                      )[1]
                      ?.toUpperCase()}
                  </span>
                </div>
              </div>
            )}
          </div>

          {error && (
            <div
              className="mg-error"
              role="alert"
            >
              {error}
            </div>
          )}

          <div className="mg-upload-actions">
            {file &&
              !uploaded && (
                <button
                  type="button"
                  className="mg-primary-button"
                  onClick={
                    upload
                  }
                  disabled={
                    uploading
                  }
                >
                  {uploading
                    ? `Uploading ${progress}%`
                    : "Start media pipeline"}
                </button>
              )}

            {uploaded && (
              <>
                <Link
                  href={`/dashboard/media/${uploaded._id}`}
                  className="mg-primary-button"
                >
                  View asset
                </Link>

                <button
                  type="button"
                  className="mg-secondary-button"
                  onClick={
                    reset
                  }
                >
                  Upload another
                </button>
              </>
            )}
          </div>

          {uploading && (
            <div className="mg-progress">
              <div
                style={{
                  width: `${progress}%`,
                }}
              />
            </div>
          )}

          {uploaded && (
            <div className="mg-upload-result">
              <div className="mg-result-heading">
                <strong>
                  Pipeline status
                </strong>

                <span>
                  {uploaded.originalName}
                </span>
              </div>

              <div className="mg-pipeline-grid">
                <div className="mg-pipeline-item is-complete">
                  <span>01</span>

                  <div>
                    <strong>
                      Uploaded
                    </strong>

                    <small>
                      {formatBytes(
                        uploaded.bytes
                      )}
                    </small>
                  </div>
                </div>

                <div
                  className={`mg-pipeline-item ${
                    uploaded.optimizedUrl
                      ? "is-complete"
                      : ""
                  }`}
                >
                  <span>02</span>

                  <div>
                    <strong>
                      Optimized
                    </strong>

                    <small>
                      {optimizationChecking
                        ? "Measuring delivery…"
                        : uploaded.optimizedBytes
                          ? `${formatBytes(
                              uploaded.optimizedBytes
                            )} delivered`
                          : "Cloudinary delivery ready"}
                    </small>
                  </div>
                </div>

                <div
                  className={`mg-pipeline-item ${
                    uploaded.analysis
                      ?.status ===
                    "completed"
                      ? "is-complete"
                      : ""
                  }`}
                >
                  <span>03</span>

                  <div>
                    <strong>
                      AI analysis
                    </strong>

                    <small>
                      {analyzing
                        ? "Generating caption…"
                        : uploaded.analysis
                            ?.status ===
                            "completed"
                          ? "Completed"
                          : uploaded.analysis
                                ?.status ===
                              "failed"
                            ? "Failed — retry from details"
                            : "Starting…"}
                    </small>
                  </div>
                </div>
              </div>

              {savings !== null && (
                <div className="mg-upload-savings">
                  <strong>
                    {savings.toFixed(
                      1
                    )}% smaller delivery
                  </strong>

                  <span>
                    {formatBytes(
                      uploaded.bytes
                    )}{" "}
                    →{" "}
                    {formatBytes(
                      uploaded.optimizedBytes!
                    )}
                  </span>
                </div>
              )}

              {uploaded.caption && (
                <div className="mg-upload-caption">
                  <span>
                    AI caption
                  </span>

                  <p>
                    {uploaded.caption}
                  </p>
                </div>
              )}
            </div>
          )}
        </section>

        <aside className="mg-panel mg-side-panel">
          <div className="mg-panel-title">
            <span>
              Media pipeline
            </span>

            <span className="mg-live-dot">
              LIVE
            </span>
          </div>

          <div className="mg-step is-active">
            <span>01</span>

            <div>
              <strong>
                Upload
              </strong>

              <p>
                Securely transfer your
                original image to Cloudinary.
              </p>
            </div>
          </div>

          <div
            className={`mg-step ${
              uploaded
                ? "is-active"
                : ""
            }`}
          >
            <span>02</span>

            <div>
              <strong>
                Optimize
              </strong>

              <p>
                q_auto + f_auto optimize
                the delivered asset.
              </p>
            </div>
          </div>

          <div
            className={`mg-step ${
              uploaded?.analysis
                ?.status ===
              "completed"
                ? "is-active"
                : ""
            }`}
          >
            <span>03</span>

            <div>
              <strong>
                AI analysis
              </strong>

              <p>
                Cloudinary AI Content Analysis
                generates media intelligence.
              </p>
            </div>
          </div>

          <div className="mg-result">
            <span>
              Supported formats
            </span>

            <strong>
              JPG · PNG · WEBP · GIF · AVIF
            </strong>

            <small>
              Maximum upload size: 10 MB
            </small>
          </div>
        </aside>
      </div>
    </div>
  );
}