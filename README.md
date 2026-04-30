# Stealth Tools — Zero backend. Zero tracking. Just tools

A client-side suite of office utilities. Built with **Next.js (App Router)**, **React**, **TypeScript**, and **Tailwind CSS**. Every tool runs entirely in your browser. No backend, no uploads, no telemetry.

Live source: <https://github.com/gmook9/stealthtools>

---

## Tools

| Tool | What It Does | Library |
| --- | --- | --- |
| Image Converter | Convert PNG/JPG/WEBP with optional optimization, all via canvas | `browser-image-compression` |
| QR Generator | Generate downloadable PNG QR codes | `qrcode` |
| JSON / XML Translator | Convert payloads between JSON and XML | `fast-xml-parser` |
| JSON Viewer | Validate, prettify, minify, and visualize JSON | `react-json-view-lite` |
| SQL Compactor | Pretty format or flatten SQL to one line | `sql-formatter` |
| CSV / JSON Converter | Parse CSV to JSON and back with delimiter/header controls | `papaparse` |
| Base64 Utility | Encode and decode text or small files to Base64 | Browser `btoa` / `atob` |
| URL Encoder / Decoder | Encode/decode URI components and full URIs | Browser `encodeURIComponent` / `encodeURI` |
| JWT Decoder | Decode JWT header and payload (no signature verification) | Browser `atob` only |
| Hash Generator | SHA-1/256/384/512 hashes for text or files | Browser `SubtleCrypto.digest` |
| UUID Generator | Generate batches of UUIDv4 values | Browser `crypto.randomUUID` |
| Password Generator | Generate strong random passwords with entropy estimate | Browser `crypto.getRandomValues` |
| Text Diff | Side-by-side diff with added/removed highlighting | `diff` |
| Regex Tester | Run JS regex against sample text with capture groups | Browser `RegExp` |
| Case Converter | camel, Pascal, snake, kebab, CONSTANT, Title, Sentence cases | Pure string functions |
| Timestamp Converter | Convert between epoch seconds/ms and ISO 8601 | Browser `Date` |

Icons are provided by `react-icons`.

---

## Vetted Library List

Every dependency is widely used, actively maintained, and has been chosen because it does not require network access at runtime.

| Package | Use | Why It Was Chosen |
| --- | --- | --- |
| `next` | App framework | Industry standard React framework with SSG output |
| `react`, `react-dom` | UI library | Required by Next.js |
| `tailwindcss` | Styling baseline | First-party Tailwind v4 with PostCSS pipeline |
| `react-icons` | Icon set | MIT licensed, tree-shakeable |
| `qrcode` | QR generation | Pure JS, no network calls |
| `fast-xml-parser` | XML <-> JSON | Audited, well-known, no `eval` |
| `sql-formatter` | SQL formatting | No DB connectivity, pure parser |
| `react-json-view-lite` | JSON tree viewer | Lightweight viewer with no dangerous HTML rendering |
| `browser-image-compression` | Image optimization | Pure browser, uses Web Workers locally |
| `papaparse` | CSV parsing | Streaming-capable, well known |
| `diff` | Text diff | Long-standing maintained library |
| `@types/*` | TypeScript types | DefinitelyTyped definitions only |

### Known Advisories

- `npm audit` reports a **build-time only** moderate advisory in the `postcss` version bundled inside `next/node_modules/postcss` (CSS stringify XSS via untrusted CSS). This site never accepts untrusted CSS, and `postcss` is not shipped to the browser. The advisory cannot be remediated without downgrading Next.js to an unsupported major. It is monitored upstream.

---

## Security Model

**What runs in your browser, stays in your browser.** This site has no backend that processes your data.

- **No backend processing.** There are no API routes that perform conversions or accept your data.
- **No uploads.** File inputs are read into memory using browser APIs only (`FileReader`, `Blob.text`, `Blob.arrayBuffer`).
- **No telemetry.** No analytics SDKs, no third-party scripts, no font CDNs at runtime (fonts are self-hosted by `next/font`).
- **Strict security headers** are sent on every response (see `next.config.ts`):
  - `Content-Security-Policy` restricting scripts, styles, images, fonts, workers, and connections to same-origin
  - `X-Frame-Options: DENY` plus `frame-ancestors 'none'`
  - `X-Content-Type-Options: nosniff`
  - `Referrer-Policy: strict-origin-when-cross-origin`
  - `Permissions-Policy` denying camera, microphone, and geolocation
  - `Strict-Transport-Security` for HTTPS enforcement
  - `Cross-Origin-Opener-Policy: same-origin`
- **Defensive UI limits** on every parser (file-size caps, character caps, regex iteration cap) keep the browser tab responsive and prevent denial-of-service from pathological input.
- **No `dangerouslySetInnerHTML`.** Every tool renders user data as plain text or via libraries that do not interpret HTML.
- **All randomness uses `crypto.getRandomValues` / `crypto.randomUUID`.** No `Math.random` is used for credentials or IDs.
- **Cryptographic operations use the browser `SubtleCrypto` API.** No third-party crypto libraries are used.

### Practical Caveats

- Browser memory bounds the size of files you can convert. Limits are enforced per tool (see status messages).
- The JWT Decoder only **inspects** tokens. It does not validate signatures.
- The Hash tool ships SHA-1 for legacy use only; prefer SHA-256 or higher for any security purpose.
- Output downloads use `blob:` URLs that are revoked after the click.
- The site assumes a modern, evergreen browser (Chromium, Firefox, Safari, Edge).

---

## Per-Tool Security Checklist

| Tool | Input Bounds | Hardening Notes |
| --- | --- | --- |
| Image Converter | 20 MB upload, MIME whitelist | Sanitized filename, blob revoked, canvas decode |
| QR Generator | 2,000 char input | Debounced render, no HTML, low error correction |
| JSON / XML | 1 MB text | `processEntities: true`, attribute prefix, parser exceptions surfaced |
| JSON Viewer | 3 MB file | Library renders text-only tree, no HTML interpretation |
| SQL Compactor | Text input | sql-formatter never executes SQL, dialect whitelist |
| CSV / JSON | 5 MB file | Strict papaparse, delimiter whitelist, JSON must be array |
| Base64 | 2 MB file | UTF-8 safe encode/decode, whitespace stripped before `atob` |
| URL Encoder | Text input | Browser primitives only |
| JWT Decoder | Text input | Signature **never** verified; plain-text render only |
| Hash | 25 MB file | `SubtleCrypto.digest` only |
| UUID | Batch <= 100 | `crypto.randomUUID` only |
| Password | Length 8 - 128 | `crypto.getRandomValues`, entropy displayed |
| Text Diff | 200k chars per side | Pure diff library, escaped output |
| Regex | 50k char input, 500 match cap | Flag whitelist `gimsuy`, runaway-loop protection |
| Case Converter | Text input | Pure string operations |
| Timestamp | Text input | Browser `Date` only, NaN guard |

---

## Run Locally

```powershell
npm install
npm run dev
```

Open <http://localhost:3000>.

## Build And Deploy

```powershell
npm run build
npm run start
```