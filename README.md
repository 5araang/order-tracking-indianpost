<div align="center">

# 📦 India Post Enterprise Consignment Tracker & `track-post` NPM CLI

**A blazing-fast, full-stack India Post tracking portal & zero-config NPM CLI built with React + Vite + Express + Node.js.**  
Live REST API · AES-256 Encrypted Payloads · Admin-Authenticated Portal · Rate-Limited Search

[![npm](https://img.shields.io/badge/npm-track--post-red?style=for-the-badge&logo=npm)](https://www.npmjs.com/package/track-post)
[![Open Source](https://img.shields.io/badge/Open%20Source-MIT-green?style=for-the-badge&logo=github)](https://github.com/5araang/indian-post-track-order-)
[![Built with Vite](https://img.shields.io/badge/Built%20with-Vite-646CFF?style=for-the-badge&logo=vite)](https://vitejs.dev)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org)
[![Deploy on Vercel](https://img.shields.io/badge/Deploy-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com)

---

**Made with ❤️ by [Sarang](https://github.com/5araang)**  
[🌐 Portfolio / GitHub](https://github.com/5araang) · [📸 Instagram @5araang](https://instagram.com/5araang) · [📦 NPM Package](https://www.npmjs.com/package/track-post)

</div>

---

## 🧠 What Is This?

This project consists of two core open-source components:

1. **`track-post` NPM Package & CLI**: A zero-config CLI tool and Node.js library (`npx track-post <id>`). Zero API keys required. Auto-token generation & 6-day TTL caching.
2. **Web Portal SPA**: A production-grade India Post tracking web application with live REST API, event timelines, and admin portal.

- 🔐 **Admin authentication** via environment credentials (no database required)
- 🔑 **Developer API key system** with AES-256 encrypted or plain JSON response modes
- 📦 **Live tracking** of any 13-character India Post consignment ID (Speed Post, Parcel, etc.)
- 📊 **Visual event timeline** showing every checkpoint in a parcel's journey
- 📋 **Raw JSON inspector** for developers integrating the API
- 📁 **Persistent search history** stored locally in the browser
- 🚦 **Rate limiting** — configurable, defaults to 5 requests/minute

---

## 📦 `track-post` NPM Package & CLI

You can run tracking directly from your terminal or install it as a library in any Node.js / TypeScript project:

### 1. Instant Terminal Run (Zero Install)

```bash
# Live tracking
npx track-post <tracking-id>

# Demo mode (sample parcel data)
npx track-post EH123456789IN --demo
```

### 2. Install as NPM Package

```bash
npm install track-post
```

#### CommonJS (`src/services/trackingService.js`)

```javascript
const { track, init } = require('track-post');

/**
 * Track an India Post consignment ID
 * @param {string} consignmentId - 13-character ID or raw number
 */
async function getTrackingDetails(consignmentId) {
  try {
    const data = await track(consignmentId);
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

module.exports = { getTrackingDetails, init };
```

#### ES Module / TypeScript (`src/services/trackingService.ts`)

```typescript
import { track, init, TrackResult } from 'track-post';

export interface TrackingResponse {
  success: boolean;
  data?: TrackResult;
  error?: string;
}

export async function getTrackingDetails(consignmentId: string): Promise<TrackingResponse> {
  try {
    const data: TrackResult = await track(consignmentId);
    return { success: true, data };
  } catch (error: any) {
    return { success: false, error: error?.message || 'Tracking failed' };
  }
}
```


## ✨ Features

| Feature | Description |
|--------|-------------|
| 🔴 **Flat 3-Color Design** | Minimalist Black · White · Red (`#dc2626`) theme |
| 🔐 **Env-Based Auth** | Admin portal login via `.env` email/password — no DB needed |
| 🔑 **API Key Management** | AES-256 encrypted payload support or plain JSON mode |
| 📡 **REST API Endpoint** | `GET /v1/api/track/:code` — publicly accessible tracking endpoint |
| 📜 **Event Timeline** | Visual checkpoint timeline with timestamps and locations |
| 💾 **Search History** | Browser-local history with quick re-track support |
| 🚦 **Rate Limiter** | 5 req/min limit with live badge indicator in the navbar |
| 📄 **API Docs Page** | Built-in developer API documentation page at `/docs` |
| 🗂️ **Sidebar Drawer** | Slide-out control panel for session info, API keys, and history |
| ⚡ **Vite + React 18** | Ultra-fast HMR dev server with an optimized production build |

---

## 🏗️ How It Works

```
User enters 13-character Consignment ID
         │
         ▼
  React Frontend (Vite + TypeScript)
         │
         ▼
  Express API Server  (api/ folder)
         │
         ├── 1. Fetches action token from India Post Next.js Server Action
         │
         ├── 2. Calls the India Post tracking endpoint with token + consignment ID
         │
         ├── 3. Parses and normalizes event data into a clean structure
         │
         └── 4. Returns JSON response (plain or AES-256 encrypted)
                      │
                      ▼
         Frontend renders results:
           ├── Summary Cards  (status, weight, origin, destination)
           ├── Visual Activity Timeline  (checkpoint-by-checkpoint)
           └── Raw JSON Inspector  (for developers)
```

### 🔐 Authentication Flow

```
Browser visits any protected route
    │
    ▼  Not authenticated?
    └──► Redirect to /login
             │
             ▼  Enter email + password (from .env)
         AuthService.login()
             │
             ▼  Session saved in localStorage
         Routes unlocked:
           ├── /       → Consignment Tracker
           └── /docs   → API Documentation
```

### 🔑 API Key & Encryption

Developer API keys are generated client-side using `crypto-js`.

| Request Header | Response Format |
|----------------|----------------|
| No API key | AES-256 encrypted ciphertext payload |
| Valid `X-API-Key` header | Structured plain JSON response |

---

## 📁 Project Structure

```
indiapost-tracker-master/
├── npm/                       # Standalone track-post NPM Package & CLI
│   ├── bin/
│   │   └── cli.js             # npx track-post CLI binary
│   ├── src/
│   │   ├── index.js           # Public track() & init() exports
│   │   ├── extractor.js       # Auto Next.js action hash scraper
│   │   ├── config.js          # ~/.track-post/config.json 6-day TTL cache
│   │   └── tracker.js         # Core RSC requester & normalizer
│   ├── types/
│   │   └── index.d.ts         # TypeScript definitions
│   ├── package.json           # "name": "track-post"
│   └── README.md
├── indiapost-vite/            # Full-stack React + Vite Web Portal
│   ├── api/                   # Express API server handlers
│   ├── src/
│   │   ├── components/        # React UI components
│   │   ├── services/          # API & Auth services
│   │   └── types/             # TypeScript types
│   ├── .env.example           # Environment template
│   ├── vercel.json            # Vercel deployment routes
│   └── extract-hashes.js      # Next.js hash extractor
├── README.md                  # Master GitHub documentation
└── package.json               # Root workspace manifest
```

---

## ⚙️ Setup Guide (Web Portal)

### Step 1 — Clone the Repository

```bash
git clone https://github.com/5araang/indian-post-track-order-.git
cd indian-post-track-order-/indiapost-vite
```

### Step 2 — Install Dependencies

```bash
npm install
```

### Step 3 — Configure Environment Variables

Copy the example file:

```bash
cp .env.example .env
```

Then open `.env` and fill in your values:

```env
# ── India Post Developer API Credentials ──────────────────────────
VITE_INDIAPOST_API_KEY=your_api_key_here
VITE_INDIAPOST_API_SECRET=your_api_secret_here

# ── Next.js Server Action Hashes (auto-extracted — see Step 4) ────
VITE_NEXTJS_TOKEN_ACTION=
VITE_NEXTJS_TRACK_ACTION=

# ── Rate Limiting (default: 5 searches per 60 seconds) ────────────
VITE_RATE_LIMIT_MAX_SEARCHES=5
VITE_RATE_LIMIT_WINDOW_MS=60000

# ── Admin Portal Login Credentials ────────────────────────────────
VITE_ADMIN_EMAIL=admin@yourdomain.com
VITE_ADMIN_PASSWORD=your_secure_password
```

### Step 4 — Extract Next.js Server Action Hashes

> ⚠️ **Required!** This populates `VITE_NEXTJS_TOKEN_ACTION` and `VITE_NEXTJS_TRACK_ACTION` automatically.

```bash
npm run extract-hashes
```

### Step 5 — Run the Dev Server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser and log in with your `.env` admin credentials.

---

## 🚀 Deployment on Vercel

This project is pre-configured for **zero-config Vercel deployment**.

### Steps

1. Push the repo to GitHub under your account
2. Go to [vercel.com](https://vercel.com) → **New Project** → Import your GitHub repo
3. Add all `.env` variables in **Vercel Dashboard → Settings → Environment Variables**
4. Click **Deploy** ✅

The `vercel.json` handles all API routing automatically:

```
GET /v1/api/track/:code   →   /api/track?code=:code
GET /api/v1/track/:code   →   /api/track?code=:code
GET /track/:code          →   /api/track?code=:code
```

---

## 🔌 REST API Reference

### Track a Consignment

```
GET /v1/api/track/:code
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `code` | `string` | ✅ | 13-character India Post consignment ID (e.g. `<tracking-id>`) |

#### Plain JSON Response

```bash
curl https://your-deployment.vercel.app/v1/api/track/<tracking-id>
```

```json
{
  "id": "YourTrackId",
  "status": "status",
  "origin": "mumbai",
  "destination": "new-delhi",
  "weight": "458 g",
  "tariff": "42",
  "delivered": true,
  "events": [
    {
      "date": "2024-01-01T12:30:45Z",
      "office": "mumbai",
      "description": "descriptionofscan",
      "status": "DELIVERED"
    }
  ]
}
```

---

## 🛡️ Security

| Feature | Implementation |
|---------|---------------|
| **Authentication** | Session-based via `.env` credentials. No external auth service. |
| **API Keys** | Generated with `crypto-js`, stored only in localStorage |
| **Encryption** | AES-256 encrypted response mode for API consumers |
| **Rate Limiting** | Configurable per-window request cap to prevent abuse |
| **No Database** | All state is `.env` or localStorage driven — zero DB attack surface |

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend Framework | React 18 + TypeScript |
| Build Tool | Vite 5 |
| Styling | Tailwind CSS |
| Icons | Lucide React |
| API Server | Express.js |
| Encryption | CryptoJS (AES-256) |
| CLI & NPM Package | Node.js Native HTTPS / FS (Zero Third-Party Deps) |
| Deployment | Vercel (Serverless Functions) |

---

## 📜 License

This project is **open source** under the **MIT License**.

Fork it, modify it, deploy it. Attribution is appreciated but not required. 🙏

---

## 👤 About the Author

<div align="center">

### **Sarang**
*Full-Stack Developer · Open Source Builder · India 🇮🇳*

I build fast, functional, and beautifully designed web tools.  
This tracker was born from a real frustration with India Post's clunky official interface.

| | |
|---|---|
| 🌐 **Portfolio / GitHub** | [github.com/5araang](https://github.com/5araang) |
| 📸 **Instagram** | [@5araang](https://instagram.com/5araang) |
| 💻 **GitHub Profile** | [@5araang](https://github.com/5araang) |
| 📦 **NPM Package** | [track-post](https://www.npmjs.com/package/track-post) |
| 📁 **This Repository** | [indian-post-track-order-](https://github.com/5araang/order-tracking-indianpost) |

> *"Ship fast. Break nothing. Track everything."*  
> — Sarang

</div>

---

<div align="center">

⭐ **Star this repo if it helped you!** ⭐

Made with ❤️ in India by **Sarang** · GitHub: [@5araang](https://github.com/5araang) · Instagram: [@5araang](https://instagram.com/5araang)

</div>
