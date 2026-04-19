# Post. Social Marketplace

I built this project for the InterIntel Junior Frontend Developer assessment. My goal was to create something that feels like a real, living product—not just a technical exercise.

I went with a "Post." brand identity (short for Trading Post) because it fits the collectible niche. It’s clean, fast, and focuses on the items and the people trading them.

## How it's built

I decided on a hybrid architecture. The main page shell is rendered on the server with **EJS**, which handles the heavy lifting of the initial layout. For the parts that need to feel "snappy" and interactive—like the search, real-time messaging, and negotiation forms—I used **Lit** web components.

This approach gives the best of both worlds: the reliability of a server-rendered app with the smooth UX of a modern frontend framework.

### Tech Stuff
- **Frontend**: Lit (TypeScript) + Tailwind CSS 4
- **Backend**: Express (the provided starter kit)
- **Build Tool**: Vite (configured to bundle straight into the server assets)

## Quick Start

If you want to run this locally, here's what to do:

1. Open a terminal in the `/server` folder and run `npm install` then `npm start`.
2. In another terminal, go to the `/client` folder, run `npm install` and `npm run build`.
3. Head over to `http://localhost:3000`.

I've documented my main technical choices in `ADR.md`.
