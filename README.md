# TaskTracker — MERN Stack

A full-stack Task Management application built with **MongoDB · Express · React · Node.js**.

---

## Features

| Feature | Detail |
|---|---|
| Full CRUD | Create, edit, delete, and toggle tasks without page refresh |
| Filtering | Filter by status, priority, and free-text search |
| Sorting | Sort by date created, due date, priority, or title |
| Form validation | Live client-side (custom hook) + server-side (express-validator) |
| Dark mode | Persisted to localStorage, respects OS preference |
| Dashboard | Live stats: total, in-progress, completed, high-priority, progress bar |
| Due-date alerts | Overdue and "due soon" highlighted on task cards |
| Tags | Comma-separated labels stored on each task |
| Notifications | Toast feedback on every create / update / delete |
| Responsive | Mobile-first layout with bottom tab navigation on small screens |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, Tailwind CSS v3, React Router v6 |
| State | React Context + `useReducer` |
| HTTP client | Axios with request/response interceptors |
| Backend | Node.js ≥ 18, Express 4, Helmet, Morgan |
| Database | MongoDB (Atlas or local), Mongoose 8 |
| Validation | express-validator (server) · custom `useForm` hook (client) |

---

## Project Structure

```
task-tracker/
├── frontend/
│   ├── public/
│   │   └── index.html
│   └── src/
│       ├── components/
│       │   ├── common/         # Header, Footer, Navbar
│       │   ├── tasks/          # TaskForm, TaskList, TaskCard, TaskFilters, TaskModal
│       │   └── shared/         # Button, Input, Select, Loading, EmptyState
│       ├── pages/              # Dashboard, TasksPage, NotFound
│       ├── context/            # TaskContext (global state), ThemeContext
│       ├── hooks/              # useTasks, useForm, useDebounce
│       ├── services/           # api.js (axios instance), taskService.js
│       ├── utils/              # constants.js, validators.js, formatters.js
│       └── styles/             # globals.css, variables.css
│
├── backend/
│   └── src/
│       ├── config/             # database.js — Mongoose connect + events
│       ├── models/             # Task.js — schema, indexes, pre-save hook
│       ├── controllers/        # taskController.js — CRUD + stats handlers
│       ├── routes/             # taskRoutes.js — wires validation + controller
│       ├── middleware/         # errorHandler.js, validation.js, logger.js
│       ├── validation/         # taskSchema.js — express-validator rule chains
│       ├── utils/              # constants.js, helpers.js
│       ├── server.js           # Express app factory (no listen call)
│       └── index.js            # Bootstrap: DB → listen → shutdown hooks
│
├── DEPLOYMENT.md
└── README.md
```

---

## Quick Start

### Prerequisites
- Node.js ≥ 18
- MongoDB running locally **or** a MongoDB Atlas URI
- npm ≥ 9

---

### 1 — Clone & Install

```bash
git clone https://github.com/your-username/task-tracker.git
cd task-tracker

# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

---

### 2 — Environment Variables

**Backend** — create `backend/.env`:
```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/tasktracker
CLIENT_ORIGIN=http://localhost:5173
```

**Frontend** — create `frontend/.env`:
```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_APP_NAME=TaskTracker
```

---

### 3 — Run in Development

Open two terminals:

```bash
# Terminal 1 — API
cd backend
npm run dev
# Listening on http://localhost:5000

