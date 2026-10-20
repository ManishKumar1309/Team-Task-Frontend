# TECH_STACK: Frontend Tech Stack

> **Status:** Proposal. This document describes the *planned* setup and structure. It does not claim that any file, folder, or feature already exists. Create folders and files only when you actually need them.

Backend and ML are developed in **separate repositories** by other teammates and are out of scope here.

---

## 1. Confirmed Stack

| Area | Choice |
|------|--------|
| UI library | React |
| Build tool / dev server | Vite |
| Language | JavaScript (no TypeScript) |
| Linting | ESLint |
| Version control | Git + GitHub |

## 2. Choices Still Open

Add a dependency only when a screen genuinely needs it and both teammates agree. Suggested defaults are listed to save discussion time.

| Topic | Suggested default | Status |
|-------|-------------------|--------|
| Routing | `react-router-dom` (needed for Landing, Onboarding, Home, and an auth callback if required) | `PENDING TEAM CONFIRMATION` |
| Styling | Plain CSS or CSS Modules, plus CSS variables for design tokens (no UI kit; the design is custom) | `PENDING TEAM CONFIRMATION` |
| Data fetching | Built-in `fetch` wrapped in `services/` | `PENDING TEAM CONFIRMATION` |
| Shared state | React state first; Context only if props get deeply nested (likely for saved issues and preferences) | `PENDING TEAM CONFIRMATION` |
| Formatter | Prettier (optional) | `PENDING TEAM CONFIRMATION` |
| Fonts | Self-host or load from a font provider; families to match the design | `PENDING TEAM CONFIRMATION` |
| Icons | Inline SVG files in `assets/` (GitHub, bookmark, external link, star, arrow) | `PENDING TEAM CONFIRMATION` |
| Deployment | Not decided | `PENDING TEAM CONFIRMATION` |

Avoid state-management libraries, animation libraries, and component kits unless clearly justified.

## 3. Proposed Folder Structure

Based on the screens in the designs: Landing, Onboarding (4 steps), and Home.

```
src/
├── assets/                  # logo, GitHub/bookmark/arrow/star icons, fonts if self-hosted
├── components/
│   ├── common/              # reusable UI building blocks
│   │   ├── Button.jsx           (primary orange, outlined, black variants)
│   │   ├── Pill.jsx             (selectable/pill tag, also static tag)
│   │   ├── Badge.jsx            (yellow level/difficulty badge, match badge)
│   │   ├── HighlightText.jsx    (tilted orange highlight behind a headline word)
│   │   ├── TextArea.jsx / TextInput.jsx
│   │   └── Checkbox.jsx
│   ├── landing/
│   │   ├── Hero.jsx
│   │   └── CircularBadge.jsx
│   ├── onboarding/
│   │   ├── OnboardingCard.jsx     (card shell, progress, Back/Continue)
│   │   ├── ProgressSegments.jsx
│   │   ├── StepIntroduction.jsx
│   │   ├── StepTechStack.jsx
│   │   ├── StepInterests.jsx
│   │   ├── StepDifficulty.jsx
│   │   └── DifficultyOptionCard.jsx
│   └── recommendations/
│       ├── ProfileSummary.jsx     (estimated level)
│       ├── SearchTags.jsx
│       ├── SavedButton.jsx        (saved count)
│       ├── LanguageFilter.jsx
│       ├── DifficultyFilter.jsx
│       ├── IssueCard.jsx
│       └── IssueList.jsx
├── layouts/
│   ├── MainLayout.jsx           # navbar + page container (Landing, Home)
│   ├── Navbar.jsx               # landing and home variants
│   └── OnboardingLayout.jsx     # full-screen yellow background, centered card
├── pages/
│   ├── LandingPage.jsx
│   ├── OnboardingPage.jsx
│   ├── HomePage.jsx
│   └── (auth callback page, only if the OAuth approach needs one)   # PENDING TEAM CONFIRMATION
├── hooks/
│   ├── useOnboarding.js         # step state and collected answers
│   ├── useRecommendations.js    # load / error / empty states, filters
│   └── useSavedIssues.js        # saved list and count (persistence pending)
├── services/
│   ├── apiClient.js             # shared fetch wrapper, base URL from env
│   ├── authService.js           # shapes defined after backend agreement
│   ├── onboardingService.js
│   └── recommendationService.js
├── styles/
│   ├── tokens.css               # colors, fonts, radius, spacing, breakpoints
│   └── global.css               # reset and base styles
├── App.jsx                      # routes
└── main.jsx
```

Notes:
- The `services/` files only wrap calls; their contents depend on the contracts in `HANDOFF.md`. Do not write endpoint paths or response shapes until agreed.
- **No** pages for settings, analytics, contribution tracking, or saved issues.
- An optional `src/mocks/` folder may hold **clearly labeled temporary** sample data while the backend is not ready. Delete it, or stop importing it, once real data is available. Mock values must never appear as if they were real recommendations.
- Feel free to merge files if a component is tiny, and to split further only if a file becomes hard to read.

