# 🛡️ MediaGuard AI

### AI-Powered Media Intelligence, Optimization & Delivery Platform

<p align="center">
  <strong>Upload once. Understand instantly. Optimize automatically. Deliver intelligently.</strong>
</p>

<p align="center">
  <a href="https://mediaguardai.vercel.app/">
    <img src="https://img.shields.io/badge/🚀_Live_Demo-MediaGuard_AI-111827?style=for-the-badge" alt="Live Demo">
  </a>
  <a href="https://github.com/HackIndiaXYZ/pixels-to-products-cloudinary-ai-hackathon-2026-solostack-ai">
    <img src="https://img.shields.io/badge/GitHub-Source_Code-181717?style=for-the-badge&logo=github" alt="GitHub">
  </a>
  <img src="https://img.shields.io/badge/Cloudinary-AI%20Media%20Pipeline-3448C5?style=for-the-badge" alt="Cloudinary">
  <img src="https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js" alt="Next.js">
  <img src="https://img.shields.io/badge/Node.js-24-339933?style=for-the-badge&logo=node.js" alt="Node.js">
  <img src="https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb" alt="MongoDB">
</p>

---

## 🚀 Live Demo

### **[Open MediaGuard AI →](https://mediaguardai.vercel.app/)**

> **Live production application:**  
> https://mediaguardai.vercel.app/

MediaGuard AI is an intelligent media management platform built around a Cloudinary-powered AI media pipeline.

Instead of treating uploaded media as simple files, MediaGuard turns every asset into an **understood, organized, optimized and delivery-ready media object**.

---

# 🎯 The Problem

Modern applications generate enormous amounts of images and other media.

But uploading a file is only the beginning.

Developers and teams still need to:

- Store media reliably
- Organize thousands of assets
- Understand what an image contains
- Generate useful descriptions
- Optimize images for delivery
- Reduce unnecessary payload size
- Maintain media metadata
- Serve responsive, optimized assets
- Build moderation and media intelligence workflows
- Keep the entire process scalable

Traditional media dashboards often separate these tasks across multiple tools.

### MediaGuard AI brings the pipeline together.

