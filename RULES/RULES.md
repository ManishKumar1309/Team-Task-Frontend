# RULES: Team Conventions

Practical rules for our **two-person frontend team** working on a short deadline. Keep it simple, stay consistent, and update this file if the team agrees to change a rule.

---

## 1. React and JavaScript

- Use **functional components and hooks** only.
- One component per file. Keep components small and focused on one job.
- Use `const` by default, `let` only when reassigning; never `var`.
- Destructure props. Give every prop a sensible default or make it clearly required.
- Don't fetch data inside presentational components. Use `hooks/` and `services/`.
- Never hardcode recommendation data (issues, match percentages, explanations, tags) in components. Temporary mock data is allowed only in a clearly named mock file and must be removed before final delivery.
- Never invent API paths or response shapes in code. Wait for the agreed contract (see `HANDOFF.md`) and keep every assumption in one place (`services/`).
- Render lists with stable, unique `key` values (for example, an issue's real ID), never the array index when the list can change.
- Handle three states for any data-driven UI: **loading, error, empty**.
- Remove `console.log`, commented-out code, and unused imports before opening a PR.
- **ESLint must pass with no errors** before every commit and PR.

## 2. Naming

| Item | Convention | Example |
|------|-----------|---------|
| Component and page files | PascalCase `.jsx` | `IssueCard.jsx`, `HomePage.jsx` |
| Hooks | camelCase, `use` prefix | `useSavedIssues.js` |
| Services and utilities | camelCase | `recommendationService.js` |
| Variables and functions | camelCase | `selectedLanguage` |
| Event handlers | `handle` prefix; props use `on` prefix | `handleSave`, `onSave` |
| Booleans | `is`, `has`, `should` prefix | `isSelected`, `hasExplanation` |
| Constants | UPPER_SNAKE_CASE | `MAX_ISSUES` |
| CSS classes | kebab-case (BEM-style optional) | `issue-card__title` |
| CSS variables | kebab-case with group prefix | `--color-primary`, `--radius-pill` |
| Branches | see section 7 | `feature/issue-card` |

Use names from the product domain: *issue*, *recommendation*, *preference*, *onboarding step*, *language priority*. Don't mix "task", "ticket", and "issue" for the same thing.

## 3. Reusable Components

Build these once and reuse them everywhere. Don't recreate pill or button styles inside a page.

| Component | Used for |
|-----------|----------|
| `Button` | Orange primary ("Continue with Github", "Open issue", "Continue", "Generate feed"), outlined ("Back", "Save issue"), black ("Sign in", "Saved (N)") |
| `Pill` | Selectable options (goals, languages, interests, language filter) and static tags (`#tag`, `JS`, `react`) |
| `Badge` | Yellow level badge, difficulty badge, "88% match" badge |
| `HighlightText` | Tilted orange highlight behind headline words ("exact stack.", "for you") |
| `TextArea` / `TextInput` | Bio, "Other" fields |
| `Checkbox` | Difficulty filter |
| `ProgressSegments` | Onboarding progress |
| `IssueCard` | One recommended issue |

Rule of thumb: if a UI pattern appears in **two or more places**, make it a shared component in `components/common/`.

## 4. Styling

- Follow the design screenshots: cream backgrounds, black text and outlines, orange primary actions, yellow highlights and badges, rounded outlined buttons, pill tags, oversized editorial headlines, spacious layouts. Colors must come from the approved Fimmit palette (section 11).
- All colors, fonts, radii, and spacing come from **CSS variables** in `styles/tokens.css`. Don't scatter raw hex values through component files.
- Don't use inline styles except for truly dynamic values.
- Don't use `!important` unless there is no alternative; leave a comment explaining why.
- Keep styles close to the component or in a clearly named stylesheet, following the approach the team confirms (see `TECH_STACK.md`).
- Don't add a UI component library; the visual design is custom.
- If something in the design is unclear, ask the designer or teammate rather than guessing.

## 5. Responsive Design

- **Mobile-first**: write base styles for small screens, then add `min-width` media queries for larger ones.
- Breakpoint values: `PENDING TEAM CONFIRMATION` (define once in tokens and reuse).
- Only desktop mockups exist. Mobile layouts for the sidebar filters, navbar, and cards are `PENDING TEAM CONFIRMATION`. Until decided, use sensible stacking (for example, filters above the issue list) and note it in the PR.
- No horizontal page scrolling at any width. Let long text and long tag lists wrap.
- Use fluid sizing for oversized headlines (for example, `clamp()`) so they don't overflow on small screens.
- Make tap targets comfortably large on mobile (at least about 44x44 px).
- Test at minimum: a narrow phone width, a tablet width, and a normal laptop width before opening a PR.

## 6. Accessibility

- Use **semantic HTML**: `<nav>`, `<main>`, `<header>`, `<section>`, headings in logical order (one `<h1>` per page), `<button>` for actions, `<a>` for navigation.
- **Open issue** is a link to GitHub: use `<a href=... target="_blank" rel="noopener noreferrer">` and make it clear that it opens in a new tab.
- Every input has a visible `<label>` (for example, "Short bio (optional)"). Placeholder text is not a label.
- Selectable pills must expose their state. Use `aria-pressed` for toggle buttons, or real checkbox/radio inputs styled as pills. **Don't rely on color alone**: orange vs. yellow vs. cream must be paired with another cue (check icon, outline, or text) where state matters.
- The difficulty filter uses real checkboxes. Onboarding single-choice groups (goal, difficulty) should behave like radio groups.
- Progress indicator: expose the step to assistive tech (for example, "Question 2 of 4" as text and `aria-current="step"` or `role="progressbar"` with values).
- Keep a **visible focus style** on every interactive element. Never remove outlines without replacing them.
- Maintain strong text contrast. Check orange and yellow backgrounds against black text.
- Icon-only controls need an accessible name. Decorative icons use `aria-hidden="true"`.
- Respect `prefers-reduced-motion` for any animation (such as a rotating hero badge).
- Everything must be usable by keyboard alone.
- Announce loading and error states in a way screen readers can detect (for example, `aria-live`).

## 7. Git Workflow

Two people, one repository. Keep it lightweight.

- `main` is always in a working state. **Never push directly to `main`.**
- Create a branch per task, from an up-to-date `main`:
  - `feature/<short-description>`, such as `feature/landing-hero`
  - `fix/<short-description>`, such as `fix/pill-focus-style`
  - `docs/<short-description>`, such as `docs/update-handoff`
  - `chore/<short-description>`, such as `chore/eslint-config`
- Divide work by screen or component to avoid conflicts (for example, one person on Landing + Onboarding, the other on Home components). Agree before both editing the same file.
- Commit small and often, with clear messages in the imperative mood, optionally prefixed: `feat: add IssueCard`, `fix: handle empty tags`, `docs: update PRD`, `style:`, `refactor:`, `chore:`.
- Pull/merge the latest `main` into your branch before opening a PR, and resolve conflicts locally.
- Do not commit: `node_modules/`, build output (`dist/`), `.env` files with real values, editor settings, or large unused assets.
- Whether a separate `dev` branch is needed: `PENDING TEAM CONFIRMATION` (default: not needed).

## 8. Pull Requests

- Every change goes through a PR into `main`, even small ones.
- **The other teammate reviews and approves** before merging. Don't merge your own PR without a review (unless the deadline forces it and you've told your teammate).
- Keep PRs small and focused on one feature or fix.
- PR description should include:
  1. What changed and why
  2. Which screen or requirement it covers (for example, `HP-5`)
  3. Screenshots for UI changes (desktop and mobile)
  4. Any assumptions or open questions (tag `PENDING TEAM CONFIRMATION` items)
