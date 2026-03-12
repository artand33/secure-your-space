# IMPLEMENTATION METADATA PLAN

## Objective
Replace the current Lovable-generated metadata and previews with a custom and robust metadata structure—including complete Social Media integrations (Open Graph and Twitter Cards). 

> **Note**: I have already proactively generated a snapshot of your local website using headless chromium and saved it to `public/og-image.png`! This is ready to replace the default Lovable preview image.

## Files to Modify
- `index.html`
- `public/robots.txt` (Create)

## Step-by-Step Implementation

### 1. Basic & SEO Metadata
Update the fundamental HTML metadata tags in `index.html`, keeping them robust and keyword-optimized.
- **`<title>`**: Check and refine the main title.
- **`<meta name="description">`**: Ensure we have a concise, engaging summary.
- **`<meta name="keywords">`**: Relevant keywords specific to the business (e.g., Security, CCTV, Access Control, UK).
- **`<link rel="canonical" href="...">`**: Prevent duplicate content issues on search engines.

### 2. Open Graph (Facebook, LinkedIn, Discord, etc.) Metadata
Replace the `lovable.dev` properties with the project details and our fresh local snapshot.
- `og:title` & `og:description`
- `og:type`: Set to `website`.
- `og:url`: Replace with your actual production URL (or prepare a clear placeholder for it).
- `og:image`: Use the newly created snapshot (`/og-image.png`).
- `og:site_name`: "SecureGuard Systems"

### 3. Twitter / X Card Metadata
Add full Twitter Card support for better link sharing.
- `twitter:card`: `summary_large_image` to showcase the snapshot beautifully.
- `twitter:title` & `twitter:description`
- `twitter:image`: Point to the new `/og-image.png`.

### 4. Extra SEO / Indexing (Optional but Recommended)
- Create `public/robots.txt`: Ensure proper crawling permissions for search engines.
- Prepare Apple Touch Icons & Theme colors to fit the brand perfectly.

## Checklist
- [x] Take a snapshot of the current local website and save it as `public/og-image.png`. 
- [ ] Update standard HTML metadata headers in `index.html`.
- [ ] Replace `lovable.dev` image URLs with `og-image.png`.
- [ ] Implement complete, robust Open Graph (`og:`) tags.
- [ ] Implement complete, robust Twitter (`twitter:`) tags.
- [ ] Replace any target URLs with the actual production domain string.
- [ ] Add `robots.txt`.

> **Status:** Plan is drafted and the website screenshot is successfully saved to `public/og-image.png`. Let me know when you'd like me to start writing the code to implement these tags!
