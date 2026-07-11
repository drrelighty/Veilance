# CLAUDE.md

## Project context

This repository is the GitHub source for the Veilance Press static site export. The deployed site lives in `public/` and is pushed to Neocities via GitHub Actions from the `main` branch.

- GitHub repository: `drrelighty/Veilance`
- Deploy target: `veilance.neocities.org`
- Deployment workflow: `.github/workflows/deploy.yml`
- One-off sync workflow: `.github/workflows/sync-from-neocities.yml` should not be used again unless explicitly required

## Repository layout

- `public/` — source of truth for the deployed site content
- `public/assets/` — project-owned custom CSS/JS and images
- `public/assets.squarespace.com/` and `public/static1.squarespace.com/` — vendored third-party assets; avoid editing unless there is no alternative
- `README.md` — minimal repo overview

## Deployment and asset rules

- `public/assets/site-canvas-bg.css` and `public/assets/site-canvas-bg.js` are shared global resources.
- Most global visual effects are centralized there, including header gradients, footer handling, p5 canvas behavior, and nav centering fixes.
- Any change to those two files must keep the versioned cache-busting query string in sync, for example `?v=<timestamp>`, or generate a fresh timestamp when linking them.
- If the browser appears to ignore a shared CSS/JS change, assume cache invalidation is the first problem to check.

## Page-specific knowledge

- `index.html` is the homepage with a black background and a full-page p5 canvas (`#codex-page-canvas-wrap`). The hero video is inset with whitespace, and the white title graphic should stay within the video height area.
- Other pages such as `about.html`, `annual-issues.html`, `archived-1.html`, `cart.html`, `credits.html`, `home-1.html`, `upcoming-1.html`, and `veilance-books.html` use a white header background with a solid gradient (`#header { background: linear-gradient(white → white → light gray) }`) and should not have canvas/header animation applied.
- The footer on most pages uses Squarespace's native pink/dark gradient style; the logo image is whitened by CSS filter in the shared CSS.
- `veilance-books.html` is special: the hero area is a black section with an inserted p5 canvas (`#codex-books-canvas-wrap`) and a `.codex-unify-bg` overlay that joins several separate black text blocks into one unified background. If black-on-black or canvas-coverage issues appear on this page, debug this file first.
- The `Upcoming` / events area includes the “After the Flood” content, with a two-column poster-and-copy layout in white/black.

## Repeated pitfalls to avoid

1. Squarespace injects a global `h3 { white-space: nowrap !important }` rule. This can make custom headings wrap incorrectly or be split by animation scripts. If a title is wrapping or being split word-by-word, check for this and add a more specific override such as `white-space: normal !important` with animation/transform disabled.
2. CSS `:has()` nested syntax is fragile. A selector like `:has(:not(:has()))` can be treated as invalid and silently ignored by the browser. When working with complex selectors, verify matching in a browser inspector or Playwright DOM query before assuming the rule is active.
3. Shared CSS/JS changes may not be visible because of cached assets. Always consider cache-busting, especially when introducing new resources or changing existing ones.
4. When changing `grid-area` behavior, confirm the inserted div is a direct child of the actual CSS Grid container. Squarespace often wraps content in extra layers, and placing the element in the wrong wrapper will make the grid-area rule appear ineffective.
5. Prefer Playwright-based DOM/computed-style verification over guessing from source alone. This repo has already shown that visual behavior can differ from the source CSS expectation.

## Known follow-up items

- Header white gradient, footer black background, and centered “Get in Contact” placement are already deployed and should be refreshed with a hard reload to confirm the live result.
- The `title.png` placement/size may still need a small visual adjustment.
- When black backgrounds appear to leak or canvas coverage is incomplete, the root cause is usually either: (a) the canvas wrapper is inserted into the wrong nesting level, or (b) the wrong wrapper element is being targeted for the background color instead of the actual block container.

## Working workflow

- Make small, targeted changes only.
- Keep the exported-site structure and naming conventions intact.
- Treat `public/` as the source of truth for deployment.
- Avoid modifying vendor files unless the task clearly requires it.
- Verify changes with a local static server or browser preview and, where visual behavior is uncertain, use Playwright to confirm the rendered DOM and computed styles.

## Verification checklist

1. Open the relevant page in a browser or a simple local server.
2. Confirm the change is visible in the requested page or asset.
3. If the page is behaving unexpectedly, check cache-busting, selector validity, and DOM layering before assuming the fix failed.
4. After a change is ready, use a normal Git workflow:
   `git add -A && git commit -m "..." && git push`
5. Wait for the GitHub Actions deployment to complete and verify the live Neocities result.

## Operational note

The GitHub PAT previously used for write access should be revoked and regenerated as soon as possible. The current deployment workflow relies on a repository secret for Neocities access, and the older token should not remain active longer than necessary.
