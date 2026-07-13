# Freelance Website Playbook
## Stack: Astro 4 + Sanity v3 + Vercel
### Client gets a hosted CMS dashboard to manage their own content

---

## What this stack does

| Layer | Tool | Purpose |
|-------|------|---------|
| Frontend | Astro 4 (static) | Builds the public website as plain HTML/CSS/JS |
| CMS | Sanity v3 | Client-facing dashboard at `clientname.sanity.studio` |
| Hosting | Vercel | Deploys the site, auto-rebuilds when client publishes |
| Trigger | Sanity Webhook → Vercel Deploy Hook | Publish in Sanity → site updates in ~1 min |

**How it works for the client:**  
Client logs into `their-studio.sanity.studio`, edits content, clicks Publish. Vercel gets a webhook, rebuilds the site, and the live URL updates automatically. No developer needed for day-to-day content changes.

---

## Master Prompt (copy-paste this to start a new project)

```
Build me a static website for [CLIENT NAME], a [BUSINESS TYPE] based in [LOCATION].

Stack: Astro 4 + Sanity v3 + Vercel (same as the GreenCycle playbook).
The client needs a Sanity Studio dashboard to manage their own content.

Pages needed: [list pages e.g. Home, About, Services, Gallery, Contact]

Brand:
- Primary colour: [hex]
- Font: [e.g. Inter / Bricolage Grotesque]
- Logo file: [filename in images/]

Content the client should be able to edit from Sanity:
- [e.g. hero banner image and text]
- [e.g. services list with title, description, icon]
- [e.g. before/after gallery items with category]
- [e.g. testimonials]
- [e.g. contact details: phone, email, WhatsApp, address]

Static content (hardcoded, not editable):
- [e.g. navigation, footer links, how-it-works steps]

Images I will supply: [list files in images/gallery/ folder]

The site must:
- Auto-rebuild on Sanity publish (Sanity webhook → Vercel deploy hook)
- Use clean URLs (no .html, no trailing slash)
- Load images from Sanity CDN (GROQ asset->url projection)
- Show real images on all before/after sliders
- Display the correct logo in the header and favicon

Follow all rules in PLAYBOOK.md for file structure, GROQ patterns, and known gotchas.
```

---

## Project File Structure

```
project-root/
├── public/
│   ├── logo.jpg           ← header logo (copy from images/)
│   ├── favicon.jpg        ← browser tab icon (same file)
│   ├── images/            ← static images used directly in pages
│   └── scripts/
│       └── interactions.js ← client-side JS (sliders, nav, WA widget)
├── src/
│   ├── layouts/
│   │   └── Layout.astro   ← shared header, footer, nav, WA widget
│   ├── lib/
│   │   └── sanity.js      ← Sanity client + all fetch functions
│   ├── pages/
│   │   ├── index.astro
│   │   ├── about.astro
│   │   ├── services.astro
│   │   ├── gallery.astro
│   │   └── contact.astro
│   └── styles/
│       └── global.css
├── studio/                ← Sanity Studio (separate project)
│   ├── schemaTypes/
│   │   ├── index.js
│   │   ├── siteSettings.js
│   │   ├── galleryItem.js
│   │   └── testimonial.js
│   ├── sanity.config.js
│   └── package.json
├── images/                ← source images from client (NOT served directly)
│   ├── gallery/           ← originals
│   └── split/             ← pre-split before/after pairs
├── astro.config.mjs
├── vercel.json
└── package.json
```

> **Rule:** Only files inside `public/` are served by the live site.  
> Images in `images/` must be either copied to `public/images/` or uploaded to Sanity.

---

## Step-by-Step Build Process

### 1. Init Astro project

```bash
npm create astro@latest . -- --template minimal --no-install
npm install
npm install @sanity/client @sanity/image-url
npm install @astrojs/vercel@7 --legacy-peer-deps
```

> Use `@astrojs/vercel@7` — the latest (v11) requires Astro 7. Astro 4 needs v7.

### 2. astro.config.mjs

```js
import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel/static';

export default defineConfig({
  output: 'static',
  adapter: vercel(),
  trailingSlash: 'never',
});
```

### 3. vercel.json

```json
{ "cleanUrls": true, "trailingSlash": false }
```

### 4. Environment variables (.env for local, Vercel dashboard for prod)

```
PUBLIC_SANITY_PROJECT_ID=xxxxxxxx
PUBLIC_SANITY_DATASET=production
```

Set both on Vercel under Settings → Environment Variables → Production + Preview.

### 5. src/lib/sanity.js (standard template)

