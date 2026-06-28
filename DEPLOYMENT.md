# Deployment Guide

## Option A — Render (Recommended, Free Tier)

### Backend on Render

1. Push your repo to GitHub.
2. Go to [render.com](https://render.com) → **New Web Service**.
3. Connect your GitHub repo, select the `backend` root directory.
4. Configure:
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. Add environment variables under **Environment**:
   ```
   NODE_ENV=production
   MONGO_URI=<your Atlas connection string>
   CLIENT_ORIGIN=https://your-frontend.vercel.app
   PORT=5000
   ```
6. Deploy → copy the service URL (e.g. `https://task-api.onrender.com`).

### Frontend on Vercel

1. Go to [vercel.com](https://vercel.com) → **New Project** → import repo.
2. Set **Root Directory** to `frontend`.
3. Add environment variable:
   ```
   VITE_API_BASE_URL=https://task-api.onrender.com/api
   ```
4. Deploy.

---

## Option B — Railway

### Backend
1. `railway init` inside `backend/`
2. `railway add` (MongoDB plugin) — copy `MONGO_URL` variable
3. Set env vars: `NODE_ENV`, `CLIENT_ORIGIN`, `MONGO_URI`
4. `railway up`

### Frontend
Deploy on Vercel or Netlify as above.

---

## Option C — VPS (Ubuntu + Nginx + PM2)

```bash
# On server
git clone https://github.com/you/task-tracker.git
cd task-tracker/backend && npm ci --omit=dev
pm2 start src/index.js --name task-api

cd ../frontend && npm ci && npm run build
# Serve dist/ with nginx
```

**Nginx config** (basic):
```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location / {
        root /var/www/task-tracker/frontend/dist;
        try_files $uri $uri/ /index.html;
    }
}
```

---

## MongoDB Atlas Setup

1. Create free cluster at [cloud.mongodb.com](https://cloud.mongodb.com).
2. **Database Access** → Add user with read/write role.
3. **Network Access** → Allow `0.0.0.0/0` (or your server IP).
4. **Connect** → Drivers → copy connection string:
   ```
   mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/tasktracker?retryWrites=true&w=majority
   ```

---

## Environment Variable Checklist

### Backend
| Variable        | Required | Example                                      |
|-----------------|----------|----------------------------------------------|
| `NODE_ENV`      | Yes      | `production`                                 |
| `PORT`          | No       | `5000`                                       |
| `MONGO_URI`     | Yes      | `mongodb+srv://user:pass@cluster.../db`      |
| `CLIENT_ORIGIN` | Yes      | `https://task-tracker.vercel.app`            |

### Frontend
| Variable             | Required | Example                                   |
|----------------------|----------|-------------------------------------------|
| `VITE_API_BASE_URL`  | Yes      | `https://task-api.onrender.com/api`       |
| `VITE_APP_NAME`      | No       | `TaskTracker`                             |

---

## Health Check

After deployment:
```bash
curl https://your-api.onrender.com/api/health
# {"status":"ok","timestamp":"2025-..."}
```
