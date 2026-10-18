# PRD: Product Requirements Document

**Project:** Personalized open-source issue recommendation platform (GDG probation project)
**Scope of this doc:** Frontend only
**Product name:** `PENDING TEAM CONFIRMATION` (designs use "Project" as a placeholder)

> **Status note:** Everything below describes the *planned* product. No feature is implemented yet. The recommendation pipeline (section 7) is the *intended architecture*, owned by the backend and ML teammates in separate repositories.

**How to read this doc**
- **Confirmed:** taken directly from the team brief, the UI screenshots, or the architecture flowchart.
- **`PENDING TEAM CONFIRMATION`:** not decided, or not shown in the designs. Do not build assumptions into code without agreeing on them first.

---

## 1. Overview

The platform uses GitHub data and ML-based matching to recommend open-source issues that fit a developer's preferred technologies, interests, and experience. The landing copy summarizes the promise: *"Four questions in, ten issues out."*

**Frontend stack:** React, Vite, JavaScript, ESLint, Git and GitHub.

## 2. Scope

### In scope (only what appears in the designs or flowchart)
1. Landing Page
2. GitHub Registration / Sign-in flow
3. Four-step onboarding
4. Recommendation / Home Page
5. Recommendation pipeline (only as it affects what the frontend sends and displays)

### Out of scope
Account settings, analytics dashboards, contribution tracking pages, a separate saved-issues page, separate "Features" or "About" pages, and any screen not in the provided designs or flowchart.

## 3. User Journey (from the flowchart)

1. User opens the **Landing Page**.
2. User chooses **Register / Sign in with GitHub**.
3. User completes **GitHub OAuth authorization**.
4. The app branches on **"New user?"**
   - **Yes (new user):** the **four-question onboarding** runs. The backend stores the preferences. The recommendation pipeline runs and the Home Page shows results.
   - **No (returning user):** the backend loads the existing profile and preferences. The pipeline runs and the Home Page shows results.
5. On the **Home Page** the user reviews the top 10 issues, adjusts filters, opens issues on GitHub, and saves issues.

`PENDING TEAM CONFIRMATION`: how the app learns whether the user is new or returning (backend decision; see HANDOFF.md).

---

## 4. Functional Requirements

### 4.1 Landing Page

| ID | Requirement | Status |
|----|-------------|--------|
| LP-1 | **Navigation bar** with the wordmark ("Project", placeholder), text links **How it works**, **Features**, **About**, an orange outlined **Open my feed** button, and a black filled **Sign in** button. | Confirmed (design) |
| LP-2 | **Hero section:** small uppercase monospace eyebrow line ("Project • Open-source matchmaker • Built for your stack"); oversized headline **"Find issues tuned to your exact stack."** with "exact stack." on a tilted orange highlight; a circular yellow badge ("Ship your first PR") with circular text ("No guesswork • One issue at a time"). | Confirmed (design) |
| LP-3 | **Product introduction** text: "Open-source issues tuned to your exact stack and experience. Four questions in, ten issues out." | Confirmed (design) |
| LP-4 | **How-it-works call to action:** link **"How the matching works →"** (green underline in design). | Confirmed (design) |
| LP-5 | **GitHub sign-in call to action:** large orange button with GitHub icon, labeled "Continue with Github" in the design. | Confirmed (design) |
| LP-6 | Behavior of the **How it works** nav link and the **How the matching works** link (scroll to a section, open a modal, or other). No target is shown in the designs. | `PENDING TEAM CONFIRMATION` |
| LP-7 | Destination of **Features** and **About** nav links. No such pages or sections exist in the designs, so they must not be built until confirmed. | `PENDING TEAM CONFIRMATION` |
| LP-8 | Behavior of **Open my feed** (for example, go to Home if signed in, otherwise start sign-in). | `PENDING TEAM CONFIRMATION` |
| LP-9 | Whether the **Sign in** nav button uses the same GitHub flow as LP-5. | `PENDING TEAM CONFIRMATION` |
| LP-10 | Final wording of copy and button label once the product name is chosen. Recommend "GitHub" capitalization. | `PENDING TEAM CONFIRMATION` |

### 4.2 GitHub Registration / Sign-in Flow