```js
import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

const projectId = import.meta.env.PUBLIC_SANITY_PROJECT_ID;
const dataset   = import.meta.env.PUBLIC_SANITY_DATASET || 'production';

export const client = projectId
  ? createClient({ projectId, dataset, useCdn: false, apiVersion: '2024-01-01' })
  : null;

const builder = client ? imageUrlBuilder(client) : null;
export const urlFor = (source) => builder?.image(source);

export async function getSiteSettings() {
  if (!client) return null;
  try {
    return await client.fetch(`*[_type == "siteSettings"][0] {
      ...,
      "heroBgUrl":     heroBgImage.asset->url,
      "heroBeforeUrl": heroBefore.asset->url,
      "heroAfterUrl":  heroAfter.asset->url
    }`);
  } catch { return null; }
}

export async function getGalleryItems(limit = 12) {
  if (!client) return [];
  try {
    return await client.fetch(
      `*[_type == "galleryItem"] | order(_createdAt desc) [0...$limit] {
        _id, title, subtitle, category,
        "beforeImageUrl": beforeImage.asset->url,
        "afterImageUrl":  afterImage.asset->url
      }`,
      { limit: limit - 1 }
    );
  } catch { return []; }
}

export async function getTestimonials() {
  if (!client) return [];
  try {
    return await client.fetch(
      `*[_type == "testimonial" && published == true] | order(order asc) {
        _id, name, role, company, quote, rating
      }`
    );
  } catch { return []; }
}
```

> **Critical GROQ rule:** Never return a raw image reference. Always project `"fieldUrl": field.asset->url` in the GROQ query, then use `item.fieldUrl` in templates. Using `urlFor(item.field)` at build time does not work reliably.

### 6. Init Sanity Studio

```bash
mkdir studio && cd studio
npm create sanity@latest -- --project NEW --dataset production --template clean
```

Then configure schemas in `studio/schemaTypes/`.

### 7. Deploy Sanity Studio

```bash
cd studio
npx sanity deploy
# Arrow key ↓ to select existing hostname, press Enter
# Do NOT create a new hostname each time
```

> This is interactive — cannot be automated. Must run manually each time schemas change.

### 8. Vercel setup

1. Push to GitHub
2. Import repo in Vercel
3. **Framework Preset: Astro** (not "Other" — "Other" serves from root and ignores `dist/`)
4. Add environment variables
5. Deploy

### 9. Connect Sanity webhook → Vercel

In Vercel: Settings → Git → Deploy Hooks → Create hook → copy URL  
In Sanity Studio: Manage → API → Webhooks → Add:
- URL: the Vercel hook URL
- Dataset: production
- Trigger on: Publish

Now every Publish in Sanity triggers a Vercel rebuild automatically.

---

## Sanity Schema Patterns

### siteSettings.js (singleton — one document, client edits it)

```js
export default {
  name: 'siteSettings', title: 'Site Settings', type: 'document',
  fields: [
    { name: 'phone1',      title: 'Primary Phone',   type: 'string' },
    { name: 'phone2',      title: 'Secondary Phone',  type: 'string' },
    { name: 'whatsapp',    title: 'WhatsApp Number (with country code)', type: 'string' },
    { name: 'email',       title: 'Email',            type: 'string' },
    { name: 'address',     title: 'Address',          type: 'string' },
    { name: 'heroBgImage', title: 'Hero Background Photo', type: 'image', options: { hotspot: true } },
    { name: 'heroBefore',  title: 'Hero Before Photo',     type: 'image', options: { hotspot: true } },
    { name: 'heroAfter',   title: 'Hero After Photo',      type: 'image', options: { hotspot: true } },
  ]
}
```

### galleryItem.js (before/after pairs with category)

```js
export default {
  name: 'galleryItem', title: 'Gallery Item', type: 'document',
  fields: [
    { name: 'title',       title: 'Title',    type: 'string' },
    { name: 'subtitle',    title: 'Subtitle', type: 'string' },
    { name: 'category',    title: 'Category', type: 'string',
      options: { list: ['post-construction','domestic','commercial','waste','event'] } },
    { name: 'beforeImage', title: 'Before Photo', type: 'image', options: { hotspot: true } },
    { name: 'afterImage',  title: 'After Photo',  type: 'image', options: { hotspot: true } },
  ]
}
```

### testimonial.js

```js
export default {
  name: 'testimonial', title: 'Testimonial', type: 'document',
  fields: [
    { name: 'name',      title: 'Client Name', type: 'string' },
    { name: 'role',      title: 'Role',        type: 'string' },
    { name: 'company',   title: 'Company',     type: 'string' },
    { name: 'quote',     title: 'Quote',       type: 'text' },
    { name: 'rating',    title: 'Rating (1-5)',type: 'number' },
    { name: 'order',     title: 'Display Order', type: 'number' },
    { name: 'published', title: 'Published',   type: 'boolean' },
  ]
}
```

---

## Before/After Slider Pattern

### In Astro template (static images)

```astro
<div class="ba-slider"
  data-before="ph-dust"
  data-after="ph-clean"
  data-before-img="/images/office-before.jpg"
  data-after-img="/images/office-after.jpg"
></div>
```

### In Astro template (Sanity images)

```astro
<!-- GROQ must project the URL, not return the reference object -->
<div class="ba-slider"
  data-before-img={item.beforeImageUrl || ''}
  data-after-img={item.afterImageUrl || ''}
></div>
```

### In interactions.js (client-side init)

```js
// MUST include background-size and background-position — the CSS shorthand resets them
const bStyle = beforeImg
  ? `style="background-image:url('${beforeImg}');background-size:cover;background-position:center"`
  : '';
const aStyle = afterImg
  ? `style="background-image:url('${afterImg}');background-size:cover;background-position:center"`
  : '';
```

