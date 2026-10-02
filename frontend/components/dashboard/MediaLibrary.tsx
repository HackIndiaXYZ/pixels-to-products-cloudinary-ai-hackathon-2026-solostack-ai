/* eslint-disable @next/next/no-img-element */
"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import Link from "next/link";

import {
  useMediaApi,
} from "@/lib/api";

import type {
  MediaItem,
} from "@/lib/api";

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
  item: MediaItem
) {
  if (
    !item.optimizedBytes ||
    !item.bytes ||
    item.optimizedBytes >=
      item.bytes
  ) {
    return null;
  }

  return (
    ((item.bytes -
      item.optimizedBytes) /
      item.bytes) *
    100
  );
}

function getStatus(
  item: MediaItem
) {
  if (
    item.analysis?.status ===
    "completed"
  ) {
    return "Analyzed";
  }

  if (
    item.analysis?.status ===
    "failed"
  ) {
    return "AI failed";
  }

  if (item.optimizedUrl) {
    return "Optimized";
  }

  return "Uploaded";
}

export default function MediaLibrary() {
  const {
    getMedia,
    deleteMedia,
    analyzeMedia,
  } = useMediaApi();

  const [items, setItems] =
    useState<MediaItem[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [loadingMore, setLoadingMore] =
    useState(false);

  const [query, setQuery] =
    useState("");

  const [filter, setFilter] =
    useState<
      "all" |
      "analyzed" |
      "optimized" |
      "pending"
    >("all");

  const [busyId, setBusyId] =
    useState("");

  const [error, setError] =
    useState("");

  const [page, setPage] =
    useState(1);

  const [hasMore, setHasMore] =
    useState(false);

  async function load(
    requestedPage = 1,
    append = false
  ) {
    if (append) {
      setLoadingMore(true);
    } else {
      setLoading(true);
    }

    setError("");

    try {
      const result =
        await getMedia(
          `?page=${requestedPage}&limit=24`
        );

      setItems(
        (current) =>
          append
            ? [
                ...current,
                ...(result.data || []),
              ]
            : result.data || []
      );

      setPage(
        result.pagination?.page ||
          requestedPage
      );

      setHasMore(
        (result.pagination?.page || 1) <
          (result.pagination
            ?.totalPages || 1)
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Could not load media."
      );
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }

  useEffect(() => {
    void load(1, false);
    // API hook functions are intentionally
    // not dependencies here.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = useMemo(() => {
    const value =
      query.trim().toLowerCase();

    return items.filter(
      (item) => {
        const matchesSearch =
          !value ||
          item.originalName
            .toLowerCase()
            .includes(value) ||
          item.caption
            ?.toLowerCase()
            .includes(value) ||
          item.tags?.some(
            (tag) =>
              tag
                .toLowerCase()
                .includes(value)
          );

        if (!matchesSearch) {
          return false;
        }

        if (
          filter === "analyzed"
        ) {
          return (
            item.analysis
              ?.status ===
            "completed"
          );
        }

        if (
          filter === "optimized"
        ) {
          return Boolean(
            item.optimizedUrl
          );
        }

        if (
          filter === "pending"
        ) {
          return (
            item.analysis
              ?.status ===
              "pending" ||
            !item.analysis
          );
        }

        return true;
      }
    );
  }, [
    items,
    query,
    filter,
  ]);

  async function remove(
    id: string
  ) {
    if (
      !window.confirm(
        "Delete this media asset? This also removes it from Cloudinary."
      )
    ) {
      return;
    }

    setBusyId(id);
    setError("");

    try {
      await deleteMedia(id);

      setItems(
        (current) =>
          current.filter(
            (item) =>
              item._id !== id
          )
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Delete failed."
      );
    } finally {
      setBusyId("");
    }
  }

  async function analyze(
    id: string
  ) {
    setBusyId(id);
    setError("");

    setItems(
      (current) =>
        current.map((item) =>
          item._id === id
            ? {
                ...item,

                analysis: {
                  ...(item.analysis ||
                    {}),

                  status:
                    "pending",
                },
              }
            : item
        )
    );

    try {
      const result =
        await analyzeMedia(id);

      setItems(
        (current) =>
          current.map((item) =>
            item._id === id
              ? {
                  ...item,

                  caption:
                    result.data
                      ?.caption,

                  analysis:
                    result.data
                      ?.analysis,
                }
              : item
          )
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "AI analysis failed."
      );

      setItems(
        (current) =>
          current.map((item) =>
            item._id === id
              ? {
                  ...item,

                  analysis: {
                    ...(item.analysis ||
                      {}),

                    status:
                      "failed",
                  },
                }
              : item
          )
      );
    } finally {
      setBusyId("");
    }
  }

  return (
    <div className="mg-page">
      <section className="mg-page-head">
        <div>
          <span className="mg-eyebrow">
            Workspace
          </span>

          <h1>
            Media library
          </h1>

          <p>
            Manage optimized assets
            and AI intelligence from
            one workspace.
          </p>
        </div>

        <Link
          href="/dashboard/upload"
          className="mg-primary-button"
        >
          Upload media
        </Link>
      </section>

      <section className="mg-library-toolbar">
        <div className="mg-search">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <circle
              cx="11"
              cy="11"
              r="6.5"
              stroke="currentColor"
              strokeWidth="1.6"
            />

            <path
              d="m16 16 4 4"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          </svg>

          <input
            value={query}
            onChange={(event) =>
              setQuery(
                event.target.value
              )
            }
            placeholder="Search filename, caption or tags…"
            aria-label="Search media"
          />
        </div>

        <select
          className="mg-filter-select"
          value={filter}
          onChange={(event) =>
            setFilter(
              event.target.value as
                | "all"
                | "analyzed"
                | "optimized"
                | "pending"
            )
          }
          aria-label="Filter media"
        >
          <option value="all">
            All assets
          </option>

          <option value="optimized">
            Optimized
          </option>

          <option value="analyzed">
            AI analyzed
          </option>

          <option value="pending">
            Pending
          </option>
        </select>

        <span className="mg-count">
          {loading
            ? "Loading…"
            : `${filtered.length} assets`}
        </span>
      </section>

      {error && (
        <div
          className="mg-error"
          role="alert"
        >
          {error}
        </div>
      )}

      {loading ? (
        <div className="mg-grid">
          {Array.from({
            length: 6,
          }).map((_, index) => (
            <div
              className="mg-media-card mg-skeleton-card"
              key={index}
            >
              <div />
              <span />
              <span />
            </div>
          ))}
        </div>
      ) : filtered.length ===
        0 ? (
        <div className="mg-empty">
          <div className="mg-drop-icon">
            +
          </div>

          <h2>
            {items.length
              ? "No matching assets"
              : "Your library is empty"}
          </h2>

          <p>
            {items.length
              ? "Try another search or filter."
              : "Upload your first product image to populate the workspace."}
          </p>

          {!items.length && (
            <Link
              href="/dashboard/upload"
              className="mg-primary-button"
            >
              Upload image
            </Link>
          )}
        </div>
      ) : (
        <>
          <div className="mg-grid">
            {filtered.map(
              (item) => {
                const savings =
                  getSavings(
                    item
                  );

                return (
                  <article
                    className="mg-media-card"
                    key={item._id}
                  >
                    <Link
                      href={`/dashboard/media/${item._id}`}
                      className="mg-media-image"
                    >
                      <img
                        src={
                          item.optimizedUrl ||
                          item.secureUrl
                        }
                        alt={
                          item.originalName
                        }
                        loading="lazy"
                      />

                      <span className="mg-format">
                        {item.format.toUpperCase()}
                      </span>

                      {savings !==
                        null && (
                        <span className="mg-optimization-badge">
                          −
                          {savings.toFixed(
                            0
                          )}
                          %
                        </span>
                      )}
                    </Link>

                    <div className="mg-media-body">
                      <div className="mg-media-name">
                        <strong
                          title={
                            item.originalName
                          }
                        >
                          {
                            item.originalName
                          }
                        </strong>

                        <span>
                          {formatBytes(
                            item.bytes
                          )}

                          {item.width &&
                          item.height
                            ? ` · ${item.width}×${item.height}`
                            : ""}
                        </span>
                      </div>

                      <div className="mg-media-status">
                        <span className="status-pill">
                          <i />

                          {getStatus(
                            item
                          )}
                        </span>

                        {item.optimizedBytes && (
                          <span className="mg-optimized-size">
                            {formatBytes(
                              item.optimizedBytes
                            )}
                          </span>
                        )}
                      </div>

                      {item.caption && (
                        <p className="mg-caption">
                          {item.caption}
                        </p>
                      )}

                      <div className="mg-card-actions">
                        <Link
                          href={`/dashboard/media/${item._id}`}
                        >
                          Details
                        </Link>

                        {item.analysis
                          ?.status !==
                          "completed" && (
                          <button
                            type="button"
                            onClick={() =>
                              analyze(
                                item._id
                              )
                            }
                            disabled={
                              busyId ===
                              item._id
                            }
                          >
                            {busyId ===
                            item._id
                              ? "Analyzing…"
                              : "AI analyze"}
                          </button>
                        )}

                        <button
                          type="button"
                          className="danger"
                          onClick={() =>
                            remove(
                              item._id
                            )
                          }
                          disabled={
                            busyId ===
                            item._id
                          }
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </article>
                );
              }
            )}
          </div>

          {hasMore && (
            <div className="mg-load-more">
              <button
                type="button"
                className="mg-secondary-button"
                onClick={() =>
                  void load(
                    page + 1,
                    true
                  )
                }
                disabled={
                  loadingMore
                }
              >
                {loadingMore
                  ? "Loading…"
                  : "Load more assets"}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}