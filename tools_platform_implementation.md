# Tools Platform – Implementation Guide

> **Stack**: Next.js (App Router) • TypeScript • Tailwind CSS • shadcn/ui • Radix UI • UploadThing / Cloudinary • Node APIs • (optional) Sharp, pdf-lib, Tesseract

---

## 1) Project Overview
A multi-tool platform (image converters, document tools, calculators) that can scale to dozens of tools without chaos. This guide defines **structure, roles, conventions, APIs, testing, CI/CD, and deployment** so two developers can work in parallel.

### Primary Goals
- **Scalable structure** for adding tools quickly
- **Separation of concerns** (UI vs Core Logic)
- **Great UX** (fast, accessible, consistent)
- **Search-friendly** (SEO, metadata, sitemaps)
- **Operational readiness** (logging, monitoring, error handling)

---

## 2) Repo Structure
```
/my-tools-app
├── app
│   ├── layout.tsx                      # Global layout (Navbar, Footer, Providers)
│   ├── page.tsx                        # Homepage (tool directory)
│   ├── tools
│   │   ├── image
│   │   │   ├── convert
│   │   │   │   ├── page.tsx            # UI (Dev1)
│   │   │   │   ├── utils.ts            # Tool-local helpers (Dev2)
│   │   │   │   └── components/         # Tool-specific UI (Dev1)
│   │   │   └── compress
│   │   │       ├── page.tsx
│   │   │       └── utils.ts
│   │   ├── docs
│   │   │   ├── pdf-to-word
│   │   │   │   ├── page.tsx
│   │   │   │   └── utils.ts
│   │   │   └── merge-pdf
│   │   │       ├── page.tsx
│   │   │       └── utils.ts
│   │   └── calculators
│   │       ├── bmi
│   │       │   ├── page.tsx
│   │       │   └── utils.ts
│   │       └── loan
│   │           ├── page.tsx
│   │           └── utils.ts
│   │
│   ├── api                               # Backend endpoints (Dev2)
│   │   ├── convert/route.ts
│   │   ├── upload/route.ts
│   │   └── tools/[category]/[slug]/route.ts  # Optional per-tool API
│   │
│   └── (marketing)
│       └── about/page.tsx
│
├── components                           # Global reusable (Dev1)
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   ├── ThemeToggle.tsx
│   ├── Seo.tsx
│   └── ui/                              # shadcn/ui exports live here
│
├── lib                                   # Core logic & utilities (Dev2)
│   ├── converters/
│   │   ├── image.ts                     # sharp-based or canvas-based ops
│   │   └── docs.ts                      # pdf-lib, libreoffice bridge, etc
│   ├── calculators.ts
│   ├── validations.ts
│   ├── logger.ts
│   ├── analytics.ts
│   └── utils.ts
│
├── public                                # Static assets
├── styles
│   └── globals.css
├── scripts/                              # CLIs (codegen, migrations, etc.)
├── docs/                                 # Additional docs
├── .env.example
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## 3) Roles & Responsibilities

### Developer 1 – **Frontend & UX**
- Initialize Next.js, Tailwind, shadcn/ui
- Build global layout + navigation
- Create shared components (Uploader, ResultCard, ToolLayout, EmptyState, ErrorBoundary UI)
- Implement each tool’s **UI page** and state management
- Accessibility (labels, roles, keyboard interactions)
- SEO components & content pages (About, Blog landing)

### Developer 2 – **Backend & Core Logic**
- Implement API routes (`app/api/...`)
- Write **converters and calculators** in `lib/`
- File processing (Sharp, pdf-lib, Office conversions)
- Add logging, rate limiting, and error normalization
- Tests for utilities and APIs
- DevOps: Env, CI/CD, deploy, observability

> Work in **parallel**: Dev1 builds pages and calls stub APIs; Dev2 returns mock responses first, then swaps in real logic.

---

## 4) Conventions

### Naming
- Routes: `/tools/<category>/<slug>` → e.g., `/tools/image/convert`, `/tools/docs/merge-pdf`
- Files: kebab-case for routes, camelCase for functions, PascalCase for components

### Code Style
- TypeScript strict mode on
- Prefer **Server Components**; mark interactive parts with `"use client"`
- Use **React Suspense** and loading UI for async boundaries
- Keep **business logic in `lib/`**, never inside pages

### UI System
- Tailwind for layout/spacing/typography
- **shadcn/ui + Radix** for accessible primitives
- Theme: light/dark, system default; store in `ThemeProvider`

---

## 5) Getting Started

### Prereqs
- Node ≥ 18
- pnpm (recommended) or npm/yarn

### Create App & Install deps
```bash
pnpm create next-app my-tools-app --ts --eslint --tailwind --app
cd my-tools-app
pnpm add class-variance-authority tailwind-merge lucide-react
# shadcn/ui setup
pnpm dlx shadcn@latest init
pnpm dlx shadcn@latest add button input card dialog toast dropdown-menu tabs tooltip

# Optional processing libs
pnpm add sharp pdf-lib form-data zod

