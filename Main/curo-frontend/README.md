# CURO Frontend

CURO is a smart doctor-patient management platform that lets patients search for healthcare providers and book visits online or in clinic.

## Prerequisites

* **Node.js**: Version 18 or higher is recommended.

## Setup

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Configure Environment Variables**:
   Copy `.env.example` to `.env` and configure your API base URL:
   ```bash
   cp .env.example .env
   ```
   Open `.env` and set `VITE_API_BASE_URL` (defaults to `http://localhost:8080/api`).

## Available Scripts

* `npm run dev`: Starts the local Vite development server.
* `npm run build`: Compiles and bundles the application for production deployment into the `dist/` directory.
* `npm run lint`: Runs static code analysis and linting checks using Oxlint.
* `npm run preview`: Previews the production build locally.
