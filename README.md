cat << 'EOF' > README.md

# DevNode – Developer Blogging & Publishing Platform (Hashnode Clone)

A full-stack developer blogging platform built with the MERN stack (MongoDB, Express.js, React, Node.js).

## Features

- **Authentication & Authorization:** Secure user registration and login using `bcryptjs` and `JWT` with protected routes.
- **Markdown Editor & Syntax Highlighting:** Write technical articles in Markdown with live preview and syntax-highlighted code blocks.
- **Draft & Publish Lifecycle:** Save articles as drafts, manage posts from a personal dashboard, and publish when ready.
- **Discovery & Search:** Public developer feed with tag-based filtering and real-time keyword search.
- **Author Profiles:** Public developer profile pages showcasing bio, tech stack, and published articles.

## Tech Stack

- **Frontend:** React (Vite), React Router, Context API, Axios, React Markdown, React Syntax Highlighter
- **Backend:** Node.js, Express.js, MongoDB, Mongoose, JWT, bcryptjs

## Local Setup

1. **Backend:**
   ```bash
   cd backend
   npm install
   # Create a .env file with PORT=5001, MONGO_URI, and JWT_SECRET
   npm run dev
   ```