- Before requesting review, confirm: ESLint passes, the app builds, no `console.log`, no secrets, no invented data, responsive and keyboard checks done.
- Reviewer checks: matches the design, follows these rules, handles loading/error/empty states, no out-of-scope features.
- Squash or merge is fine; pick one and use it consistently: `PENDING TEAM CONFIRMATION`.
- Delete the branch after merging.

## 9. Secrets and Environment Variables

- **Never commit secrets**: tokens, API keys, OAuth client secrets, passwords, or private URLs.
- Real values live in `.env.local` (git-ignored). Commit only `.env.example` with variable **names** and placeholder text.
- Confirm `.gitignore` covers `.env`, `.env.*` (except `.env.example`), and `node_modules` **before the first commit**.
- **Anything with a `VITE_` prefix ends up in the browser bundle and is public.** Only put non-secret values there (for example, the backend base URL). A GitHub OAuth *client secret* must **never** be in the frontend; that belongs to the backend.
- Don't paste secrets in chat, issues, PR descriptions, screenshots, or commit messages.
- If a secret is committed by mistake: tell your teammate immediately, **revoke/rotate it**, then remove it from the repository. Deleting it in a later commit is not enough because Git history keeps it.
- Share real configuration values privately, never via the repository.

## 10. Scope Discipline

