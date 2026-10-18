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

Define these as CSS variables. **Sample exact values from the design files; do not guess.**

| Token group | From the design |
|-------------|-----------------|
| Colors | Cream/off-white background, black (text and outlines), orange (primary), yellow (highlights, badges, onboarding background), white (inputs), small green accent (link underline) |
| Typography | Heavy, wide display face for headlines; clean sans-serif for body; monospace for labels and eyebrow text. Exact families: `PENDING TEAM CONFIRMATION` |
| Shape | Fully rounded pills and buttons; rounded cards; consistent 2px-style black outlines (confirm thickness) |
| Spacing | Generous, spacious layouts; define a small scale |
| Breakpoints | Mobile and desktop at minimum. Values: `PENDING TEAM CONFIRMATION` |

## 5. Environment Configuration

- Use Vite env variables (names start with `VITE_`) for **non-secret** configuration only, such as the backend base URL.
- Commit a `.env.example` listing variable **names only** (no real values). Keep real values in `.env.local`, which must be git-ignored.
- Variable names and values: `PENDING TEAM CONFIRMATION` (agree with backend; see `HANDOFF.md`).
- Anything prefixed with `VITE_` is bundled into the browser code and is public. See the secret-handling rules in `RULES.md`.

## 6. Standard Scripts

Use the scripts created by the Vite React template (typically `dev`, `build`, `lint`, and `preview`). Check `package.json` for the exact names once the project exists; this document does not assume them.
