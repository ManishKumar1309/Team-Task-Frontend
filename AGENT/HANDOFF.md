# HANDOFF: Frontend ↔ Backend ↔ ML Integration

**Product name:** Fimmit (finalized branding recorded in section 7).

> **Status:** Draft for discussion between the frontend, backend, and ML teammates.
> This document lists **what the screens need** and **what must be agreed**. It deliberately contains **no endpoint URLs, request/response schemas, OAuth details, or ML input/output contracts**. Those must be defined together. Nothing here claims that any integration is implemented.

---

## 1. Who Does What (from the flowchart)

| Stage in the flow | Owner |
|-------------------|-------|
| Landing Page, sign-in entry point | Frontend |
| GitHub OAuth authorization | Frontend + Backend (`PENDING TEAM CONFIRMATION`: split of responsibilities) |
| "New user?" decision | Backend (`PENDING TEAM CONFIRMATION`: how it is communicated) |
| Onboarding UI (4 questions) | Frontend |
| Store preferences / load existing profile and preferences | Backend |
| Fetch GitHub data (profile, repository metadata, contribution history) | Backend |
| Estimate experience level | Backend (and/or ML; `PENDING TEAM CONFIRMATION`) |
| Prepare Model 1 input ("10 fields") | Backend / ML |
| ML Model 1: generate search tags (maximum 7) | ML |
| Build GitHub search queries and call GitHub Search API | Backend |
| Collect candidate open issues; filter pull requests; validate and deduplicate | Backend |
| ML Model 2: analyze and rank issues | ML |
| Return top 10 recommendations | Backend (from ML ranking) |
| **Display recommendations, filters, open/save actions** | **Frontend** |

The frontend should not depend on ML internals. It only needs the final data listed in section 3.

## 2. What the Frontend Sends

Only data the user actually enters in the designs:

| Data | Source screen | Notes |
|------|---------------|-------|
| Short bio (optional) | Onboarding step 1 | Free text. Max length: `PENDING TEAM CONFIRMATION` |
| Main goal | Onboarding step 1 | Design options: Build my portfolio, Find niche projects, First PR |
| Preferred technologies | Onboarding step 2 | Design options: C++, Python, JS, Rust, React, TypeScript, Java, plus free-text "Other" |
| **Preferred programming language** | Onboarding step 2 | Top priority in default ranking. How it is marked in the UI: `PENDING TEAM CONFIRMATION` |
| Interests | Onboarding step 3 | Design options: Backend, AI/ML, DevOps, App Dev, Frontend, Web3, plus free-text "Other" |
| Preferred difficulty | Onboarding step 4 | Design options: Beginner, Intermediate, Expert |
| Language filter selection | Home Page | Only if filtering is done by the backend (`PENDING TEAM CONFIRMATION`) |
| Difficulty filter selection | Home Page | Only if filtering is done by the backend (`PENDING TEAM CONFIRMATION`) |
| Saved issue actions | Home Page | Only if saves are stored by the backend (`PENDING TEAM CONFIRMATION`) |

Important: the flowchart says Model 1 takes **10 fields**, but they are not defined in the project documents. The frontend must **not** assume that it has to collect more than the four onboarding questions. See question M-1.

## 3. What the Screens Need Back

### 3.1 Sign-in and routing
| Data needed | Used for | Status |
|-------------|----------|--------|
| Result of sign-in (success or failure) | Redirect and error display | `PENDING TEAM CONFIRMATION` |
| New user vs. returning user | Route to onboarding or Home | `PENDING TEAM CONFIRMATION` |
| Minimal signed-in identity (for example, to show in the profile summary) | Navbar / profile summary | `PENDING TEAM CONFIRMATION` (the design shows only "Your profile" and estimated level, no name or avatar) |

### 3.2 Home Page: profile summary and search tags
| Data needed | Used for |
|-------------|----------|
| Estimated experience level | "Estimated level" badge (design example: Intermediate) |
| Search tags (up to 7 from Model 1, including the preferred language) | Search tags row (`#tag` pills) |
| Language options for the "Language priority" filter | Sidebar language pills (design example: C++, JS, Rust, Python, Go) |
| Saved issue count | "Saved (N)" button |

