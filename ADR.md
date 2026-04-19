# Architecture Decision Records (ADR)

This document tracks the major technical decisions I made while building the Post. Social Marketplace. I'll be updating this as the project progresses.

## 1. Hybrid Architecture (EJS + Lit)

- **Context**: The requirements called for a mix of server-side shells (EJS) and interactive client components (Lit).
- **Decision**: I'm using a Hybrid Shell approach. The Express server renders the main page structure via EJS, but delegates complex interactive areas—like the live search and messaging—to Lit web components.
- **Rationale**: This gives the app the speed and SEO of a server-rendered site while keeping the interactive parts modular and easy to manage with TypeScript and Lit.
- **Tradeoffs**: It adds a bit of complexity to the build process (using Vite to bundle into the Express assets), but the developer experience and performance gains are worth it.