- Build only what is in `PRD.md`. If an idea isn't in the designs or flowchart, don't build it; raise it with the team first.
- Don't claim a feature is done unless it works in the running app and has been reviewed.
- When something is unclear, write it down as `PENDING TEAM CONFIRMATION` in the PR or in `HANDOFF.md` instead of guessing in code.

## 11. Branding (Fimmit)

The product name is **Fimmit**. Spell it exactly like that in UI copy, code comments, and docs. Don't use "Project" (the design placeholder) in shipped UI. The use of the ® symbol in written copy is `PENDING TEAM CONFIRMATION`.

### Approved colors (the only colors allowed)

| Color | Hex | Role |
|-------|-----|------|
| Cream | `#F7F4EC` | Main background |
| Black | `#000000` | Typography and outlines |
| Orange | `#EE8138` | Primary actions |
| Yellow | `#F6D945` | Highlights, selected / hover states |
| Red | `#E4452F` | Feedback states (errors) |
| Green | `#4BD08B` | Feedback states (success) |

- Define them once in `styles/tokens.css` and reference the variables. No raw hex values in components, and **no new colors** without team approval.
- Selected pill color is `PENDING TEAM CONFIRMATION` (brand rule says yellow; the screenshots show orange). Until decided, don't invent a third style; flag it in the PR.
- Red and green are for feedback states only. Always pair them with an icon or text, never color alone.
- Contrast (WCAG, computed from the hex values): black text passes on every approved color (cream 19.1:1, yellow 14.9:1, green 10.7:1, orange 7.8:1, red 5.2:1). **White text fails** on yellow (1.4:1), orange (2.7:1), and green (2.0:1), and is below 4.5:1 on red (4.1:1). Red text on cream is 3.7:1 and green text on cream is 1.8:1, so don't use red or green as small text color on cream. Use black text or a filled badge instead.

### Logos

Three supplied logo variants exist. Use each only where it belongs:

| Variant | Use |
|---------|-----|
| 1. Standalone magnifying glass | Not yet assigned (`PENDING TEAM CONFIRMATION`) |
| 2. Compact wordmark + magnifier | Navbar |
| 3. Large wordmark + oversized magnifier | Animated login-screen experience (placement `PENDING TEAM CONFIRMATION`) |

- **Do not redesign, recolor, redraw, crop, rotate, stretch, or otherwise distort the artwork**, and don't swap one variant for another.
- Scale only with the aspect ratio locked. Don't enlarge a raster file past its native size.
- Don't ship the current PNGs on the cream background: they have an opaque white background. Wait for transparent and/or SVG versions (see `HANDOFF.md`), and don't remove the background ourselves without the brand owner's approval.
- Give the logo an accessible name (for example, `alt="Fimmit"`). Make it a link to the Landing Page only if the team confirms that behavior.
- Respect `prefers-reduced-motion` for the animated logo; show a static version.
- Keep animation CSS-based. A new animation dependency needs team agreement.

## 12. Folder-Structure Constraints

- The folder structure in `TECH_STACK.md` section 3 is **approved and fixed**. Don't add, rename, move, or delete folders.
- Brand files go directly in `src/assets/` (proposed names are in `TECH_STACK.md` section 7). No `brand/` or `logos/` subfolder unless the team approves it.
- Don't add new files to the tree unless needed for an in-scope feature, and list any new file in the PR description.
- Don't add new pages. In particular, the animated logo does **not** justify a separate login page; its placement within the existing Landing / sign-in flow is `PENDING TEAM CONFIRMATION`.
- Don't add dependencies for branding (fonts, animation, icon packs) without team agreement.