# Terminal 2 — React app
cd frontend
npm run dev
# Open http://localhost:5173
```

---

### 4 — Production Build

```bash
cd frontend && npm run build   # outputs frontend/dist/
cd ../backend && npm start     # serves the JSON API
```

Point your web server at `frontend/dist/` and proxy `/api` to port 5000.

---

## API Reference

Base URL: `http://localhost:5000/api`

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/health` | Liveness check |
| GET | `/tasks` | List tasks (supports query params) |
| GET | `/tasks/stats` | Aggregated counts |
| GET | `/tasks/:id` | Single task |
| POST | `/tasks` | Create task |
| PUT | `/tasks/:id` | Update task |
| DELETE | `/tasks/:id` | Delete task |

### Query Params — `GET /tasks`

| Param | Values | Default |
|-------|--------|---------|
| `status` | `todo` · `in-progress` · `completed` | all |
| `priority` | `low` · `medium` · `high` | all |
| `search` | any string (full-text) | — |
| `sortBy` | `createdAt` · `dueDate` · `title` · `priority` | `createdAt` |
| `order` | `asc` · `desc` | `desc` |

### Task Payload

```json
{
  "title": "Design homepage",
  "description": "Wireframes and mockups for v2",
  "status": "in-progress",
  "priority": "high",
  "dueDate": "2025-04-01",
  "tags": ["design", "frontend"]
}
```

### Response Envelope

```json
{ "success": true, "task": { ... } }
{ "success": true, "tasks": [...], "count": 12 }
{ "success": false, "message": "Title is required", "errors": ["..."] }
```

---

## Architecture Notes

### Why Context + useReducer (not Redux)?

For a focused CRUD app with one data domain (tasks), the Context + useReducer
combination gives you:
- Predictable state transitions via typed action objects
- Co-located logic in one file (`TaskContext.jsx`)
- Zero extra dependencies

The trade-off is that every consumer re-renders on any context change.
Adding `useMemo` around the value or splitting context into data/dispatch
contexts solves this if the task list grows large.

### Why a custom `useForm` hook?

Libraries like Formik and React Hook Form are great but add weight.
`useForm` is ~50 lines and covers everything needed here:
- Tracks `values`, `errors`, `touched` per field
- Runs the validator only on touched fields (avoids premature error display)
- Exposes `handleSubmit` that runs full validation before calling `onSubmit`
- `reset(newValues)` re-initialises the form (used to populate the edit modal)

### Why `server.js` is separate from `index.js`?

`server.js` exports the Express `app` without calling `.listen()`.
This lets you import `app` in tests and call `supertest(app)` without
starting a real server or needing a running database.

`index.js` is the only file that connects to MongoDB and calls `listen()`.

---

## Component Reference

### Shared components (`src/components/shared/`)

| Component | Props | Purpose |
|---|---|---|
| `Button` | `variant`, `size`, `loading`, `icon` | Polymorphic button with spinner |
| `Input` | `label`, `error`, `hint`, `...inputProps` | Labelled text input with error state |
| `Select` | `label`, `error`, `options[]`, `placeholder` | Labelled select with options array |
| `Loading` | `text`, `className` | Centred spinner with caption |
| `EmptyState` | `title`, `description`, `action`, `icon` | Zero-state card with optional CTA |

### Task components (`src/components/tasks/`)

| Component | Responsibility |
|---|---|
| `TaskFilters` | Search + status/priority/sort controls, debounced search |
| `TaskForm` | Create and edit form; pre-fills from `task` prop |
| `TaskCard` | Single task display; inline toggle-complete, edit, delete |
| `TaskList` | Renders grid of `TaskCard`; owns the edit modal state |
| `TaskModal` | Accessible modal: Escape key, overlay click, scroll-lock |

---

## Extending the App

### Add authentication (JWT)
1. Install `jsonwebtoken`, `bcryptjs`
2. Add `User` model with hashed password
3. Add `userId` ref to `Task` schema; scope all queries to `req.user._id`
4. Add `/api/auth/register` and `/api/auth/login` routes
5. Add `authMiddleware` that verifies JWT and populates `req.user`
6. Attach `Authorization: Bearer <token>` header in `api.js`

### Add pagination
In `taskController.getAllTasks`:
```js
const page  = Number(req.query.page)  || 1
const limit = Number(req.query.limit) || 20
const tasks = await Task.find(filter)
  .sort(sort)
  .skip((page - 1) * limit)
  .limit(limit)
```

### Add a Kanban board view
Install `@dnd-kit/core` and `@dnd-kit/sortable`, create a `KanbanPage` that
groups tasks by status column and calls `updateTask` with the new status on drop.

---

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for step-by-step guides covering:
- Render (backend) + Vercel (frontend) — free tier
- Railway
- VPS with Nginx + PM2
- MongoDB Atlas setup
