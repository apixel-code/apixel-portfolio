# Apixel Portfolio - PRD

## Architecture
- **Frontend**: React 18 + Tailwind CSS + Framer Motion → Deploy: **Vercel**
- **Backend**: Node.js / Express → Deploy: **Render**
- **Database**: MongoDB → **MongoDB Atlas**
- **Auth**: JWT (jsonwebtoken + bcryptjs)

## Backend (Node.js) - /app/backend/
- `server.js` - Main Express server (all routes, auth, seed data)
- `package.json` - Dependencies: express, mongodb, jsonwebtoken, bcryptjs, cors, dotenv
- `README.md` - Full deployment guide for Render + Vercel

## API Routes (same as Python version)
- Auth: POST /api/auth/login
- Blogs: CRUD at /api/blogs
- Services: CRUD at /api/services
- Templates: CRUD at /api/templates
- Contact: CRUD at /api/contact
- Stats: GET /api/stats

## Deployment
### Backend → Render
- Root: `backend`, Build: `npm install`, Start: `node server.js`
- Env: MONGO_URL, DB_NAME, JWT_SECRET, PORT

### Frontend → Vercel
- Root: `frontend`
- Env: REACT_APP_BACKEND_URL=https://your-render-url.onrender.com

## Testing: 100% pass (backend + frontend)
