# Post. Social Marketplace

I built this project for the InterIntel Junior Frontend Developer assessment. My goal was to create something that feels like a real, living product rather than just a quick technical exercise. I went with a brand identity that fits a premium collectible niche. It feels clean, fast, and focuses on the authentic items and the people trading them.

How it's built
I decided on a hybrid architecture. The main page shell is rendered on the server with EJS, which handles the heavy lifting of the initial layout. For the parts that need to feel snappy and interactive like the search, real-time messaging, and negotiation forms, I utilized Lit web components. This approach gives the best of both worlds by combining the reliability of a server-rendered app with the smooth UX of a modern interactive frontend framework. 

Tech Stack
The frontend is built natively using Lit with TypeScript, styled using Tailwind CSS 4. The backend is powered by Node.js and Express to serve the API and static assets. The build tool is Vite, properly configured to bundle the frontend code straight into the server assets folder natively without complex routing.

Quick Start
To run this project locally from the source code, you can use the newly configured root package commands. First, run npm install in the root folder. After modules exist, run npm run build to compile the frontend, then run npm start to fire up the Express server on port 3000. Alternatively, you can deploy it directly to a containerized platform like Render.

I've documented my main technical choices in the ADR document.
