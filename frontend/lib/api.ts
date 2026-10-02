"use client";

import { useAuth } from "@clerk/nextjs";

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000";

export type MediaItem = {
  _id: string;

  userId: string;

  originalName: string;

  publicId: string;

  assetId: string;

  secureUrl: string;

  optimizedUrl?: string;

  format: string;

  resourceType: string;

  bytes: number;

  optimizedBytes?: number;

  width?: number;

  height?: number;

  qualityScore?: number;

  qualityLevel?:
    | "low"
    | "medium"
    | "high";

  caption?: string;

  tags: string[];

  analysis?: {
    status:
      | "pending"
      | "completed"
      | "failed";

    provider?: string;

    raw?: unknown;
  };

  createdAt: string;

  updatedAt: string;
};

export type MediaResponse = {
  success: boolean;

  data: MediaItem[];

  pagination: {
    page: number;

    limit: number;

    total: number;

    totalPages: number;
  };
};

export type MediaStats = {
  total: number;

  optimized: number;

  analyzed: number;

  pending: number;

  failed: number;

  originalBytes: number;

  measuredOriginalBytes: number;

  optimizedBytes: number;

  savedBytes: number;

  savingsPercent: number;

  averageReduction: number;
};

export async function getAuthHeaders(
  getToken: () => Promise<string | null>
) {
  const token = await getToken();

  if (!token) {
    throw new Error(
      "Your session has expired. Please sign in again."
    );
  }

  return {
    Authorization: `Bearer ${token}`,
  };
}

export async function apiFetch<T>(
  path: string,
  getToken: () => Promise<string | null>,
  init: RequestInit = {}
): Promise<T> {
  const authHeaders =
    await getAuthHeaders(getToken);

  const response = await fetch(
    `${API_URL}${path}`,
    {
      ...init,

      headers: {
        ...authHeaders,

        ...(init.headers || {}),
      },

      cache: "no-store",
    }
  );

  let body: any = null;

  try {
    body = await response.json();
  } catch {
    // Non JSON response
  }

  if (!response.ok) {
    throw new Error(
      body?.message ||
        body?.error ||
        `Request failed (${response.status})`
    );
  }

  return body as T;
}

export function useMediaApi() {
  const { getToken } = useAuth();

  return {
    getMedia: (
      query = "?page=1&limit=24"
    ) =>
      apiFetch<MediaResponse>(
        `/api/media${query}`,
        getToken
      ),

    getStats: () =>
      apiFetch<{
        success: boolean;
        data: MediaStats;
      }>(
        "/api/media/stats",
        getToken
      ),

    getSingleMedia: (
      id: string
    ) =>
      apiFetch<{
        success: boolean;
        data: MediaItem;
      }>(
        `/api/media/${id}`,
        getToken
      ),

    analyzeMedia: (
      id: string
    ) =>
      apiFetch<{
        success: boolean;

        message: string;

        data?: {
          id: string;

          caption?: string;

          analysis?: MediaItem["analysis"];
        };
      }>(
        `/api/media/${id}/analyze`,
        getToken,
        {
          method: "POST",
        }
      ),

    deleteMedia: (
      id: string
    ) =>
      apiFetch<{
        success: boolean;

        message: string;
      }>(
        `/api/media/${id}`,
        getToken,
        {
          method: "DELETE",
        }
      ),
  };
}