| ID | Requirement | Status |
|----|-------------|--------|
| AU-1 | The UI provides an entry point that starts GitHub sign-in (LP-5, and possibly LP-9). | Confirmed |
| AU-2 | After GitHub OAuth authorization, a **New user?** decision routes **new users to onboarding** and **returning users to the Home Page** (backend loads their existing profile and preferences). | Confirmed (flowchart) |
| AU-3 | The frontend documentation does **not** define the authentication implementation (redirect handling, tokens, sessions, storage). | Confirmed (by design of this doc) |
| AU-4 | Authentication implementation and how the frontend learns the new/returning result. | `PENDING TEAM CONFIRMATION` |
| AU-5 | UI for OAuth failure or cancelled authorization, and for sign-out. Not shown in the designs. | `PENDING TEAM CONFIRMATION` |

### 4.3 Four-Step Onboarding

**Layout (all steps):** a cream card centered on a full-screen yellow background, with a black outline and rounded corners. At the top is a **progress indicator** of four segmented bars (filled orange up to the current step), followed by a monospace label "Question N of 4", a large bold heading, the step content, and **Back** (outlined) and **Continue →** (orange) buttons. On step 4 the primary button reads **"Generate feed →"**.

| Step | Heading | Content shown in the design |
|------|---------|-----------------------------|
| 1. Introduction | "Tell us about you" | **Short bio (optional)**: textarea with placeholder "write something about yourself here.....". **Main goal**: pill options **Build my portfolio**, **Find niche projects**, **First PR**. |
| 2. Preferred tech stack | "Your tech stack" | Pill options **C++, Python, JS, Rust, React, TypeScript, Java**, plus an **Other** field with placeholder "Select your languages....". The preferred programming language is chosen in this step. |
| 3. Interests | "What you're into" | Pill options **Backend, AI/ML, DevOps, App Dev, Frontend, Web3**, plus an **Other** field with placeholder "Select your Interest....". |
| 4. Preferred difficulty | "How hard?" | Three large option cards: **Beginner** ("Good first issue"), **Intermediate** ("Some project context needed"), **Expert** ("Advanced, deep changes"). |

| ID | Requirement | Status |
|----|-------------|--------|
| OB-1 | Four steps in the order above, with the progress indicator and "Question N of 4" label. | Confirmed |
| OB-2 | **Back** and **Continue** navigation on every step (final step: **Generate feed**). | Confirmed |
| OB-3 | Values entered on a step are preserved when the user goes Back and forward again. | Proposed (good practice) |
| OB-4 | Step 2 allows selecting multiple technologies and identifying one **preferred programming language**. **How the preferred language is marked is unclear**: the design shows most selected pills in orange but "Python" in yellow (and "AI/ML" in step 3). Possibly yellow means "primary". | `PENDING TEAM CONFIRMATION` |
| OB-5 | Which fields are required (bio is optional per the design) and whether Main goal and Interests are single- or multi-select. | `PENDING TEAM CONFIRMATION` |
| OB-6 | Whether the option lists (goals, technologies, interests) are fixed in the frontend or provided by the backend. | `PENDING TEAM CONFIRMATION` |
| OB-7 | Format and handling of the free-text **Other** fields (comma-separated, chips, validation). | `PENDING TEAM CONFIRMATION` |
| OB-8 | Behavior of **Back** on step 1 (shown in the design). | `PENDING TEAM CONFIRMATION` |
| OB-9 | On **Generate feed**, the frontend sends the preferences to the backend (the flowchart shows "Backend stores preferences") and then shows the Home Page. Loading and error UI while the feed is generated is not designed. | `PENDING TEAM CONFIRMATION` |

### 4.4 Recommendation / Home Page

**Layout (from the design):** a navbar and a developer profile summary across the top, a left sidebar with filters, and a main column with the heading **"Top 10 for you"** ("for you" on a tilted orange highlight) followed by issue cards.

