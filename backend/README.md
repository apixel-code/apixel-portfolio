# APIXEL Backend - Node.js / Express

This backend runs with Node.js/Express using `server.js`.
Legacy Python files (`server.py`, `requirements.txt`) may still exist in this folder from earlier migration work, but they are not used for runtime or deployment.

## Deploy to Render

### 1. Create a Web Service on Render

- Connect your GitHub repo
- **Root Directory**: `backend`
- **Runtime**: Node
- **Build Command**: `npm install`
- **Start Command**: `node server.js`

### 2. Environment Variables (Render Dashboard)

```
MONGO_URL=mongodb+srv://<user>:<pass>@cluster.mongodb.net/apixel_agency
DB_NAME=apixel_agency
JWT_SECRET=your_super_secret_key_here
PORT=8001
```

### 3. MongoDB Atlas Setup

1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. Create a free cluster
3. Create a database user
4. Whitelist `0.0.0.0/0` in Network Access
5. Copy the connection string

### 4. Frontend (Vercel)

Set `REACT_APP_BACKEND_URL` to your Render URL:

```
REACT_APP_BACKEND_URL=https://your-backend.onrender.com
```

## Local Development

```bash
cd backend
npm install
cp .env.example .env  # edit with your MongoDB URL
npm run dev
```

## API Endpoints

| Method | Endpoint              | Auth | Description     |
| ------ | --------------------- | ---- | --------------- |
| GET    | /api/health           | No   | Health check    |
| POST   | /api/auth/login       | No   | Admin login     |
| GET    | /api/blogs            | No   | List blogs      |
| GET    | /api/blogs/:slug      | No   | Single blog     |
| POST   | /api/blogs            | Yes  | Create blog     |
| PUT    | /api/blogs/:id        | Yes  | Update blog     |
| DELETE | /api/blogs/:id        | Yes  | Delete blog     |
| GET    | /api/services         | No   | List services   |
| POST   | /api/services         | Yes  | Create service  |
| PUT    | /api/services/:id     | Yes  | Update service  |
| DELETE | /api/services/:id     | Yes  | Delete service  |
| GET    | /api/templates        | No   | List templates  |
| GET    | /api/templates/:slug  | No   | Single template |
| POST   | /api/templates        | Yes  | Create template |
| PUT    | /api/templates/:id    | Yes  | Update template |
| DELETE | /api/templates/:id    | Yes  | Delete template |
| POST   | /api/contact          | No   | Submit contact  |
| GET    | /api/contact          | Yes  | List contacts   |
| PUT    | /api/contact/:id/read | Yes  | Mark read       |
| DELETE | /api/contact/:id      | Yes  | Delete contact  |
| GET    | /api/stats            | Yes  | Dashboard stats |

**Admin**: admin@agency.com / Admin@123
