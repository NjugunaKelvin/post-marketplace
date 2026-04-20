# Architecture Decision Records (ADR)

This document tracks the major technical decisions I made while building the Post interactive marketplace.

Hybrid Architecture Decision
The core requirements called for a mix of server-side shells (EJS) and interactive client components (Lit). I chose to implement a Hybrid Shell approach. The Express server renders the main page structure via EJS, but cleanly delegates complex interactive areas like the live search, checkout flows, and HTTP Polling mechanisms to Lit web components.

This design gives the application incredible loading speed and native SEO capabilities inherent to server-rendered sites, while keeping the highly interactive stateful parts modular and strictly typed using TypeScript. It adds slight complexity to the build tooling by requiring Vite to bundle the static scripts directly into the Express public asset pipeline, but the resulting developer experience and premium user interface optimizations make the tradeoff completely worth it.
