# Contributing to Rakshak AI

Thank you for helping improve Rakshak AI. Contributions should strengthen operational clarity, reliability, accessibility, security, or maintainability without presenting prototype behavior as clinically validated functionality.

## Development workflow

1. Fork the repository and create a focused branch from `main`.
2. Install dependencies with `npm install`.
3. Start the local demo with `npm run dev`.
4. Make a small, reviewable change.
5. Run `npm run check` before opening a pull request.
6. Describe the user impact, test evidence, screenshots for UI work, and any operational or clinical assumptions in the pull request.

## Pull request checklist

- [ ] The change has a clear purpose and limited scope.
- [ ] TypeScript validation and the production build pass.
- [ ] New configuration values are documented in `.env.example` and `README.md`.
- [ ] UI changes work at mobile and desktop widths and include appropriate accessible labels.
- [ ] No credentials, patient data, or operationally sensitive records are included.
- [ ] AI-assisted behavior preserves human review and clearly communicates uncertainty.
- [ ] Database changes include a migration and have safe authorization rules.

## Code style

- Use TypeScript for new application code.
- Prefer explicit domain names over abbreviations in shared APIs and types.
- Keep components focused; move reusable data access into `src/lib`.
- Preserve the existing fallback behavior when external services are unavailable.
- Use conventional commit prefixes where practical: `feat:`, `fix:`, `docs:`, `refactor:`, `test:`, or `chore:`.

## Healthcare and emergency-response safety

Do not submit real patient information, protected health information, real credentials, or live emergency data. Features that influence triage, routing, resource allocation, or clinical decisions must expose their reasoning, allow qualified human override, and be described as decision support until appropriately validated.

## Reporting security issues

Do not open a public issue for a vulnerability. Follow the private process in [SECURITY.md](SECURITY.md).