# Uploads / storage (choose one)
pnpm add uploadthing @uploadthing/react # or
pnpm add cloudinary
```

### Tailwind Base
- Ensure `globals.css` has `@tailwind base; @tailwind components; @tailwind utilities;`
- Add `dark` class strategy and container settings in `tailwind.config.ts`

---

## 6) Core Components (Dev1)

### `ToolLayout.tsx`
- Provides title, description, breadcrumb, and a standard content area
- Accept optional `help` slot with tips/FAQ

### `FileUploader.tsx`
- Drag & drop + file input
- Props: `accept`, `maxSizeMB`, `onUpload(files: File[])`
- Validates client-side; shows error toast

### `ResultCard.tsx`
- Shows result thumbnail/metadata
- Download button (receives URL or Blob)
- Copy link, “Process another” action

### `EmptyState.tsx` & `ErrorView.tsx`
- Friendly defaults for blank/error states

---

## 7) API Contracts (Dev2)

> **Pattern:** `POST /api/tools/{category}/{slug}` with form-data or JSON

**Example: Image Convert**
```
POST /api/tools/image/convert
Body: multipart/form-data
  - file: File
  - targetFormat: "jpg" | "png" | "webp"
Response 200:
{
  "ok": true,
  "resultUrl": "/api/files/abcd-1234" ,
  "meta": { "size": 12345, "mime": "image/jpeg", "width": 800, "height": 600 }
}
Errors (normalized):
{
  "ok": false,
  "error": { "code": "INVALID_FILE", "message": "PNG or JPG only", "hint": "Max 10MB" }
}
```

**Zod Input Validation** inside route handlers; respond with normalized error shape.

---

## 8) Example Implementations

### 8.1 UI Page (Dev1)
```tsx
"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"

export default function ImageConvertPage() {
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<string | null>(null)
  const { toast } = useToast()

  async function handleConvert() {
    if (!file) return
    setLoading(true)
    try {
      const fd = new FormData()
      fd.append("file", file)
      fd.append("targetFormat", "jpg")
      const res = await fetch("/api/tools/image/convert", { method: "POST", body: fd })
      const json = await res.json()
      if (!json.ok) throw new Error(json.error?.message || "Failed")
      setResult(json.resultUrl)
    } catch (e: any) {
      toast({ title: "Conversion failed", description: e.message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="p-6 space-y-4">
      <Input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} />
      <Button onClick={handleConvert} disabled={!file || loading}>{loading ? "Converting…" : "Convert to JPG"}</Button>
      {result && (
        <a href={result} download className="underline">Download result</a>
      )}
    </Card>
  )
}
```

### 8.2 Route Handler (Dev2)
```ts
// app/api/tools/image/convert/route.ts
import { NextResponse } from "next/server"
import { z } from "zod"
import { convertImage } from "@/lib/converters/image"

const schema = z.object({ targetFormat: z.enum(["jpg","png","webp"]) })

export async function POST(req: Request) {
  try {
    const contentType = req.headers.get("content-type") || ""
    if (!contentType.includes("multipart/form-data"))
      return NextResponse.json({ ok: false, error: { code: "BAD_CONTENT_TYPE", message: "Use multipart/form-data" } }, { status: 415 })

    const form = await req.formData()
    const file = form.get("file") as File | null
    const targetFormat = String(form.get("targetFormat" || ""))
    const parsed = schema.safeParse({ targetFormat })
    if (!parsed.success) return NextResponse.json({ ok: false, error: { code: "VALIDATION_ERROR", message: parsed.error.message } }, { status: 400 })

    if (!file) return NextResponse.json({ ok: false, error: { code: "NO_FILE", message: "File is required" } }, { status: 400 })

    const { url, meta } = await convertImage(file, parsed.data.targetFormat)
    return NextResponse.json({ ok: true, resultUrl: url, meta })
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: { code: "INTERNAL", message: err?.message || "Unexpected" } }, { status: 500 })
  }
}
```

### 8.3 Core Logic (Dev2)
```ts
// lib/converters/image.ts
import sharp from "sharp"

export async function convertImage(file: File, targetFormat: "jpg"|"png"|"webp") {
  const input = Buffer.from(await file.arrayBuffer())
  let instance = sharp(input)
  let output: Buffer
  switch (targetFormat) {
    case "jpg": output = await instance.jpeg({ quality: 85 }).toBuffer(); break
    case "png": output = await instance.png().toBuffer(); break
    case "webp": output = await instance.webp({ quality: 85 }).toBuffer(); break
  }
  // TODO: store output (S3/UploadThing/Cloudinary) and return its URL
  const url = await storeBuffer(output, `converted-${Date.now()}.${targetFormat}`)
  const meta = await sharp(output).metadata()
  return { url, meta }
}