### 3.3 Home Page: each issue card (up to 10)
| Field | Needed | Notes |
|-------|--------|-------|
| Issue identifier (stable and unique) | Yes | For list keys, save actions, and deduplication |
| Repository name | Yes | Design example: `reactjs/react.dev` |
| Issue title | Yes | |
| Issue number | Yes | Design example: `#6120` |
| Link to the issue on GitHub | Yes | For "Open issue" |
| Language / technology tags | Yes | Design example: JS, react, docs |
| Difficulty | Yes | Label vocabulary: `PENDING TEAM CONFIRMATION` (see Q-D1) |
| Match percentage | Yes | Must come from real ranking data. Never invented in the frontend |
| Short explanation | Optional | Shown only if provided. The card must work without it |
| Primary language of the repository | Needed for language filtering | `PENDING TEAM CONFIRMATION` |
| Repository star count | Optional | Appears in the design ("11k"); show only if supplied |
| Whether the user has saved the issue | If saves are persisted | `PENDING TEAM CONFIRMATION` |

### 3.4 States the frontend must handle
| State | Needed from backend | Status |
|-------|---------------------|--------|
| Loading (feed generation after "Generate feed" and on Home load) | Whether it is synchronous, or whether the frontend must poll or wait | `PENDING TEAM CONFIRMATION` |
| Empty / fewer than 10 results | How this is communicated | `PENDING TEAM CONFIRMATION` |
| Errors (auth, GitHub failure, rate limit, ML failure, network) | Error categories the UI should distinguish | `PENDING TEAM CONFIRMATION` |

## 4. Questions to Resolve Together

Mark each with an owner and a decision. Record the answer here (or in a shared contract file) so both sides use the same source of truth.

### Authentication and routing
- **A-1.** Who starts the GitHub OAuth redirect, the frontend or the backend, and where does the user land afterward?
- **A-2.** How does the frontend know the user is signed in (session cookie, token, or something else)? How is it kept across page reloads?
- **A-3.** How does the frontend learn "new user" vs. "returning user"? Is a returning user who never finished onboarding treated as new?
- **A-4.** What should the UI show if the user cancels or denies GitHub authorization?
- **A-5.** Is there a sign-out, and where does it live? (None is shown in the designs.)
- **A-6.** Which GitHub permissions (scopes) are requested, and does the landing page need to explain them?

### Onboarding data
- **O-1.** Which onboarding fields are required, and what are the limits (bio length, number of selections)?
- **O-2.** Are the option lists (goals, technologies, interests) fixed in the frontend or provided by the backend?
- **O-3.** How is the **preferred programming language** identified among the selected technologies? (The design shows Python in yellow while other selections are orange.) Same question for interests (AI/ML in yellow).
- **O-4.** How should free-text **Other** entries be handled (format, validation, normalization against known names)?
- **O-5.** Are preferences sent once at the end or step-by-step? Can a returning user edit them later? (No such screen exists in scope.)
- **O-6.** What happens after **Generate feed**: does the pipeline run immediately, and how long can it take?

### Recommendation response
- **R-1.** Which fields (section 3.3) will each recommendation contain, and what are their exact names, types, and allowed values?
- **R-2.** Is **match percentage** a number from ML or derived by the backend? What range and rounding?
- **R-3.** Where does the **short explanation** come from, and is it always present, sometimes present, or removed?
- **R-4.** How are tags represented, and how many can appear per issue?
- **R-5.** Is the star count available?
- **R-6.** Are results cached, and how fresh are they? Can the user refresh the feed? (No refresh control is shown in the designs.)