## 4. Design Tokens (`styles/tokens.css`)

Define these as CSS variables. The color palette is **finalized** (see below). For the other groups, **sample exact values from the design files; do not guess.**

| Token group | From the design |
|-------------|-----------------|
| Colors | Approved Fimmit palette: cream `#F7F4EC` (main background), black `#000000` (text, outlines), orange `#EE8138` (primary actions), yellow `#F6D945` (highlights, selected/hover states), red `#E4452F` and green `#4BD08B` (feedback states). See the token proposal below. White inputs, yellow onboarding backdrop, and the green link underline seen in the designs: `PENDING TEAM CONFIRMATION` |
| Typography | Heavy, wide display face for headlines; clean sans-serif for body; monospace for labels and eyebrow text. Exact families: `PENDING TEAM CONFIRMATION` |
| Shape | Fully rounded pills and buttons; rounded cards; consistent 2px-style black outlines (confirm thickness) |
| Spacing | Generous, spacious layouts; define a small scale |
| Breakpoints | Mobile and desktop at minimum. Values: `PENDING TEAM CONFIRMATION` |

**Proposed color token names** (names are a proposal; hex values are approved):

```css
:root {
  --color-cream: #F7F4EC;
  --color-black: #000000;
  --color-orange: #EE8138;
  --color-yellow: #F6D945;
  --color-red: #E4452F;
  --color-green: #4BD08B;
}
```

Role aliases (for example, background = cream, primary action = orange, selected/hover = yellow, error = red, success = green) may be layered on top of these. Do not add colors outside this palette without team approval.

## 5. Environment Configuration

- Use Vite env variables (names start with `VITE_`) for **non-secret** configuration only, such as the backend base URL.
- Commit a `.env.example` listing variable **names only** (no real values). Keep real values in `.env.local`, which must be git-ignored.
- Variable names and values: `PENDING TEAM CONFIRMATION` (agree with backend; see `HANDOFF.md`).
- Anything prefixed with `VITE_` is bundled into the browser code and is public. See the secret-handling rules in `RULES.md`.

## 6. Standard Scripts

Use the scripts created by the Vite React template (typically `dev`, `build`, `lint`, and `preview`). Check `package.json` for the exact names once the project exists; this document does not assume them.

## 7. Brand Assets and Logo Animation

**Approved structure is unchanged.** Brand files go in the existing `src/assets/` folder. No new folders or files are added to the tree in section 3 by this update.

### 7.1 Intended asset locations (proposed filenames; extensions depend on the final files)

| Logo variant | Intended use | Proposed location and name |
|--------------|--------------|----------------------------|
| 1. Standalone magnifying glass | Not specified (`PENDING TEAM CONFIRMATION`) | `src/assets/fimmit-mark.*` |
| 2. Compact wordmark + magnifier | Navbar (`layouts/Navbar.jsx`) | `src/assets/fimmit-wordmark-compact.*` |
| 3. Large wordmark + oversized magnifier | Animated login-screen experience (placement `PENDING TEAM CONFIRMATION`; no separate login page exists in scope) | `src/assets/fimmit-wordmark-large.*` |

If variant 1 is used as a favicon, it would be referenced from the Vite project's HTML entry file or `public/` folder, which sit outside the documented `src/` tree: `PENDING TEAM CONFIRMATION`.

### 7.2 Current asset condition

The supplied files are raster PNGs: variant 1 is 83 x 72 px, variant 2 is 146 x 45 px, and variant 3 is 247 x 138 px. All three have an **opaque white background**, so they cannot sit cleanly on the cream background, and they will blur if displayed larger than their native size or on high-density screens. Request from the brand owner: **transparent-background and/or SVG versions** (or higher-resolution PNGs). Do not redraw, recolor, or stretch the artwork to work around this.

### 7.3 Animation approach (variant 3)

The animation implementation depends on the final asset format.
- **Flat PNG or a single SVG image:** only the whole logo can be animated (for example, fade, uniform scale, or slide) with **CSS transitions/keyframes**. No animation library is needed or proposed.
- **Layered SVG, or separate transparent files for the text and the magnifier:** the magnifier can be animated independently of the "Fimmit" text, still with CSS.
- **A pre-rendered animation (GIF, video, Lottie, and so on):** only if the brand owner supplies one. This could require a new dependency, which must be agreed before adding.
- Always scale uniformly (keep the aspect ratio), and respect `prefers-reduced-motion` by showing a static logo.
- What moves, duration, whether it loops, and when it plays: `PENDING TEAM CONFIRMATION`.
