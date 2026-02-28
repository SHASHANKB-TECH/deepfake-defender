

# DeepFake-X — AI Media Authenticity Detector

## Overview
A public-facing web app where users can sign up, upload photos/videos, and get AI-powered analysis of whether the media is authentic or AI-generated/deepfaked. Uses Lovable AI (Gemini) for analysis with a polished, modern dark-themed UI.

## Pages & Features

### 1. Landing Page
- Bold hero section with "Detect Deepfakes in Seconds" tagline and animated background
- Feature highlights: Eye Reflection Analysis, Audio-Visual Sync Detection, Frequency Domain Analysis, Temporal Pattern Detection, Physiological Signal Analysis
- Trust stats (e.g., "10,000+ scans performed")
- How It Works — 3-step flow: Upload → Analyze → Get Results
- CTA buttons to sign up or try a demo

### 2. Authentication (Supabase)
- Sign up / Log in pages with email + password
- Password reset flow
- User profiles table for storing display name and avatar

### 3. Dashboard (Authenticated)
- Overview cards: Total Scans, Deepfakes Detected, Authenticity Score Average
- Recent analysis history with thumbnails and results
- Quick upload button

### 4. Analysis Page (Core Feature)
- Drag-and-drop upload zone for images and videos
- File type validation (JPEG, PNG, MP4, WebM) with size limits
- Once uploaded, a multi-step analysis animation plays while Lovable AI (Gemini) analyzes the media
- **Analysis Modules displayed:**
  - 🔍 Eye Reflection Consistency — checks for mismatched or missing reflections
  - 🎭 Facial Artifact Detection — skin texture, blending edges, warping
  - 🔊 Audio-Visual Sync — lip movement vs audio alignment (for video)
  - 📊 Frequency Domain Analysis — detects GAN fingerprints in frequency spectrum
  - ⏱️ Temporal Consistency — frame-to-frame coherence check
  - 🧠 Physiological Signals — micro-expressions, blinking patterns, pulse estimation
- Each module shows a confidence score (0-100%) and pass/fail status

### 5. Results Page
- Overall Authenticity Score with a large visual gauge (green = authentic, red = deepfake)
- Detailed breakdown per module with explanations
- Risk level badge: Authentic / Suspicious / Likely Deepfake
- Heatmap overlay on the image showing suspicious regions
- Download report as PDF option
- Share result link

### 6. Analysis History
- Searchable/filterable table of past analyses
- Filter by: date range, result type (authentic/deepfake), media type
- Click to view full results

### 7. Settings Page
- Profile management (name, avatar)
- Notification preferences
- Account deletion

## Design
- Dark theme with cyan/purple accent colors (cybersecurity aesthetic)
- Glassmorphism cards
- Smooth animations for analysis progress
- Responsive — works on mobile and desktop

## Backend (Lovable Cloud + Supabase)
- Supabase for auth, user profiles, and analysis history storage
- Edge function calling Lovable AI (Gemini) to analyze uploaded media descriptions and metadata
- Supabase Storage for uploaded media files

## Important Note
The AI analysis uses Gemini's vision capabilities to examine images/video frames. This provides meaningful analysis of visual artifacts, but is not equivalent to purpose-built ML deepfake detection models. The UI presents the analysis through the lens of deepfake detection modules for a professional experience.