```text
                 ┌──────────────────┐
                 │   User Upload    │
                 └────────┬─────────┘
                          │
                          ▼
                ┌────────────────────┐
                │ Cloudinary Upload  │
                └─────────┬──────────┘
                          │
                          ▼
                ┌────────────────────┐
                │ Media Metadata     │
                │ MongoDB            │
                └─────────┬──────────┘
                          │
                          ▼
                ┌────────────────────┐
                │ Cloudinary AI      │
                │ Content Analysis   │
                └─────────┬──────────┘
                          │
                          ▼
                ┌────────────────────┐
                │ AI Caption /       │
                │ Media Intelligence │
                └─────────┬──────────┘
                          │
                          ▼
                ┌────────────────────┐
                │ Optimized Delivery │
                │ q_auto + f_auto    │
                └─────────┬──────────┘
                          │
                          ▼
                ┌────────────────────┐
                │ MediaGuard Library │
                └────────────────────┘
💡 What is MediaGuard AI?

MediaGuard AI is an AI-powered media management platform that automatically processes uploaded media through a Cloudinary-centered pipeline.

The platform combines:

☁️ Cloudinary media infrastructure
🤖 Cloudinary AI content analysis
🧠 AI-generated media understanding
🗂️ MongoDB metadata management
⚡ Automatic media optimization
🔐 Clerk authentication
🚀 Next.js production frontend
🔌 Node.js / Express API

The goal is simple:

Turn raw media into intelligent, optimized digital assets with minimal manual work.

✨ Core Features
📤 Smart Media Upload

Users can upload media directly through the MediaGuard workspace.

The upload pipeline:

User
 ↓
Next.js Upload Workspace
 ↓
Express API
 ↓
Cloudinary Upload API
 ↓
MongoDB Metadata
 ↓
AI Analysis
 ↓
Optimized Media

Media is not stored on the application server.

Cloudinary handles the actual media asset infrastructure.

🤖 AI-Powered Media Analysis

MediaGuard uses Cloudinary AI Content Analysis to analyze uploaded images.

The system sends the Cloudinary asset to the Cloudinary Analyze API and retrieves AI-generated content understanding.

For example:

Uploaded Image
       ↓
Cloudinary AI Analysis
       ↓
Generated Caption
       ↓
Stored with Media Metadata

This allows MediaGuard to transform an anonymous uploaded image into a media asset with meaningful AI-generated information.

☁️ Cloudinary-Centered Media Pipeline

Cloudinary is not being used merely as file storage.

It is a core part of the application's workflow:

Upload

Media is uploaded through the Cloudinary Upload API.

AI Analysis

Cloudinary AI Content Analysis processes the media.

Transformation

Cloudinary transformation URLs provide optimized versions.

Delivery

MediaGuard uses automatic delivery optimization such as:

q_auto
f_auto

This allows the platform to deliver media efficiently based on the requesting environment.

⚡ Intelligent Media Delivery

MediaGuard generates optimized Cloudinary delivery URLs.

Instead of serving the original asset blindly:

Original Asset
      ↓
Cloudinary Transformation
      ↓
Quality Optimization
      ↓
Automatic Format Selection
      ↓
Optimized Delivery

This enables modern web delivery without requiring every optimized version to be manually generated and stored.

🗂️ Intelligent Media Library

The dashboard provides a centralized view of uploaded media.

Users can:

View uploaded assets
Inspect media details
Review AI-generated information
Access Cloudinary assets
Manage their media collection
View recent uploads
Navigate individual media assets
🔐 Authentication & User Isolation

MediaGuard uses Clerk for authentication.

The application separates authenticated users from public application content and protects media operations through authenticated API requests.

Authentication flow:

User
 ↓
Clerk
 ↓
Next.js
 ↓
Authenticated API Request
 ↓
Express + Clerk Middleware
 ↓
Media Operations
🧱 Technology Stack
Frontend
Technology	Purpose
Next.js 16	Production web application
React 19	UI architecture
TypeScript	Type safety
Tailwind CSS 4	UI styling
Clerk	Authentication
Backend
Technology	Purpose
Node.js 24	Runtime
Express	REST API
TypeScript	Backend development
Mongoose	MongoDB integration
Multer	In-memory upload handling
Helmet	Security headers
Morgan	HTTP logging
Express Rate Limit	API protection
Clerk Express	Authentication middleware
Media Infrastructure
Technology	Purpose
Cloudinary	Media storage & delivery
Cloudinary Upload API	Media ingestion
Cloudinary AI Analysis	AI media understanding
Cloudinary Transformations	Optimization
q_auto	Automatic quality optimization
f_auto	Automatic format optimization
Database
Technology	Purpose
MongoDB Atlas	Persistent media metadata
Deployment
Platform	Purpose
Vercel	Production deployment
GitHub	Source control
🏗️ Architecture
                           ┌──────────────────────┐
                           │       User           │
                           └──────────┬───────────┘
                                      │
                                      ▼
                         ┌────────────────────────┐
                         │   Next.js Frontend     │
                         │                        │
                         │ Dashboard              │
                         │ Upload Workspace       │
                         │ Media Library          │
                         │ Asset Details           │
                         └───────────┬────────────┘
                                     │
                              HTTPS / API
                                     │
                                     ▼
                         ┌────────────────────────┐
                         │   Express API          │
                         │                        │
                         │ Clerk Middleware       │
                         │ Media Routes            │
                         │ Upload Controller       │
                         │ Analysis Service        │
                         │ Cloudinary Service      │
                         └──────┬─────────┬───────┘
                                │         │
                     ┌──────────┘         └──────────────┐
                     ▼                                   ▼
            ┌─────────────────┐                 ┌─────────────────┐
            │  MongoDB Atlas  │                 │   Cloudinary    │
            │                 │                 │                 │
            │ Media Metadata  │                 │ Media Assets    │
            │ AI Results      │                 │ Transformations │
            │ User References │                 │ AI Analysis     │
            └─────────────────┘                 │ Delivery        │
                                                └─────────────────┘
🔄 End-to-End Media Pipeline

MediaGuard's main workflow can be summarized as:

                    UPLOAD
                       │
                       ▼
              ┌─────────────────┐
              │    Cloudinary   │
              │     Upload      │
              └────────┬────────┘
                       │
                       ▼
              ┌─────────────────┐
              │ MongoDB Metadata│
              └────────┬────────┘
                       │
                       ▼
              ┌─────────────────┐
              │ Cloudinary AI   │
              │    Analysis     │
              └────────┬────────┘
                       │
                       ▼
              ┌─────────────────┐
              │ AI Generated    │
              │ Media Context   │
              └────────┬────────┘
                       │
                       ▼
              ┌─────────────────┐
              │ Optimized URL   │
              │ q_auto + f_auto │
              └────────┬────────┘
                       │
                       ▼
                    DELIVERY

This is the heart of MediaGuard AI.

🎬 Example User Journey
1. Sign in

The user authenticates through Clerk.

2. Upload

The user selects an image from the MediaGuard dashboard.

3. Cloudinary ingestion

The backend uploads the asset directly to Cloudinary.

4. Metadata persistence

Media metadata is stored in MongoDB.

5. AI processing

Cloudinary AI analyzes the uploaded image.

6. AI result

The generated caption/content information is associated with the media record.

7. Optimization

MediaGuard generates an optimized Cloudinary delivery URL.

8. Library

The user can view the asset and its AI-generated information from the MediaGuard dashboard.

🛡️ Security Considerations

MediaGuard follows several security practices:

🔐 Clerk-based authentication
🛡️ Helmet security middleware
🚦 API rate limiting
🌐 Controlled CORS origins
🔑 Environment-based secrets
☁️ Cloudinary credentials kept server-side
🚫 No API secrets committed to Git
📦 In-memory upload handling instead of persistent server uploads
🔒 Protected backend media operations

Environment variables are intentionally excluded from version control.

📁 Project Structure
MediaGuardAI/
│
├── frontend/
│   ├── app/
│   │   ├── dashboard/
│   │   ├── sign-in/
│   │   ├── sign-up/
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   │
│   ├── components/
│   │   ├── dashboard/
│   │   └── landing/
│   │
│   ├── lib/
│   │   └── api.ts
│   │
│   ├── public/
│   ├── next.config.ts
│   ├── package.json
│   └── tsconfig.json
│
├── server/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── app.ts
│   │   └── server.ts
│   │
│   ├── package.json
│   └── tsconfig.json
│
├── .gitignore
└── README.md
⚙️ Local Development
Prerequisites

Make sure you have:

Node.js 24+
npm
MongoDB Atlas account
Cloudinary account
Clerk account
1. Clone the repository
git clone https://github.com/HackIndiaXYZ/pixels-to-products-cloudinary-ai-hackathon-2026-solostack-ai.git

cd pixels-to-products-cloudinary-ai-hackathon-2026-solostack-ai
Frontend Setup
cd frontend
npm install
npm run dev

Frontend:

http://localhost:3000
Backend Setup

Open another terminal:

cd server
npm install
npm run dev

Backend:

http://localhost:5000

Health check:

http://localhost:5000/api/health
🔐 Environment Variables
Frontend

Create:

frontend/.env.local
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

NEXT_PUBLIC_CLERK_SIGN_IN_FORCE_REDIRECT_URL=/dashboard
NEXT_PUBLIC_CLERK_SIGN_UP_FORCE_REDIRECT_URL=/dashboard

NEXT_PUBLIC_API_URL=http://localhost:5000
Backend

Create:

server/.env
NODE_ENV=development
PORT=5000

FRONTEND_URL=http://localhost:3000
FRONTEND_URLS=

MONGODB_URI=

CLERK_SECRET_KEY=

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

Never commit real credentials or secret environment variables to GitHub.

🧪 API Health Check

After starting the backend:

GET /api/health

Example response:

{
  "success": true,
  "service": "MediaGuard AI API",
  "status": "healthy"
}
📡 Main API Flow
POST /api/media
       │
       ▼
Authenticate user
       │
       ▼
Validate upload
       │
       ▼
Upload to Cloudinary
       │
       ▼
Save metadata to MongoDB
       │
       ▼
Analyze with Cloudinary AI
       │
       ▼
Persist analysis result
       │
       ▼
Return media information
☁️ Why Cloudinary is Core to MediaGuard

Cloudinary is not an external add-on or a simple image bucket in this project.

It is the media intelligence and delivery layer of MediaGuard.

Cloudinary is responsible for:

1. Media ingestion

Uploaded media enters the system through Cloudinary.

2. Media storage

Original media assets are managed by Cloudinary.

3. AI analysis

Cloudinary AI Content Analysis generates meaningful information about uploaded media.

4. Transformation

Cloudinary dynamically transforms assets.

5. Optimization

Automatic quality and format optimization are used through:

q_auto
f_auto
6. Delivery

Optimized media is delivered through Cloudinary's media delivery infrastructure.

Therefore:

Removing Cloudinary would remove a fundamental part of MediaGuard's architecture, not just its storage layer.

🧠 What Makes MediaGuard Different?

Many media applications stop at:

Upload → Store → Display

MediaGuard is designed around:

Upload
  ↓
Understand
  ↓
Organize
  ↓
Optimize
  ↓
Deliver

The platform treats media as intelligent digital assets, rather than passive files.

🎯 Hackathon Track
Pixels to Products — Cloudinary AI Hackathon 2026
Track: AI Media Pipelines

MediaGuard AI is designed around the track's core idea:

Automatically ingest, organize, analyze, optimize and deliver media using Cloudinary's AI capabilities.

Cloudinary is integrated directly into the application's primary workflow:

Ingest
  ↓
Analyze
  ↓
Store Metadata
  ↓
Optimize
  ↓
Deliver

This makes the project a complete AI-powered media pipeline rather than a basic CRUD application with Cloudinary attached.

🏆 Product Vision

MediaGuard AI is designed to evolve beyond an image uploader.

Future versions can extend the same pipeline toward:

🔎 Semantic media search
🏷️ Automatic tagging
🧹 Background removal
✂️ Content-aware cropping
🛡️ Automated moderation
🎥 Video intelligence
🧠 Advanced media classification
📊 Media analytics
⚡ Adaptive media delivery
🔄 Automated media workflows

The architecture is intentionally designed so additional Cloudinary AI capabilities can be added without rebuilding the entire platform.

🚀 Roadmap
Phase 1 — Core Pipeline
 Authentication
 Media upload
 Cloudinary integration
 MongoDB metadata
 AI analysis
 Optimized delivery
 Media library
 Asset details
 Production deployment
Phase 2 — Intelligence
 Automatic tagging
 Semantic search
 Smart filtering
 Advanced media classification
Phase 3 — Advanced Media AI
 Background removal
 Content-aware cropping
 Automated moderation
 Video analysis
 Intelligent transformations
🌐 Deployment

MediaGuard AI is deployed using Vercel.

Production

Frontend:

https://mediaguardai.vercel.app/

Infrastructure
GitHub
   │
   ▼
Vercel
   │
   ├── Next.js Frontend
   │
   └── Node.js / Express API
          │
          ├── MongoDB Atlas
          ├── Cloudinary
          └── Clerk
📸 Product Demo

The live application demonstrates:

Modern landing page
Authentication
Dashboard
Media upload
Cloudinary-backed media processing
AI media analysis
Media library
Asset details
Optimized media delivery

👉 Try it live:
https://mediaguardai.vercel.app/

🧑‍💻 Team
SoloStack AI

HackIndia — Pixels to Products

Built as a solo full-stack AI media product for the Cloudinary AI Hackathon 2026.

📜 License

This project is provided for hackathon and demonstration purposes.

See the repository license for details.

⭐ Support the Project

If you find MediaGuard AI interesting:

⭐ Star the repository
🍴 Explore the code
🚀 Try the live application
💡 Share feedback

<p align="center">
🛡️ MediaGuard AI

Make every media asset intelligent.

<br>

Built with ❤️ using
Cloudinary + AI + Next.js + Node.js + MongoDB + Clerk

<br> <a href="https://mediaguardai.vercel.app/"> 🚀 Live Demo </a> </p> ```
