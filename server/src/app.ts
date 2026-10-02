import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import { clerkMiddleware } from "@clerk/express";

import mediaRoutes from "./routes/media.routes.js";
import { errorHandler } from "./middleware/error.middleware.js";

const app = express();

/* ============================================================
   TRUST PROXY
   ============================================================ */

app.set("trust proxy", 1);

/* ============================================================
   CORS
   ============================================================ */

const configuredOrigins = [
  process.env.FRONTEND_URL,

  ...(process.env.FRONTEND_URLS
    ? process.env.FRONTEND_URLS.split(",")
    : []),
]
  .filter(Boolean)
  .map((origin) => origin!.trim())
  .filter(Boolean);

const allowedOrigins = [...new Set(configuredOrigins)];

console.log("Allowed CORS origins:", allowedOrigins);

app.use(
  cors({
    origin(origin, callback) {
      // Allow server-to-server / health checks with no Origin header
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.warn("Blocked CORS origin:", origin);

      return callback(new Error("Not allowed by CORS"));
    },

    credentials: true,

    methods: [
      "GET",
      "HEAD",
      "POST",
      "PUT",
      "PATCH",
      "DELETE",
      "OPTIONS",
    ],

    allowedHeaders: [
      "Content-Type",
      "Authorization",
    ],
  })
);

/* ============================================================
   SECURITY
   ============================================================ */

app.use(
  helmet({
    crossOriginResourcePolicy: {
      policy: "cross-origin",
    },
  })
);

/* ============================================================
   BODY PARSERS
   ============================================================ */

app.use(
  express.json({
    limit: "2mb",
  })
);

app.use(
  express.urlencoded({
    extended: true,
    limit: "2mb",
  })
);

/* ============================================================
   LOGGING
   ============================================================ */

app.use(
  morgan(
    process.env.NODE_ENV === "production"
      ? "combined"
      : "dev"
  )
);

/* ============================================================
   CLERK
   ============================================================ */

app.use(clerkMiddleware());

/* ============================================================
   RATE LIMITING
   ============================================================ */

const publicReadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,

  limit:
    process.env.NODE_ENV === "production"
      ? 1000
      : 10000,

  standardHeaders: "draft-7",

  legacyHeaders: false,

  skip: (req) =>
    !["GET", "HEAD"].includes(req.method),

  message: {
    success: false,
    message:
      "Too many requests. Please wait a moment and try again.",
  },
});

const writeLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,

  limit:
    process.env.NODE_ENV === "production"
      ? 200
      : 2000,

  standardHeaders: "draft-7",

  legacyHeaders: false,

  skip: (req) =>
    ["GET", "HEAD", "OPTIONS"].includes(req.method),

  message: {
    success: false,
    message:
      "Too many update requests. Please wait and try again.",
  },
});

app.use("/api", publicReadLimiter);
app.use("/api", writeLimiter);

/* ============================================================
   HEALTH CHECK
   ============================================================ */

app.get("/health", (_req, res) => {
  return res.status(200).json({
    success: true,
    service: "MediaGuard AI API",
    status: "healthy",
    timestamp: new Date().toISOString(),
    environment:
      process.env.NODE_ENV || "development",
  });
});

/*
 * Keep this route too because your frontend / deployment
 * testing may already use /api/health.
 */
app.get("/api/health", (_req, res) => {
  return res.status(200).json({
    success: true,
    service: "MediaGuard AI API",
    status: "healthy",
    timestamp: new Date().toISOString(),
  });
});

/* ============================================================
   ROOT STATUS
   ============================================================ */

app.get("/", (_req, res) => {
  return res.status(200).json({
    success: true,
    message: "MediaGuard AI API is running 🚀",
    environment:
      process.env.NODE_ENV || "production",
  });
});

/* ============================================================
   API ROUTES
   ============================================================ */

app.use("/api/media", mediaRoutes);

/* ============================================================
   API 404
   ============================================================ */

app.use((_req, res) => {
  return res.status(404).json({
    success: false,
    message: "API Route Not Found",
  });
});

/* ============================================================
   GLOBAL ERROR HANDLER
   ============================================================ */

app.use(errorHandler);

export default app;