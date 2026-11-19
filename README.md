# DevNode — Full-Stack Developer Blogging Platform

A full-stack MERN (MongoDB, Express.js, React, Node.js) blogging platform inspired by Hashnode, built for developers to write, publish, and discover technical articles in Markdown.

## Live Deployment

- **Frontend (Vercel):** [https://hashnode-clone-sigma.vercel.app](https://hashnode-clone-sigma.vercel.app)
- **Backend API (Render):** [https://devnode-api.onrender.com/api](https://devnode-api.onrender.com/api)
- **Database:** MongoDB Atlas

> **Note:** The backend API is hosted on Render free tier, so the first request after 15 minutes of inactivity may take ~30 seconds to wake up.

## Key Features

- **Authentication & Authorization:** JWT-based user registration, login, and protected routes for creating, editing, and deleting posts.
- **Markdown Publishing:** Rich post editor supporting Markdown formatting, headings, lists, and syntax-highlighted code blocks.
- **Discovery & Filtering:** Real-time article search by title, content, or tag, plus one-click topic filtering via the **Explore Tags** sidebar.
- **Reading Experience:** Automatic reading-time estimation, clean article view, and dedicated author profile pages.
- **Author Dashboard:** Centralized dashboard for managing published articles.

## Tech Stack

- **Frontend:** React (Vite), React Router, Context API, Axios
- **Backend:** Node.js, Express.js, Mongoose ODM, JSON Web Tokens (JWT), bcryptjs
- **Database & Infrastructure:** MongoDB Atlas, Render, Vercel

## Project Structure

```text
hashnode-clone/
├── backend/
│   ├── config/          # MongoDB connection setup
│   ├── controllers/     # Auth, Post, and User request handlers
│   ├── middleware/      # JWT authentication middleware
│   ├── models/          # Mongoose schemas (User, Post)
│   ├── routes/          # Express API routes
│   └── server.js        # Express app entry point
└── frontend/
    ├── public/
    ├── src/
    │   ├── api/         # Axios instance with JWT interceptor
    │   ├── components/  # Navbar, PostCard, ProtectedRoute
    │   ├── context/     # AuthContext & useAuth hook
    │   └── pages/       # Home, Login, Register, Editor, PostDetail, Dashboard, Profile
    └── vercel.json      # SPA client-side routing rewrite
```

## Local Development Setup

### 1. Clone the Repository
```bash
git clone [https://github.com/SKD-W/hashnode-clone.git](https://github.com/SKD-W/hashnode-clone.git)
cd hashnode-clone
```

### 2. Configure & Run the Backend
```bash
cd backend
npm install
```
Create a `.env` file inside `backend/`:
```env
MONGO_URI=mongodb://127.0.0.1:27017/hashnode-clone
JWT_SECRET=your_super_secret_jwt_key
PORT=5001
```
Start the backend server:
```bash
npm run dev
```

### 3. Configure & Run the Frontend
Open a second terminal:
```bash
cd frontend
npm install
npm run dev
```
The app will run locally at `http://localhost:5173`.
