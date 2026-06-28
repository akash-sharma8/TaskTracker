# TaskTracker API

REST API for the TaskTracker application — Node.js + Express + MongoDB.

## Endpoints

| Method | Path              | Description         |
|--------|-------------------|---------------------|
| GET    | /api/health       | Health check        |
| GET    | /api/tasks        | List / filter tasks |
| GET    | /api/tasks/stats  | Aggregate stats     |
| GET    | /api/tasks/:id    | Get single task     |
| POST   | /api/tasks        | Create task         |
| PUT    | /api/tasks/:id    | Update task         |
| DELETE | /api/tasks/:id    | Delete task         |

## Setup
```bash
cp .env.example .env   # fill in MONGO_URI
npm install
npm run dev
```
