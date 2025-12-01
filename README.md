# Mini Team Chat (MERN + Socket.io) - Internship Assignment

This repository is a complete, deploy-ready **Mini Team Chat** app built with the **MERN** stack and **Socket.io** for real-time messaging.

## Features implemented
- User sign up / login (JWT)
- Channels (view, create)
- Real-time messaging with Socket.io
- Presence / online user list
- Message history with pagination (load older)
- Messages persisted to MongoDB
- Frontend built with React + Vite

## Structure
- `/backend` - Express server, Mongoose models, Socket.io integration
- `/frontend` - Vite + React frontend

## Quick local setup

1. Clone or extract files.
2. Backend:
   - `cd backend`
   - copy `.env.example` to `.env` and set `MONGO_URI` and `JWT_SECRET`
   - `npm install`
   - `npm run dev` (requires nodemon) or `npm start`
3. Frontend:
   - `cd frontend`
   - copy `.env.example` to `.env` if you want to set `VITE_BACKEND_URL`
   - `npm install`
   - `npm run dev`
4. Open frontend in browser (usually http://localhost:5173). Register two users in different browsers/tabs to demo real-time messages.

## Recording script (8-12 minutes)
1. Start backend and frontend.
2. Open two browser windows (or an incognito and a normal window).
3. Sign up `User A` in one window and `User B` in the other.
4. Create a channel from one user: `#general`.
5. Join the channel in both windows (click it).
6. Send messages from both users and show they appear instantly.
7. Show online user count updates when you close one tab.
8. Show pagination: send many messages then click "Load older messages".
9. Walkthrough codebase: open `backend/server.js`, `src/routes/*`, and frontend `src/components/*`.
10. Explain design choices: JWT for auth, Socket.io for simplicity and room management, MongoDB for flexible message storage.

## Notes / assumptions
- This is a scaffold ready for further polish (styling, ownership, private channels, typing indicators).
- Environment variables are required for DB and JWT secret.
- For deployment, use Vercel (frontend) and Render/Heroku/Render for backend + MongoDB Atlas for DB.

-- End of README
