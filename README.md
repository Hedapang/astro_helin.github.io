# Lin He — Academic Website

A complete, build-free English academic website for GitHub Pages, revised with a compact academic layout and a purple accent palette. Open `index.html` to view it locally. No installation, account, API key, external font, or build step is needed. All research content and PDF downloads work without JavaScript; JavaScript supplies the local page editor and portrait fallback.

## Edit directly on the page

Open `index.html` locally and choose **编辑页面**. Click text to edit it, or select a text range and use the size and weight controls. Click an image to replace or delete it; choose **插入图片** to upload a PNG, JPEG, WebP, or GIF near the selected text. Uploaded images are embedded into the exported HTML, so no extra image upload is needed.

Choose **下载网页**. If no download appears, use the persistent **点击这里保存 index.html** link. **另存为** uses the file save picker in supported browsers. The **显示／复制网页源码** control exposes the complete HTML for copying into a UTF-8 plain-text file when downloads are unavailable. The editor's own export links are excluded from the editing-mode navigation blocker.

Replace the original `index.html` with the exported file. Rename it if the browser adds a suffix. To publish, upload the exported HTML to GitHub. On this editor upgrade, replace the HTML, stylesheet, editor.js and site.js together, or use the complete new package. Preserve the assets folder.

Unsaved changes stay in the current tab. Cancel restores that session's initial text, styles, images and links. The exporter retains styled spans and uploaded images, includes every publication, and strips transient editing markup. The editor only appears for local files and localhost/loopback previews. It edits HTML, not PDFs or the reference JSON. Use appropriately sized images to keep the HTML manageable.

Typography: Georgia for public headings; Arial for body text, navigation and controls.

## Publish on GitHub Pages

1. Unzip the delivery archive. Open the `lin-he-academic` folder.
2. Create a GitHub repository named **YOUR-USERNAME.github.io** (replace YOUR-USERNAME with your actual GitHub username). An ordinary repository name such as `academic` also works.
3. Upload the **contents** of `lin-he-academic`, not the containing folder or ZIP, to the repository's root. At the top level you must see `index.html`, `assets/`, and `.nojekyll`. Include the full assets folder. If the uploader omits `.nojekyll`, create that empty file through GitHub's “Add file”.
4. In **Settings → Pages → Build and deployment**, choose **Deploy from a branch**, then **main** and **/(root)**. Click **Save**. Use your actual default branch if it is not named main.
5. Wait for the Pages deployment to succeed under **Actions**. GitHub says publication can take up to 10 minutes.
6. Open the exact URL shown in Settings → Pages. For a user repository it is `https://YOUR-USERNAME.github.io/`; for a repository called `academic`, it is `https://YOUR-USERNAME.github.io/academic/`.

All local asset links are relative, so both user and project Pages are supported.

### If you see 404

- Confirm the repository-root file is named exactly `index.html` (lowercase), not inside an extra folder.
- Confirm Pages points to the correct branch and **/(root)**, not `/docs`.
- For a project repository, include the repository name in the URL.
- Check Actions for a successful Pages deployment and allow publication time.
- Paths are case sensitive on GitHub Pages. Preserve filenames and the assets folder structure.
- Do not open the repository's `github.com` file URL as the website. Use the Pages URL shown in Settings.
- No custom domain is configured in this delivery.

Official references:
- https://docs.github.com/en/pages/quickstart
- https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site

## Replace the personal photo

The supplied real photo is already at `assets/images/portrait.png`. To replace it visually, enter local editing mode, click the photo, choose **替换图片**, and export the page. Alternatively replace that asset with a PNG using the same filename.

The original is preserved. The frame applies a CSS-only zoom/crop via `.portrait-media img`; set `transform: scale(1)` in the stylesheet to show a wider crop. Clicking the photo opens the full original. Three research figures and their full-size originals/PDFs are included in `assets/images/`.

## Edit the site

- Page text, affiliation, links, papers: `index.html`.
- Fonts, colors, spacing, mobile layout: `assets/style.css`.
- Photo fallback: `assets/site.js`.
- Public CV: `assets/documents/Lin-He-CV-public.pdf`.
- Original paper PDFs: `assets/papers/`.
- Publication metadata reference: `publications.json`. This is an editable reference copy; the page uses static HTML. When adding or editing a paper, update BOTH the HTML and JSON.
- Image attribution: `CREDITS.md`.
- Source reconciliation and remaining factual updates: `CONTENT-NOTES.md` (for the owner; not linked in navigation).

To preview with a local server (optional): run `python3 -m http.server 8000` in this folder, then visit http://localhost:8000. Double-clicking `index.html` also works.

## Content and privacy

The public CV preserves the supplied February 2026 document, with the private phone number permanently redacted and PDF metadata cleared. The original unredacted CV is not included. Education and publication history in that snapshot are not silently rewritten. The site publication list uses the supplied 2026 preprint v2 title and separates it from the five journal papers. No current citation count is claimed.

Before replacing the public CV, remove private phone numbers from the replacement PDF itself, including text, links, annotations, and metadata. A white rectangle placed over text is not a permanent redaction.

No analytics, trackers, cookies, third-party scripts, or remote fonts are included. External sites are contacted only when a visitor follows their links. The ZIP does not publish anything automatically.

## Current compact edition

Research figures are displayed around 300 px wide with a blank explanation area alongside each. In local editing mode, click **编辑页面** and then **点击这里添加研究说明** beside an image to fill that space; the placeholder is absent on the public page. Image captions have been removed. Full-size image/PDF links are still available by clicking the figure. About has four compact, separated topic bands.

Publications now follow the seven works in the public ORCID record checked on 26 October 2026. The CGM paper has a journal DOI and citation; its local PDF is explicitly the prior preprint v2. The newly added MACER work has a journal link and no local PDF, because none was supplied. Six supplied PDFs remain in the assets folder.

## Current typography and research text

Body text uses the locally bundled Inter variable font, with system sans-serif fallbacks. Georgia headings remain. The screenshot supplied by the author has a similar modern sans-serif appearance; its exact family cannot be established from the image alone. Body and auxiliary text now use dark ink tones. Both Contact email addresses use the same class, size and weight. Three English research explanations are filled in beside their figures and remain editable.

Inter is distributed under the SIL Open Font License. See assets/fonts/Inter-LICENSE.txt. The font file was obtained from the font author’s official server: https://rsms.me/inter/font-files/InterVariable.woff2 . No external font request is needed by visitors.

## Readability and publication ordering

This edition imports the author's latest `index (1).html`, preserving its current introduction and research explanations. Body text is slightly larger, the personal introduction is consistently 16 px (15.5 px on mobile), and accumulated nested font-size overrides in the two introductory paragraphs are removed. Heading Georgia / body Inter remains. Publication totals and author filters are removed entirely. Articles are ordered by year descending, then Lin He's author-list position ascending within a year, then date descending for equal author position. The same order and author position metadata are recorded in publications.json.
