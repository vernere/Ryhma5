# Digital Notes App

This repository contains a **digital note-taking and annotation tool** with realtime collaboration features.  

## Structure

- `frontend/` – React client with note editor UI
- `backend/` – Node.js + Express API connecting to Supabase

## Getting Started

1. Install frontend dependencies:
   ```bash
   cd frontend
   bun i
   ```

2. Install backend dependencies:
   ```bash
   cd ../backend
   bun i
   ```

3. To run the development servers from `/App` for both frontend and backend, use:
   ```bash
   bun run dev:frontend
   bun run dev:backend
   ```