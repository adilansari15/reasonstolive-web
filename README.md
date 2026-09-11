# ReasonsToLive — Mental Wellness Community Platform

> A safe space where people anonymously share hope, struggles, and reasons to keep moving forward.

---

## 🚀 Running Locally on Your PC

### 1. Prerequisites
- **Node.js**: Version 18, 20, or higher installed ([Download Node.js](https://nodejs.org/))
- **npm** (comes bundled with Node.js) or **pnpm** / **yarn**

---

### 2. Quick Start Steps

1. **Extract / Open the project folder** in your terminal:
   ```bash
   cd ReasonsToLive
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **Open your browser**:
   Visit [http://localhost:3000](http://localhost:3000)

The development server boots both the Express REST API (`/api/*`) and the Vite React frontend on port 3000.

---

### 3. Production Build & Test Locally

To test the compiled production version:
```bash
# 1. Build client bundle and bundle the server
npm run build

# 2. Start the production server
npm run start
```
Your app will be live at [http://localhost:3000](http://localhost:3000).

---

## 🌐 Deployment Options

### Option 1: One-Click Cloud Run Deploy (Direct from AI Studio)
In the top-right header or Settings menu of Google AI Studio, click **Deploy to Cloud Run**. This automatically builds the container and provides a live public HTTPS URL with no server setup required.

---

### Option 2: Deploy to Render / Railway / Fly.io (Unified Full-Stack)
Because this project bundles the Vite frontend and Express API together into a single server, you can host the entire app on any modern Node.js cloud host:

#### On Render (Web Service):
1. Push your code to a GitHub repository.
2. Log into [Render.com](https://render.com) and click **New +** → **Web Service**.
3. Connect your GitHub repository.
4. Set the following settings:
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm run start`
5. Click **Deploy Web Service**.

#### On Railway:
1. Connect your GitHub repository in [Railway.app](https://railway.app).
2. Railway will automatically detect Node.js and run `npm run build` followed by `npm run start`.

---

### Option 3: Separate Deployments (Vercel Frontend + Render Backend)
If you prefer separating the frontend and backend:
1. **Backend (Render / Railway)**:
   - Deploy `server.js` with Express listening on `process.env.PORT || 3000`.
2. **Frontend (Vercel)**:
   - Deploy as a Vite React project.
   - Set the environment variable `VITE_API_BASE_URL=https://your-render-backend-url.onrender.com` in Vercel project settings.
   - Update `src/services/api.js` to use `import.meta.env.VITE_API_BASE_URL || ''`.

---

## 🛠️ Project Structure

- `server.js` — Express REST API endpoints (`/api/posts`, `/api/reasons`, `/api/stats`) & Vite SPA middleware
- `server/db.js` — Local persistent database layer with JSON backup (`data/db.json`)
- `server/seeds.js` — Seed posts and community reasons
- `src/pages/` — Home, Anonymous Wall, Share Story, Reasons To Live, and Support Resources (.jsx)
- `src/components/` — Navbar, Footer, PostCard, ReasonCard, SupportCard, SearchBar, CategoryFilter, ThemeToggle (.jsx)
- `src/context/` — Dark mode / Theme provider (ThemeContext.jsx)
- `src/services/` — API service client (api.js)
- `src/utils/` — Category & crisis helpline data (constants.js)