| ID | Requirement | Status |
|----|-------------|--------|
| HP-1 | **Navbar** with wordmark; a **profile summary** reading "Your profile" and "Estimated level:" with a yellow badge (design example: "Intermediate"). | Confirmed (design) |
| HP-2 | **Search tags** row: outlined pill tags with a "#" prefix (design examples: `#random`, `#csharp`, `#medium`; likely placeholder values). Includes the preferred language and other tags. | Confirmed (design); content from real data |
| HP-3 | **Saved (N)** button in the navbar (black, bookmark icon) showing the saved count; design example "Saved (0)". | Confirmed (design) |
| HP-4 | **Top 10 recommended issues** displayed as cards, never more than 10. | Confirmed |
| HP-5 | Each **issue card** shows: repository name (e.g. `reactjs/react.dev`), issue title, issue number (e.g. `#6120`), language/technology tags, difficulty badge (design example: "medium"), and **match percentage** (e.g. "88% match"). | Confirmed |
| HP-6 | A **short explanation** appears on the card (e.g. "Good first issue with a clear fix and active maintainers") **only when the data provides one**. If absent, the card hides it without breaking layout. | Confirmed |
| HP-7 | **Open issue** action (orange button, external-link icon). | Confirmed |
| HP-8 | **Save issue** action (outlined button, bookmark icon) that updates the **saved count** in HP-3. | Confirmed |
| HP-9 | **Language filter** in a sidebar box titled **"Language priority"**: pills (design: C++, JS, Rust, Python, Go) with the selected pill in orange. | Confirmed (design) |
| HP-10 | **Difficulty filter** in a sidebar box titled **"Difficulty"**: checkboxes **Easy, Medium, Hard**, with the helper text "None checked shows every issue in model rank order." | Confirmed (design) |
| HP-11 | Match percentages, explanations, tags, and difficulty values come from **real recommendation data**. Nothing is hardcoded or invented in production. | Confirmed |
| HP-12 | A **repository star count** (e.g. "11k") appears next to the repo name in the design. Keep it only if the backend supplies it. | `PENDING TEAM CONFIRMATION` |
| HP-13 | **Difficulty vocabularies differ** across screens: onboarding uses Beginner / Intermediate / Expert; the filter uses Easy / Medium / Hard; cards show "medium"; the profile shows "Intermediate". Mapping between them, and which labels the UI shows. | `PENDING TEAM CONFIRMATION` |
| HP-14 | Where the language options in the sidebar come from (user's onboarding/repo languages, or a fixed list) and how many are shown. | `PENDING TEAM CONFIRMATION` |
| HP-15 | What clicking **Saved (N)** does. There is **no saved-issues page** in scope. Also whether saved issues persist across sessions. | `PENDING TEAM CONFIRMATION` |
| HP-16 | Whether **Open issue** opens in a new tab (recommended) and any other behavior. | `PENDING TEAM CONFIRMATION` |
| HP-17 | Loading, empty (fewer than 10 results), and error states for the recommendation list. Not in the designs. | `PENDING TEAM CONFIRMATION` |

---

## 5. Recommendation Behavior

**Confirmed**
- The **preferred programming language** selected in onboarding gets **top priority** in the default ranking.
- **Other languages** are prioritized by how frequently they appear across the user's repositories.
- **Language filter:** prioritizes repositories in the selected language, ordered by the user's usage frequency.
- **Difficulty filter:** places issues of the selected difficulty **first**, with other recommendations **below** them. It does not strictly hide other issues unless the team later confirms strict filtering. With nothing checked, all issues appear in model rank order.
- Other signals that may be used: interests, issue labels, experience, and repository activity.
- Match percentages and explanations must be based on actual recommendation data.

**`PENDING TEAM CONFIRMATION`**
- Strict vs. non-strict difficulty filtering (non-strict is the default until confirmed).
- Whether filtering and re-ordering happen on the backend/ML side (new request) or in the frontend over the 10 returned issues. This matters because only 10 issues are returned.
- Whether multiple difficulty checkboxes can be active at once, and how that affects ordering.
- Whether the language filter can be cleared or deselected.

## 6. Visual Requirements

Follow the screenshots closely.
- Warm cream/off-white page backgrounds. The onboarding screens use a full-screen **yellow** background with a cream card.
- Black text and black outlines.
- **Orange** for primary accents (primary buttons, selected pills, highlighted words).
- **Yellow** for highlights and badges (level badge, difficulty badge, circular hero badge).
- Bold, oversized editorial headlines; monospace for small labels ("Question 1 of 4", "Search tags", eyebrow text); clean sans-serif for body text. Exact font families: `PENDING TEAM CONFIRMATION` (confirm with the designer).
- Rounded outlined buttons and pill-shaped tags; minimalist, high-contrast cards with generous spacing; tilted orange highlight blocks behind key headline words.
- A small green underline accent appears on "How the matching works" in the design.
- Responsive for desktop and mobile. **Only desktop mockups were provided.** Mobile layouts (stacking of the sidebar filters, navbar, cards) are `PENDING TEAM CONFIRMATION`.

## 7. Recommendation Pipeline (intended architecture, NOT implemented)

Taken from the flowchart. The frontend's responsibility is limited to the first and last parts of this flow.

1. Landing Page, then Register / Sign in with GitHub, then GitHub OAuth authorization. *(Frontend entry point; OAuth details are pending.)*
2. **New user?** Yes: onboarding with 4 questions (Introduction, Preferred Tech Stack, Interests, Preferred Difficulty), then the backend stores preferences. No: the backend loads the existing profile and preferences.
3. Backend fetches GitHub data: profile and repository metadata, and contribution history.
4. Experience level is estimated from contribution history.
5. The backend prepares **Model 1 input** (the flowchart says "10 fields"; the fields are not defined here).
6. **ML Model 1** generates search tags; a **maximum of 7 tags** is returned.
7. The backend builds GitHub search queries and calls the GitHub Search API.
8. Candidate open issues are collected. **Pull requests are filtered out**, and issues are validated and deduplicated.
9. **ML Model 2** analyzes and ranks issues.
10. The **top 10** are returned; the backend returns recommendations.
11. **The frontend displays the recommendations.**

## 8. Acceptance Criteria

**Landing Page**
- [ ] Navbar shows wordmark, How it works, Features, About, Open my feed, and Sign in, matching the design.
- [ ] Hero shows the headline with the orange highlight, the yellow circular badge, the intro text, the "How the matching works" link, and the GitHub CTA.
- [ ] The GitHub CTA starts the sign-in flow.
- [ ] No pages are created for Features or About until confirmed.

**Sign-in flow**
- [ ] New users are routed to onboarding; returning users are routed to the Home Page (once the backend supports it).
- [ ] The frontend contains no invented authentication logic.

**Onboarding**
- [ ] Four steps appear in the specified order with the correct headings and options.
- [ ] The progress indicator and "Question N of 4" reflect the current step.
- [ ] Back and Continue work on every step; the last step's button reads "Generate feed".
- [ ] The bio is optional; required fields are validated per the confirmed rules.
- [ ] Selected values persist when navigating Back.
- [ ] Preferred language, interests, goal, difficulty, and bio (if provided) are included in what is submitted.

**Home Page**
- [ ] Profile summary (estimated level), search tags, and the saved count are displayed.
- [ ] No more than 10 issue cards are shown, each with repo name, title, issue number, tags, difficulty, and match percentage.
- [ ] The explanation shows only when data exists; a missing explanation does not break the card.
- [ ] Match percentages and explanations come only from backend data.
- [ ] The language filter and difficulty filter behave as described in section 5.
- [ ] Open issue opens the GitHub issue.
- [ ] Save issue updates the saved count.
- [ ] Loading, empty, and error states exist (once designed).

**General**
- [ ] Layout is usable on desktop and mobile widths with no horizontal scrolling.
- [ ] Visuals match the screenshots (colors, typography, pills, outlines, spacing).
- [ ] No pages or features outside section 2 exist.

## 9. Unresolved Decisions Summary

| # | Decision | Status |
|---|----------|--------|
| 1 | Product name and final copy | `PENDING TEAM CONFIRMATION` |
| 2 | Targets of How it works, Features, About, Open my feed, Sign in | `PENDING TEAM CONFIRMATION` |
| 3 | Authentication implementation and new/returning detection | `PENDING TEAM CONFIRMATION` |
| 4 | How the preferred language is marked in onboarding (yellow vs. orange pills) | `PENDING TEAM CONFIRMATION` |
| 5 | Required fields, single vs. multi-select, option lists, "Other" input format | `PENDING TEAM CONFIRMATION` |
| 6 | Difficulty label mapping (Beginner/Intermediate/Expert vs. Easy/Medium/Hard) | `PENDING TEAM CONFIRMATION` |
| 7 | Strict vs. non-strict difficulty filtering; where filtering runs | `PENDING TEAM CONFIRMATION` |
| 8 | Saved issues: persistence and what the Saved button does | `PENDING TEAM CONFIRMATION` |
| 9 | Star count display and other card data availability | `PENDING TEAM CONFIRMATION` |
| 10 | Loading, empty, and error state designs | `PENDING TEAM CONFIRMATION` |
| 11 | Mobile layouts and exact fonts | `PENDING TEAM CONFIRMATION` |