### Filtering and ranking
- **F-1.** Does the language filter run **in the frontend** (re-ordering the 10 issues) or does it request a new ranking from the backend/ML? The behavior is: preferred language first, then other languages by the user's repository language frequency.
- **F-2.** Same question for the difficulty filter. Default behavior is "selected difficulty first, others below" (non-strict). Has strict filtering been confirmed?
- **F-3.** If several difficulty boxes are checked, how are they ordered?
- **D-1 / Q-D1.** Difficulty vocabulary: onboarding (Beginner / Intermediate / Expert), filter (Easy / Medium / Hard), card badge ("medium"), and profile ("Intermediate"). What is the canonical set, and who maps between them?
- **F-4.** Where do the language filter options come from (user's repository languages, onboarding choices, or a fixed list)?
- **F-5.** Because only 10 issues are returned, what should the UI do if a filter leaves nothing relevant to promote?

### Saved issues
- **S-1.** Are saved issues stored in the backend or only on the device? Do they need to survive logout and reload?
- **S-2.** What does the **Saved (N)** button do when clicked? (No saved-issues page is in scope.)
- **S-3.** Can a saved issue be un-saved from the card?

### ML coordination
- **M-1.** The flowchart mentions **10 Model 1 input fields**. Are all of them derived by the backend from GitHub data and onboarding answers, or must the frontend collect anything additional?
- **M-2.** If Model 1 returns fewer than 7 tags (or none), what does the Search tags row show?
- **M-3.** Should the preferred language always appear in the search tags row?
- **M-4.** Will the experience level be delivered as a label that matches the UI's wording?

### Environment and operations
- **E-1.** Backend base URL for local development and for deployment (names go in `.env.example`; values are shared privately).
- **E-2.** Is CORS configured for the frontend's origin(s)?
- **E-3.** Is there a shared mock or staging backend the frontend can use before the real one is ready?
- **E-4.** How are GitHub API rate limits handled, and what message should the user see if a limit is hit?
- **E-5.** Where does the agreed contract live (for example, a shared document or a section in this file), and who updates it?

## 5. Suggested Working Process

1. Backend and ML teammates fill in the answers in section 4. Record them in a shared contract (this file or another agreed location).
2. Frontend builds screens first using clearly labeled temporary mock data shaped by the section 3 field list, kept isolated in `services/` or an optional `mocks/` folder.
3. Once a contract is agreed, replace mocks with real service calls and update `PRD.md` to remove resolved `PENDING TEAM CONFIRMATION` items.
4. Test the full flow together: sign-in → onboarding → feed → filter → open → save, for both a new and a returning user.

## 6. Out of Scope for This Handoff

No account settings, analytics, contribution tracking, or saved-issues page. Any change to this scope must be added to `PRD.md` first.

## 7. Finalized Branding (recorded)

- **Product name:** **Fimmit**. The designs still show the placeholder "Project"; copy that contains it still needs final wording (`PENDING TEAM CONFIRMATION`).
- **Approved colors:** Yellow `#F6D945`, Orange `#EE8138`, Cream `#F7F4EC`, Black `#000000`, Red `#E4452F`, Green `#4BD08B`. Roles: cream = main background, black = typography and outlines, orange = primary actions, yellow = highlights and selected/hover states, red/green = feedback states.
- **Logo variants (supplied, must not be redesigned):** (1) standalone magnifying glass, use not yet assigned; (2) compact Fimmit wordmark, for the navbar; (3) large Fimmit wordmark with oversized magnifier, for an animated login-screen experience.
- **Where it is documented:** palette, roles, and logo table in `PRD.md` section 6; tokens, asset locations, and animation approach in `TECH_STACK.md` sections 4 and 7; branding and folder constraints in `RULES.md` sections 11 and 12.
- **Impact on backend and ML:** none on data contracts. Branding changes no endpoints, schemas, or authentication behavior.

**Open branding items** (all `PENDING TEAM CONFIRMATION`):
1. Final logo files: the supplied PNGs are low-resolution (83x72, 146x45, 247x138 px) with opaque white backgrounds. Transparent and/or SVG or higher-resolution versions are needed.
2. Intended use of logo variant 1.
3. Where the animated logo (variant 3) appears: the scope has no separate login page, so placement inside the existing Landing / sign-in flow must be agreed, along with what the animation does.
4. Selected / hover color conflict (yellow per brand rule vs. orange in the screenshots), plus white inputs, the yellow onboarding backdrop, and the green decorative underline.
5. Use of the ® symbol in copy.
6. Which UI states use red and green.
7. For the backend teammate: whether any user-visible string you control (for example, an application name shown during GitHub authorization, if applicable) should say Fimmit.

## 8. Next Development Step

**Proposed (order to be confirmed by the team):** build the design foundation before any screens.
1. Obtain final logo assets (open item 1).
2. Create `styles/tokens.css` with the approved palette and `styles/global.css`.
3. Place the logo files in `src/assets/` using the proposed names in `TECH_STACK.md` section 7.
4. Build the shared `components/common/` pieces and the Navbar with logo variant 2, then the Landing Page.

Nothing in this step is implemented yet. No application code has been changed by the branding update. Backend and ML work is unaffected.
