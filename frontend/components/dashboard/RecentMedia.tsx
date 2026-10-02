/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";

import {
  apiFetch,
  type MediaItem,
  type MediaResponse,
} from "@/lib/api";

function formatBytes(bytes: number) {
  if (!bytes) return "0 B";

  const units = ["B", "KB", "MB", "GB"];

  const index = Math.min(
    Math.floor(Math.log(bytes) / Math.log(1024)),
    units.length - 1
  );

  return `${(bytes / Math.pow(1024, index)).toFixed(
    index ? 1 : 0
  )} ${units[index]}`;
}

function timeAgo(date: string) {
  const seconds = Math.max(
    0,
    Math.floor(
      (Date.now() - new Date(date).getTime()) / 1000
    )
  );

  if (seconds < 60) return "Just now";

  const minutes = Math.floor(seconds / 60);

  if (minutes < 60) {
    return `${minutes}m ago`;
  }

  const hours = Math.floor(minutes / 60);

  if (hours < 24) {
    return `${hours}h ago`;
  }

  const days = Math.floor(hours / 24);

  return `${days}d ago`;
}

function getStatus(item: MediaItem) {
  if (item.analysis?.status === "completed") {
    return "Analyzed";
  }

  if (item.optimizedUrl) {
    return "Optimized";
  }

  return "Uploaded";
}

export default function RecentMedia() {
  const { getToken } = useAuth();

  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        const result = await apiFetch<MediaResponse>(
          "/api/media?page=1&limit=5",
          getToken
        );

        if (mounted) {
          setMedia(result.data || []);
        }
      } catch {
        if (mounted) {
          setMedia([]);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    void load();

    return () => {
      mounted = false;
    };
  }, [getToken]);

  return (
    <section className="recent-section">
      <div className="section-heading-row">
        <div>
          <span className="dashboard-eyebrow">
            Workspace
          </span>

          <h2>Recent media</h2>

          <p>
            Your latest assets from the MediaGuard
            workspace.
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
        <div className="recent-loading">
          <div />
          <div />
          <div />
        </div>
      ) : media.length === 0 ? (
        <div className="recent-empty">
          <div className="recent-empty-icon">
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M12 5v14M5 12h14"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
              />
            </svg>
          </div>

          <div>
            <strong>No media uploaded yet</strong>

            <p>
              Upload your first product image to see
              it here.
            </p>
          </div>

          <Link
            href="/dashboard/upload"
            className="mg-primary-button"
          >
            Upload image
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

          {media.map((item) => {
            const status = getStatus(item);

            return (
              <Link
                href="/dashboard/media"
                className="recent-row"
                key={item._id}
              >
                <div className="recent-asset">
                  <div className="recent-image">
                    <img
                      src={
                        item.optimizedUrl ||
                        item.secureUrl
                      }
                      alt={item.originalName}
                      loading="lazy"
                    />
                  </div>

                  <div className="recent-asset-copy">
                    <strong title={item.originalName}>
                      {item.originalName}
                    </strong>

                    <span>
                      {item.width && item.height
                        ? `${item.width} × ${item.height}`
                        : item.format.toUpperCase()}
                    </span>
                  </div>
                </div>

                <span className="status-pill">
                  <i />
                  {status}
                </span>

                <span className="recent-size">
                  {formatBytes(item.bytes)}
                </span>

                <span className="recent-saving">
                  {timeAgo(item.createdAt)}
                </span>
              </Link>
            );
          })}
        </div>
      )}
    </section>
  );
}