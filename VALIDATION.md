# Delivery validation

- Local HTTP preview and all requested HTML/CSS/JS/image requests: HTTP 200.
- Internal anchors, relative links, image paths, PDF paths and document links: passed.
- Six publications, four first-author works, five DOI strings: checked against supplied PDFs.
- Six local paper copies: checksums match the supplied originals.
- Publication filter logic (all / first author / co-author) and JavaScript syntax: passed.
- Public CV: permanent redaction, extracted text, annotations and metadata checked; all three pages visually reviewed.
- Portrait: no person invented; typographic placeholder with replacement instructions.
- Browser visual QA and mobile viewport testing: incomplete because the preview transport failed and desktop control permissions were unavailable. Responsive CSS is included, but no successful browser screenshot is claimed.
- GitHub deployment: not performed; complete deployable source provided.

Purple revision: local links, exact publication data, publication filtering, paper checksums and phone redaction were checked again after the layout and styling changes. Browser visual QA remains unavailable.

Inline local editor: verified with a DOM-based functional test covering text edits, link-address changes, cancellation, restarting, HTML export with escaped text and preserved emphasis, retaining every paper when filtered, removing transient editor markup, and absence of the editor on hosted URLs. Browser visual QA remains unavailable.

Editor update: reproduced the download failure in code (editing capture handler canceled the temporary anchor). Regression test now asserts the download click is not prevented. DOM-based functional checks cover whole-field and selected-text font size/weight, image replacement/insertion/deletion, embedded images and styles in exported HTML, clean editor markup removal, full publication retention, cancellation with filters still functional, native save success/cancel, copy-source fallback and editor absence on hosted origins. Full browser visual and native file-picker verification remains unavailable.

Author HTML / image update: verified exact retention of the supplied nonempty biography, research headings/descriptions, publication titles/authors and education labels; three research images in the correct slots; real photo in the hero; every local reference; unchanged checksums for photo and CGM PNG; valid rendered PNG files; clean export retaining the new images and download click behavior. A new browser attempt to preview the local file was blocked by the browser's file-URL security policy, so no workaround was attempted and no screenshot-based webpage QA is claimed.

Compact / ORCID revision: checked all seven exact ORCID titles and DOI links, 4/3 author filter counts, authoritative Crossref volume/article numbers for both 2026 records, explicit local CGM preprint labelling and no invented MACER PDF. Verified three caption-free compact figure/note rows, four About topic sections, empty-note editing and clean export with all seven papers, filter behavior and local asset references. Browser screenshot verification remains unavailable under the previously reported local-file policy restriction.

Typography / explanation refinement: checked the complete WOFF2 header and declared file length; local font dependency; dark text variables; both Contact email addresses and matching classes; three filled research notes; continued presence of seven publications and four About sections; clean editable-page export preserving the new text and email structure. Browser screenshot verification remains unavailable.

Readability / sorting update: verified the author's newest introduction and research explanations exactly retain their text; cleared introductory nested font-size overrides; confirmed totals and filters absent in both page and exported HTML; validated seven-paper order against year/author-rank/date keys; checked clean editor export. No new browser screenshot verification is claimed.