> **Gotcha:** CSS `background` shorthand resets `background-size` to `auto auto`. If you set a background image via JS you must also set `background-size:cover` inline or the image will appear at its natural pixel size, cropped to the top-left corner.

---

## Logo & Favicon Rules

1. The logo file must be in `public/` — e.g. `public/logo.jpg`
2. Use the correct file extension that matches the actual image format
3. In `Layout.astro` header — use only the class that applies your sizing, not the old SVG placeholder class:

```astro
<!-- CORRECT -->
<img src="/logo.jpg" alt="Client Name" class="brand-logo" />

<!-- WRONG — 'mark' class has higher CSS specificity and overrides brand-logo styles -->
<img src="/logo.jpg" alt="Client Name" class="mark brand-logo" />
```

4. Favicon uses the same file:

```html
<link rel="icon" type="image/jpeg" href="/favicon.jpg" />
<link rel="shortcut icon" href="/favicon.jpg" />
```

5. Check `images/gallery/` for the correct logo file before committing. There may be multiple image files — open them with the Read tool to visually confirm which is the actual logo.

---

## Known Gotchas & Fixes

| Problem | Cause | Fix |
|---------|-------|-----|
| Old SPA served instead of Astro pages | `index.html` in project root overrides Vercel dist output | `git rm index.html` |
| `/gallery` 404, only `/#/gallery` works | Vercel Framework Preset set to "Other" serves from root | Change to "Astro" in Vercel settings |
| `@astrojs/vercel` install fails | Latest v11 requires Astro 7 | `npm install @astrojs/vercel@7 --legacy-peer-deps` |
| Sanity images not showing | GROQ returns reference object `{_type:'image',asset:{_ref:...}}` not a URL | Project URLs in GROQ: `"imgUrl": field.asset->url` |
| Image shows at wrong size/position | CSS `background` shorthand resets `background-size` | Add `background-size:cover;background-position:center` inline |
| Sanity content not updating on live site | Webhook not set up, or Vercel Framework was "Other" | Set up webhook + set Framework to "Astro" |
| `sanity deploy` always creates new hostname | Interactive CLI can't be piped | Run manually, use ↓ arrow to select existing hostname |
| Logo not showing / wrong image | Wrong file committed, or CSS specificity conflict | Read image files with Read tool to visually verify before committing |
| Favicon shows globe icon | `favicon.svg` referenced but doesn't exist in `public/` | Copy logo to `public/favicon.jpg`, update `<link>` tags |

---

## Client Handover Checklist

- [ ] Sanity Studio deployed and accessible at `clientname.sanity.studio`
- [ ] Client has a Sanity account and is added as editor
- [ ] Webhook connected (Sanity publish → Vercel rebuild)
- [ ] All content fields visible in Studio (run `npx sanity deploy` after every schema change)
- [ ] Environment variables set on Vercel (Production + Preview)
- [ ] Logo and favicon showing correctly (hard refresh to verify)
- [ ] All before/after sliders showing real images
- [ ] Clean URLs working (`/gallery` not `/#/gallery`)
- [ ] Site visible at production domain

---

## Splitting Composite Before/After Images (PowerShell)

When the client gives you a single image with before on the left and after on the right:

```powershell
$src = "images\gallery\Dust bins.png"
$img = [System.Drawing.Image]::FromFile((Resolve-Path $src))
$w   = [int]($img.Width / 2)
$h   = $img.Height

$before = New-Object System.Drawing.Bitmap($w, $h)
$after  = New-Object System.Drawing.Bitmap($w, $h)
$gB = [System.Drawing.Graphics]::FromImage($before)
$gA = [System.Drawing.Graphics]::FromImage($after)

$gB.DrawImage($img, (New-Object System.Drawing.Rectangle(0,0,$w,$h)),
              (New-Object System.Drawing.Rectangle(0,0,$w,$h)),
              [System.Drawing.GraphicsUnit]::Pixel)
$gA.DrawImage($img, (New-Object System.Drawing.Rectangle(0,0,$w,$h)),
              (New-Object System.Drawing.Rectangle($w,0,$w,$h)),
              [System.Drawing.GraphicsUnit]::Pixel)

New-Item -ItemType Directory -Force "images\split" | Out-Null
$before.Save("images\split\dustbins-before.jpg",
  [System.Drawing.Imaging.ImageFormat]::Jpeg)
$after.Save("images\split\dustbins-after.jpg",
  [System.Drawing.Imaging.ImageFormat]::Jpeg)

$gB.Dispose(); $gA.Dispose()
$before.Dispose(); $after.Dispose(); $img.Dispose()
Write-Host "Done"
```

Save the split files to `images/split/`, then copy the ones you need to `public/images/` before committing.

---

## Tech Stack Versions (last verified working)

```json
{
  "astro": "^4.16.0",
  "@astrojs/vercel": "^7.x",
  "@sanity/client": "^6.22.0",
  "@sanity/image-url": "^1.1.0"
}
```

Install vercel adapter with `--legacy-peer-deps` to avoid peer dependency errors.
