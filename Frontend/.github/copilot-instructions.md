# Copilot Instructions for d:\Frontend

## Project Overview
This is a React + TypeScript project bootstrapped with Vite. The codebase is organized for modularity and scalability, with clear separation between UI components, pages, context, hooks, and services.

## Architecture & Key Patterns
- **Entry Point:** `src/main.tsx` mounts the app and sets up global providers.
- **Routing:** All page-level components are in `src/pages/`. Route guards and navigation logic are in `src/routes/guards.tsx`.
- **State Management:** Contexts (e.g., `src/context/AuthContext.tsx`, `src/context/auth.ts`) are used for global state, especially authentication.
- **Services:** API calls and external integrations are abstracted in `src/services/api.ts`.
- **UI Components:** Reusable components are in `src/components/`. Follow the pattern of props-driven, stateless components unless context is required.
- **Assets:** Images and SVGs are stored in `src/assets/` and `public/`.

## Developer Workflows
- **Build:** Use Vite (`vite.config.ts`). Run `npm run dev` for local development with HMR.
- **Type Checking:** TypeScript config is split (`tsconfig.app.json`, `tsconfig.node.json`). Use `tsc --noEmit` for type checks.
- **Linting:** ESLint is configured via `eslint.config.js`. For stricter rules, expand with recommendedTypeChecked or strictTypeChecked configs. See README for details.
- **Styling:** CSS modules are used (`App.css`, `index.css`). No CSS-in-JS detected.

## Conventions & Patterns
- **Component Structure:** Prefer function components. Use explicit props typing from `src/types.ts`.
- **Context Usage:** Wrap context providers at the top level in `main.tsx`.
- **API Calls:** Centralize all HTTP requests in `src/services/api.ts`. Avoid direct fetch/axios in components.
- **Routing Guards:** Use `src/routes/guards.tsx` for protected routes and auth logic.
- **File Naming:** Use PascalCase for components and pages, camelCase for hooks and context files.

## Integration Points
- **External:** Relies on Vite, React, TypeScript, and ESLint. No backend code present.
- **Assets:** Static files in `public/` are served directly. Use `src/assets/` for imports in code.

## Examples
- To add a new page: create a file in `src/pages/`, add a route in the router, and update navigation if needed.
- To add a new API method: extend `src/services/api.ts` and use it in components/pages.
- To add a new context: create in `src/context/`, wrap provider in `main.tsx`.

## References
- [README.md](../../README.md) for ESLint and TypeScript setup details
- `src/components/` for UI patterns
- `src/services/api.ts` for API integration
- `src/context/AuthContext.tsx` for context usage
- `src/routes/guards.tsx` for routing logic

---
**Feedback:** If any section is unclear or missing, please specify which workflows, patterns, or files need more detail.