async function storeBuffer(buf: Buffer, filename: string) {
  // Replace with your storage provider
  // Example: UploadThing/Cloudinary/S3
  return `/api/files/${filename}`
}
```

---

## 9) Accessibility (A11y)
- Every input has a visible label
- Keyboard navigable: focus states, ESC to close dialogs
- Use Radix primitives and shadcn/ui components
- Color contrast ≥ WCAG AA

---

## 10) SEO & Content
- Use `generateMetadata` per tool page: title, description, canonical
- Structured data (JSON-LD) for tools and articles
- `/sitemap.xml` + `/robots.txt`
- Fast, descriptive copy on tool pages (H1, intro, steps, FAQs)

**Sample metadata**
```ts
export async function generateMetadata() {
  return {
    title: "PNG to JPG Converter – Free, Fast, No Signup",
    description: "Convert PNG to JPG in your browser. Secure, fast, and free.",
    alternates: { canonical: "https://example.com/tools/image/convert" },
    openGraph: { type: "website", title: "PNG to JPG Converter", url: "https://example.com/tools/image/convert" }
  }
}
```

---

## 11) Error Handling & UX
- Normalize API errors to `{ ok: false, error: { code, message, hint? } }`
- Show toasts for transient errors and inline messages for form errors
- Provide a retry CTA and a link to report issue
- Log server errors with request id

---

## 12) Performance
- Prefer **Edge** runtime for lightweight routes; Node runtime for Sharp/pdf-lib
- Stream responses for large files when possible
- Cache static assets on CDN; add `Cache-Control` headers
- Avoid shipping heavy libs to the client; keep processing on server

---

## 13) Testing
- **Unit tests**: `lib/` functions (Jest/Vitest)
- **API tests**: route handlers (supertest or Next test utilities)
- **Playwright**: smoke tests for critical user flows (upload → result)

```
pnpm add -D vitest @vitest/coverage-v8 ts-node @types/node
pnpm add -D playwright @playwright/test
```

---

## 14) Security & Abuse Prevention
- Validate inputs (mime, size limits) with server-side checks
- Rate limit sensitive endpoints (IP + token bucket)
- Virus scan for documents (optional: ClamAV/Lambda)
- Remove EXIF for privacy on images
- HTTPS-only cookies; no secrets on client

---

## 15) Analytics & Logging
- Page + conversion events: tool slug, duration, success/fail, file size (no PII)
- Use a privacy-friendly analytics (Plausible/Umami) or Vercel Analytics
- `lib/logger.ts` wraps console with levels and requestIds

---

## 16) CI/CD & Branch Strategy
- Branches: `dev/frontend` (Dev1), `dev/backend` (Dev2)
- PRs to `main` with required reviews
- Vercel previews for every PR
- GitHub Actions: run tests + typecheck on PR

**Sample workflow**
```yaml
name: ci
on: [pull_request]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
        with: { version: 9 }
      - run: pnpm install --frozen-lockfile
      - run: pnpm typecheck
      - run: pnpm test -- --run
```

---

## 17) Environments & Config
- `.env.local` for local; `.env` on Vercel for prod
- Example vars:
```
STORAGE_PROVIDER=uploadthing|cloudinary|s3
MAX_FILE_MB=10
NODE_OPTIONS=--max_old_space_size=4096
```

---

## 18) Deployment
- **Vercel** for the app
- If Sharp/pdf-lib cause build issues, set to **Node.js runtime** for those routes and enable `vercel-build-output` if needed
- Consider a small **worker service** later for heavy jobs (queue + S3 output)

---

## 19) Tool Template (Scaffold)
Create a CLI script to scaffold a new tool quickly.

```
# scripts/new-tool.ts
# Usage: pnpm tsx scripts/new-tool.ts image convert
```

**Behavior**
- Creates `/app/tools/<category>/<slug>/page.tsx`
- Creates `/app/tools/<category>/<slug>/utils.ts`
- Adds stub API `app/api/tools/<category>/<slug>/route.ts`
- Prints TODOs

---

## 20) Initial Roadmap (Milestones)
1. **M1: Foundation** – Project setup, layout, uploader, one working tool (PNG→JPG)
2. **M2: Docs Tools** – Merge PDF, PDF→Word
3. **M3: Calculators** – BMI, Loan
4. **M4: Observability** – analytics, logging, error reporting
5. **M5: Polish** – SEO content, FAQs, performance passes

---

## 21) Contribution Guidelines (Internal)
- Small PRs, clear titles, link to issue
- Include screenshots for UI changes
- Add/Update tests for `lib/` changes
- Keep pages clean; push logic into `lib/`

---

## 22) Checklists

### Tool Page Done
- [ ] Metadata set (title/description/canonical)
- [ ] Labels + accessible controls
- [ ] Handles empty, loading, success, error states
- [ ] Calls API with proper validation
- [ ] Download works; file types verified

### API Route Done
- [ ] Zod validation
- [ ] Normalized errors
- [ ] Size/mime checks
- [ ] Logging with requestId
- [ ] Unit tests

---

## 23) Appendix: Libraries to Consider
- **Images:** sharp, jimp
- **PDF:** pdf-lib, pdfjs, hummus, Ghostscript bridge
- **Office:** libreoffice headless (dockerized) + unoconv bridge
- **OCR:** Tesseract.js (client), Tesseract (server)
- **Storage:** UploadThing, Cloudinary, S3 (Presigned URLs)
- **Rate limit:** upstash/ratelimit

---

**You’re set.** Dev1 starts wiring the UI + shared components; Dev2 implements the first API route with mock → real logic. Add one tool per category first, then iterate.

