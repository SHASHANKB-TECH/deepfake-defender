# Crown Shield

AI-Powered Deepfake Detection — analyze images and videos across 8 forensic-grade modules with professional accuracy.

## Overview

Crown Shield is a client-side web application for detecting AI-generated and manipulated media. It provides a high-end command-center dashboard, batch upload support, and detailed forensic-style analysis reports with downloadable PDFs.

## Features

- **Batch Upload** — analyze up to 10 files at once (JPEG, PNG, WEBP, MP4, MOV, AVI; max 20MB each)
- **8 Forensic AI Modules** — facial inconsistency, GAN fingerprint detection, edge artifact analysis, temporal coherence (video), lighting inconsistency, expression symmetry, skin texture mapping, and metadata forensics
- **Confidence Scoring** — 0-100% authenticity meter with color-coded risk levels
- **Forensic Report Modal** — heatmap overlays, reasoning explanations, and module-by-module breakdown
- **PDF Export** — generate downloadable A4 analysis reports with full findings
- **Command Center Dashboard** — modern bento-grid layout with animated stats, activity feed, detection ring gauge, and threat distribution
- **Analysis History** — search, filter, and review past scans
- **Dark UI** — glassmorphism design with deep navy/violet tones and amber gold accents

## Tech Stack

- React 18 + TypeScript + Vite
- Tailwind CSS + shadcn/ui
- Supabase (auth + database)
- Framer Motion (animations)
- jsPDF (report generation)
- React Query (server state)

## Prerequisites

- [Node.js](https://nodejs.org/) (v18+ recommended)
- [Bun](https://bun.sh/) or npm

## Setup

1. Clone the repository
   ```sh
   git clone <YOUR_GIT_URL>
   cd <YOUR_PROJECT_NAME>
   ```

2. Install dependencies
   ```sh
   bun install
   ```
   Or with npm:
   ```sh
   npm install
   ```

3. Configure environment variables
   
   Create a `.env` file in the project root with your Supabase credentials:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

## Run Locally

Start the development server:
```sh
bun run dev
```
Or with npm:
```sh
npm run dev
```

The app will be available at `http://localhost:8080`.

## Build for Production

```sh
bun run build
```

## Scripts

| Command | Description |
|---------|-------------|
| `bun run dev` | Start dev server (Vite) |
| `bun run build` | Production build |
| `bun run preview` | Preview production build |
| `bun run test` | Run tests (Vitest) |
| `bun run lint` | Run ESLint |

## Project Structure

```
src/
  components/      # UI components (shadcn + custom)
  pages/           # Route pages (Index, Dashboard, Analyze, Results, History)
  lib/             # Utilities (PDF generation, helpers)
  integrations/    # Supabase client
public/
supabase/          # Database migrations & config
```

## License

Private — all rights reserved.
