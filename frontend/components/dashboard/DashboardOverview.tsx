/* eslint-disable @next/next/no-img-element */
"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import Link from "next/link";

import {
  useAuth,
  useUser,
} from "@clerk/nextjs";

import StatCard from "./StatCard";

import {
  apiFetch,
  type MediaItem,
  type MediaResponse,
  type MediaStats,
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

function timeAgo(
  date: string
) {
  const seconds = Math.max(
    0,
    Math.floor(
      (Date.now() -
        new Date(date).getTime()) /
        1000
    )
  );

  if (seconds < 60) {
    return "just now";
  }

  const minutes = Math.floor(
    seconds / 60
  );

  if (minutes < 60) {
    return `${minutes}m ago`;
  }

  const hours = Math.floor(
    minutes / 60
  );

  if (hours < 24) {
    return `${hours}h ago`;
  }

  return `${Math.floor(
    hours / 24
  )}d ago`;
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

export default function DashboardOverview() {
  const { getToken } =
    useAuth();

  const { user } =
    useUser();

  const [media, setMedia] =
    useState<MediaItem[]>([]);

  const [stats, setStats] =
    useState<MediaStats | null>(
      null
    );

  const [loading, setLoading] =
    useState(true);

  const firstName =
    user?.firstName ||
    user?.username ||
    "there";

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const [
          mediaResult,
          statsResult,
        ] = await Promise.all([
          apiFetch<MediaResponse>(
            "/api/media?page=1&limit=5",
            getToken
          ),

          apiFetch<{
            success: boolean;
            data: MediaStats;
          }>(
            "/api/media/stats",
            getToken
          ),
        ]);

        if (!active) return;

        setMedia(
          mediaResult.data || []
        );

        setStats(
          statsResult.data || null
        );
      } catch (error) {
        console.error(
          "Dashboard load failed:",
          error
        );

        if (active) {
          setMedia([]);
          setStats(null);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    if (user) {
      void load();
    }

    return () => {
      active = false;
    };
  }, [getToken, user]);

  const averageReduction =
    useMemo(() => {
      if (!stats) return "—";

      if (
        stats.averageReduction <=
        0
      ) {
        return "—";
      }

      return `${stats.averageReduction.toFixed(
        1
      )}%`;
    }, [stats]);

  return (
    <div className="dashboard-page">
      <section className="dashboard-welcome">
        <div>
          <span className="dashboard-eyebrow">
            Media workspace
          </span>

          <h1>
            Welcome back,{" "}
            {firstName}.
          </h1>

          <p>
            Monitor your media pipeline
            and keep your product assets
            web-ready.
          </p>
        </div>

        <Link
          href="/dashboard/upload"
          className="btn btn-primary"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M12 16V4M7 9l5-5 5 5"
              stroke="currentColor"
              strokeWidth="1.8"
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

          Upload media
        </Link>
      </section>

      <section className="stats-grid">
        <StatCard
          label="Total media"
          value={
            loading
              ? "…"
              : String(
                  stats?.total || 0
                )
          }
          detail="Assets in your workspace"
        />

        <StatCard
          label="AI analyzed"
          value={
            loading
              ? "…"
              : String(
                  stats?.analyzed || 0
                )
          }
          detail="Assets with AI intelligence"
          type="success"
        />

        <StatCard
          label="Bandwidth saved"
          value={
            loading
              ? "…"
              : formatBytes(
                  stats?.savedBytes || 0
                )
          }
          detail="Measured optimized delivery"
          type="primary"
        />

        <StatCard
          label="Average reduction"
          value={
            loading
              ? "…"
              : averageReduction
          }
          detail="Across measured optimized assets"
        />
      </section>

      <section className="dashboard-empty">
        <div className="empty-icon">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M12 4v10M8 10l4 4 4-4"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            <path
              d="M5 19h14"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
            />
          </svg>
        </div>

        <h2>
          {stats?.total
            ? "Your AI media pipeline is active"
            : "Your media workspace is ready"}
        </h2>

        <p>
          {stats?.total
            ? "Upload more assets or open the media library to inspect optimization and AI results."
            : "Upload your first product image to start the AI media pipeline."}
        </p>

        <Link
          href="/dashboard/upload"
          className="btn btn-primary"
        >
          {stats?.total
            ? "Upload more media"
            : "Upload your first image"}
        </Link>
      </section>

      <section className="recent-section">
        <div className="section-heading-row">
          <div>
            <h2>
              Recent media
            </h2>

            <p>
              Your latest assets from the
              MediaGuard workspace.
            </p>
          </div>

          <Link
            href="/dashboard/media"
            className="text-link"
          >
            View all →
          </Link>
        </div>

        {loading ? (
          <div className="media-loading-card">
            <span className="loading-line" />
            <span className="loading-line short" />
            <span className="loading-line" />
          </div>
        ) : media.length === 0 ? (
          <div className="media-empty-small">
            <span>
              No media uploaded yet.
            </span>

            <Link href="/dashboard/upload">
              Upload an image →
            </Link>
          </div>
        ) : (
          <div className="recent-table">
            <div className="recent-table-head">
              <span>Asset</span>
              <span>Status</span>
              <span>Size</span>
              <span>Added</span>
            </div>

            {media.map(
              (item) => (
                <Link
                  href={`/dashboard/media/${item._id}`}
                  className="recent-row"
                  key={item._id}
                >
                  <div className="recent-asset">
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

                    <div>
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
                        {item.width &&
                        item.height
                          ? `${item.width} × ${item.height}`
                          : item.format.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  <span className="status-pill">
                    <i />

                    {getStatus(item)}
                  </span>

                  <span className="recent-size">
                    {item.optimizedBytes
                      ? `${formatBytes(
                          item.optimizedBytes
                        )} optimized`
                      : formatBytes(
                          item.bytes
                        )}
                  </span>

                  <span className="recent-saving">
                    {timeAgo(
                      item.createdAt
                    )}
                  </span>
                </Link>
              )
            )}
          </div>
        )}
      </section>
    </div>
  );
}