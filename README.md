# Public Workplace Tools

Client-side office utilities built with Next.js, React, Tailwind CSS, and TypeScript.

## Features

- Image converter (PNG/JPG/WEBP) with local optimization
- QR code generator (download PNG)
- JSON <> XML translator
- JSON viewer and validator
- SQL compactor (one-line output)
- Base64 text/file utility

## Tech Stack

- Next.js App Router + React
- TypeScript
- Tailwind CSS (v4)
- qrcode
- fast-xml-parser
- sql-formatter
- react-json-view-lite
- browser-image-compression

## Run Locally

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Security Model (Short and Sweet)

- No backend endpoints are used by tools.
- File and text processing happens in browser memory only.
- No uploads are required for conversion features.
- CSP and hardening headers are enabled in Next config.
- File-size limits are enforced on heavy parsers to reduce browser strain.

## Why This Is Safe For Workplace Usage

- Users can do transformations without sharing sensitive internal data.
- The app can be hosted publicly while still processing private data locally.
- Security headers reduce browser attack surface and framing risks.
- Components avoid dangerous HTML injection patterns.

## Build

```bash
npm run build
npm run start
```

## Deploy

Deploy to Vercel as a standard Next.js application.
